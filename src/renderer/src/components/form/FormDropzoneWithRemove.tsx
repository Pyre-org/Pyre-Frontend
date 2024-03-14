import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { ReactNode } from "react";

interface FormDropzoneWithRemoveProps {
  dropzone: ReactNode;
  imageUrl?: string;
  resetImageUrl?: () => void;
}

function FormDropzoneWithRemove({
  dropzone,
  imageUrl,
  resetImageUrl,
}: FormDropzoneWithRemoveProps) {
  return (
    <>
      {dropzone}
      <>
        {imageUrl && (
          <div className="mb-4 flex flex-col gap-2">
            <img src={imageUrl} alt="profile" />
            <Button variant="outline" onClick={resetImageUrl}>
              <Trash2Icon className="size-4 mr-2" />
              <span>이미지 삭제</span>
            </Button>
          </div>
        )}
      </>
    </>
  );
}
export default FormDropzoneWithRemove;
