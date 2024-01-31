import { useEffect, useState } from "react";

function Screenshot() {
  const [show, setShow] = useState(false);
  const [pivot, setPivot] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

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
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
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

  return (
    <div
      className="container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {show && (
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
