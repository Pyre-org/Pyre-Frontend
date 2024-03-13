import { IpcRendererListener } from "@electron-toolkit/preload";
import { uploadFileToS3 } from "@renderer/lib/queries/upload";
import { dataURLtoBlob } from "@renderer/lib/utils";
import { ICaptureResponse } from "@renderer/types/schema";
import { useEffect } from "react";

function useCapture() {
  useEffect(() => {
    const handler: IpcRendererListener = async (_, res: ICaptureResponse) => {
      try {
        const file = new File([dataURLtoBlob(res.dataURL)], res.name, {
          type: "image/png",
        });

        const url = await uploadFileToS3(file);
        window.api.showCaptureNotification(url, res.path);
      } catch (error) {
        console.error(error);
      }
    };

    const ref = window.electron.ipcRenderer.on("SCREENSHOT_CAPTURED", handler);

    return ref;
  }, []);
}

export default useCapture;
