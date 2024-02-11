import { ReactNode, useState } from "react";

interface ImageProps extends Omit<React.ComponentProps<"img">, "onError"> {
  fallback?: ReactNode | string;
}

function Image({ fallback, ...props }: ImageProps) {
  const [error, setError] = useState(false);
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (typeof fallback === "string") {
      e.currentTarget.src = fallback;
    }
  };
  if (error && typeof fallback !== "string") {
    return fallback;
  }
  return <img {...props} onError={handleError} />;
}

export default Image;
