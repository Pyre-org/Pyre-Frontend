import { cn } from "@renderer/lib/utils";
import { UploadIcon } from "lucide-react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import Loader from "./Loader";

interface DropzoneProps extends DropzoneOptions {
  isLoading?: boolean;
}

function Dropzone({ isLoading, ...props }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border border-dashed rounded-md transition-all duration-300 ease-in-out py-16 px-8 flex justify-center items-center cursor-pointer",
        isDragActive && "bg-blue-500/10 border-primary-foreground",
      )}
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex flex-col gap-4 justify-center items-center">
        {!isLoading ? (
          <>
            <UploadIcon className="w-6 h-6" />
            <span>
              {isDragActive
                ? "여기에 파일을 드롭하여 업로드"
                : "드래그 앤 드롭 혹은 클릭하여 파일 업로드"}
            </span>
          </>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center">
            <Loader />
            <span>파일을 업로드하는 중입니다...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropzone;
