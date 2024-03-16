import { IpcRendererListener } from "@electron-toolkit/preload";
import { useGetFeedSettings } from "@renderer/lib/queries/auth";
import { useUploadFeedMutation } from "@renderer/lib/queries/feed";
import { uploadFileToS3 } from "@renderer/lib/queries/upload";
import { dataURLtoBlob } from "@renderer/lib/utils";
import { ICaptureResponse } from "@renderer/types/schema";
import { useEffect } from "react";

function useCapture() {
  const { data: profileData } = useGetFeedSettings();
  const uploadFeedMutation = useUploadFeedMutation();

  useEffect(() => {
    const handler: IpcRendererListener = async (_, res: ICaptureResponse) => {
      try {
        const file = new File([dataURLtoBlob(res.dataURL)], res.name, {
          type: "image/png",
        });

        const url = await uploadFileToS3(file);
        if (profileData?.useCaptureRoom && profileData.captureRoomSpaceId) {
          uploadFeedMutation.mutate({
            url,
            spaceId: profileData.captureRoomSpaceId,
            title: new Date().toLocaleString(),
            description: "",
          });
        }
        if (profileData?.spaceId) {
          uploadFeedMutation.mutate({
            url,
            spaceId: profileData.spaceId,
            title: new Date().toLocaleString(),
            description: "",
          });
        }
        window.api.showCaptureNotification(url, res.path);
      } catch (error) {
        console.error(error);
      }
    };

    const ref = window.electron.ipcRenderer.on("SCREENSHOT_CAPTURED", handler);

    return ref;
  }, [profileData]);
}

export default useCapture;
