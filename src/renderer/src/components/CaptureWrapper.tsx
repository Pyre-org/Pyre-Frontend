import useCapture from "@renderer/hooks/useCapture";
import { PropsWithChildren } from "react";

function CaptureWrapper({ children }: PropsWithChildren) {
  useCapture();

  return children;
}

export default CaptureWrapper;
