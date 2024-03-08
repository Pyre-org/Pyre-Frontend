import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

interface ICaptureResponse {
  dataURL: string;
  width: number;
  height: number;
  name: string;
  path: string;
}

// Custom APIs for renderer
export const api = {
  getSources: (
    opts: Electron.SourcesOptions,
  ): Promise<Electron.DesktopCapturerSource[]> =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
  getPrimaryScreen: (): Promise<Electron.Display> =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_PRIMARY_SCREEN"),
  // returns data url of the screenshot
  captureScreenArea: (area: Electron.Rectangle): Promise<ICaptureResponse> =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_CAPTURE_SCREEN_AREA", area),
  closeScreenshotWindow: (): Promise<void> =>
    ipcRenderer.invoke("CLOSE_SCREENSHOT_WINDOW"),
  openPath: (path: string): Promise<void> =>
    ipcRenderer.invoke("OPEN_PATH", path),
  handleOAuthLogin: (params: { url: string; authority: string }) =>
    ipcRenderer.invoke("OAUTH_LOGIN", params),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
