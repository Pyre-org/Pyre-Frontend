import { IpcRendererListener } from "@electron-toolkit/preload";
import { useGetFeedSettings } from "@renderer/lib/queries/auth";
import { useUploadFeedMutation } from "@renderer/lib/queries/feed";
import { uploadFileToS3 } from "@renderer/lib/queries/upload";
import { dataURLtoBlob } from "@renderer/lib/utils";
import { ICaptureResponse } from "@renderer/types/schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseCaptureProps {
  setOpenPopup: (open: boolean) => void;
}

function useCapture({ setOpenPopup }: UseCaptureProps) {
  const [url, setUrl] = useState<string | null>(null);
  const { data: profileData } = useGetFeedSettings();
  const uploadFeedMutation = useUploadFeedMutation();

  useEffect(() => {
    const handler: IpcRendererListener = async (_, res: ICaptureResponse) => {
      try {
        const file = new File([dataURLtoBlob(res.dataURL)], res.name, {
          type: "image/png",
        });

        const url = await uploadFileToS3(file);
        setUrl(url);
        if (profileData?.useFeedInfo) {
          setOpenPopup(true);
          window.api.focusMainWindow();
        } else {
          onSubmit({ title: new Date().toLocaleString(), url });
        }

        window.api.showCaptureNotification(url, res.path);
      } catch (error) {
        console.error(error);
      }
    };

    const ref = window.electron.ipcRenderer.on("SCREENSHOT_CAPTURED", handler);

    return ref;
  }, [profileData]);

  const onSubmit = (data: {
    title: string;
    description?: string;
    url: string;
  }) => {
    if (profileData?.useCaptureRoom && profileData.captureRoomSpaceId) {
      uploadFeedMutation.mutate(
        { ...data, spaceId: profileData.captureRoomSpaceId },
        {
          onSuccess: () => {
            toast.success("캡처룸에 업로드 되었습니다");
          },
          onError: (error) => {
            toast.error("캡처룸 업로드에 실패했습니다", {
              description: error.response?.data.reason,
            });
          },
        },
      );
    }
    if (profileData?.spaceId) {
      uploadFeedMutation.mutate(
        { ...data, spaceId: profileData.spaceId },
        {
          onSuccess: () => {
            toast.success("피드가 업로드 되었습니다");
          },
          onError: (error) => {
            toast.error("피드 업로드에 실패했습니다", {
              description: error.response?.data.reason,
            });
          },
        },
      );
    }
    setOpenPopup(false);
  };

  return {
    onSubmit,
    url,
  };
}

export default useCapture;
