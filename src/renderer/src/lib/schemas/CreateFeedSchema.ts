import { formDropzoneSchema } from "@renderer/components/form/FormDropzone";
import { z } from "zod";

export const CreateFeedSchema = z.object({
  title: z.string({ required_error: "제목을 입력해주세요" }),
  description: z.string().optional(),
  imageUrl: z.array(formDropzoneSchema.partial()).optional(),
});

export type CreateFeedSchemaType = z.infer<typeof CreateFeedSchema>;
