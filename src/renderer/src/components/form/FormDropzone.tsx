import FormBase from "./FormBase";
import { Control, FieldValues, Path } from "react-hook-form";
import { DropzoneOptions } from "react-dropzone";
import Dropzone from "../common/Dropzone";
import { useUploadFileToS3Mutation } from "@renderer/lib/queries/upload";
import { toast } from "sonner";
import { z } from "zod";

interface FormDropzoneProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  dropzoneOptions?: Omit<DropzoneOptions, "onDrop">;
  append?: boolean;
}

export const formDropzoneSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string(),
  lastModified: z.number(),
  size: z.number(),
});

export type FormDropzoneSchemaType = z.infer<typeof formDropzoneSchema>;

function FormDropzone<T extends FieldValues>(props: FormDropzoneProps<T>) {
  const { dropzoneOptions, append, ...rest } = props;
  const uploadMutation = useUploadFileToS3Mutation();
  const handleUpload = async (files: File[]) => {
    try {
      const responses = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          url: await uploadMutation.mutateAsync(file),
          type: file.type,
          lastModified: file.lastModified,
          size: file.size,
        })),
      );
      return responses;
    } catch (error) {
      console.error(error);
      toast.error("파일을 업로드하는 중 오류가 발생했습니다.");
      return [];
    }
  };

  return (
    <FormBase {...rest}>
      {({ field }) => (
        <div ref={field.ref} className="w-full flex flex-col gap-3">
          <Dropzone
            {...dropzoneOptions}
            isLoading={uploadMutation.isPending}
            onDrop={async (files) =>
              !append
                ? field.onChange(await handleUpload(files))
                : field.onChange([
                    ...(field.value ?? []),
                    ...(await handleUpload(files)),
                  ])
            }
          />
        </div>
      )}
    </FormBase>
  );
}

export default FormDropzone;
