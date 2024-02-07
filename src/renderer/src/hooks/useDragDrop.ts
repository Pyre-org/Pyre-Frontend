import { useEffect } from "react";

export const useDragDrop = () => {
  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.body.addEventListener("dragover", preventDefault);
    document.body.addEventListener("drop", preventDefault);

    return () => {
      document.body.removeEventListener("dragover", preventDefault);
      document.body.removeEventListener("drop", preventDefault);
    };
  });
};
