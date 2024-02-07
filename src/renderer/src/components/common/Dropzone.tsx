import { cn } from "@renderer/lib/utils";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  dropzoneProps?: Omit<DropzoneOptions, "onDrop">;
}

function Dropzone({ onDrop, dropzoneProps }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropzoneProps,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border rounded-md p-4 cursor-pointer border-dashed transition-all duration-300 ease-in-out flex justify-center items-center",
        isDragActive
          ? "border-primary-foreground bg-blue-200"
          : "border-border",
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-sm my-4 text-muted-foreground">
          여기에 파일을 드롭해서 업로드
        </p>
      ) : (
        <p className="text-sm my-4 text-muted-foreground">
          드래그 앤 드롭 혹은 클릭해서 파일 업로드
        </p>
      )}
    </div>
  );
}

export default Dropzone;
