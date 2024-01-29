import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
export const api = {
  getSources: (
    opts: Electron.SourcesOptions,
  ): Promise<Electron.DesktopCapturerSource[]> =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
  getPrimaryScreen: (): Promise<Electron.Display> =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_PRIMARY_SCREEN"),
  captureScreenArea: (area: Electron.Rectangle): Promise<void> =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_CAPTURE_SCREEN_AREA", area),
  closeScreenshotWindow: (): Promise<void> =>
    ipcRenderer.invoke("CLOSE_SCREENSHOT_WINDOW"),
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
