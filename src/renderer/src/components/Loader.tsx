import { cn } from "@renderer/lib/utils";
import { Loader2Icon } from "lucide-react";

interface LoaderProps {
  className?: string;
}

function Loader({ className }: LoaderProps) {
  return (
    <Loader2Icon
      className={cn("w-6 h-6 animate-spin text-foreground", className)}
    />
  );
}

export default Loader;
