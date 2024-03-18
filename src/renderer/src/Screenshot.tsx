import { useEffect, useLayoutEffect, useState } from "react";
import { cn } from "./lib/utils";
import { IpcRendererListener } from "@electron-toolkit/preload";

function Screenshot() {
  const [show, setShow] = useState(false);
  const [pivot, setPivot] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [mode, setMode] = useState<"area" | "fullscreen">("area");

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setPivot({ x: e.clientX, y: e.clientY });
    setCursor({ x: e.clientX, y: e.clientY });
    setShow(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!show) return;
    const { x, y } = pivot;
    const { clientX, clientY } = e;
    const width = Math.abs(clientX - x);
    const height = Math.abs(clientY - y);
    const left = Math.min(clientX, x);
    const top = Math.min(clientY, y);
    setRect({ top, left, width, height });
    setCursor({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setRect({ top: 0, left: 0, width: 0, height: 0 });
    setShow(false);
    window.api
      .captureScreenArea({
        x: mode === "area" ? rect.left : 0,
        y: mode === "area" ? rect.top : 0,
        width: mode === "area" ? rect.width : window.screen.width,
        height: mode === "area" ? rect.height : window.screen.height,
      })
      .then(() => {
        window.api.closeScreenshotWindow();
      });
  };

  useEffect(() => {
    const closeScreenshotWindow = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.api.closeScreenshotWindow();
    };
    window.addEventListener("keydown", closeScreenshotWindow);
    return () => {
      window.removeEventListener("keydown", closeScreenshotWindow);
    };
  }, []);

  useLayoutEffect(() => {
    const handler: IpcRendererListener = (_, mode) => {
      setMode(mode);
    };
    const ref = window.electron.ipcRenderer.on("CHANGE_CAPTURE_MODE", handler);

    return ref;
  }, []);

  return (
    <div
      className={cn("container", mode)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {mode === "area" && show && (
        <>
          <div
            className="capture-area"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
          />
          <div
            className="capture-info"
            style={{
              top: cursor.y,
              left: cursor.x,
            }}
          >
            <span>{`width: ${rect.width}px`}</span>
            <span>{`height: ${rect.height}px`}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Screenshot;
