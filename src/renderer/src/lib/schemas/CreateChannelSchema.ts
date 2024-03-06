import { formDropzoneSchema } from "@renderer/components/form/FormDropzone";
import { z } from "zod";

export const CreateChannelSchema = z.object({
  title: z
    .string()
    .min(3, "3글자 이상 입력해주세요")
    .max(255, "255글자 이하로 입력해주세요"),
  description: z.string().max(500, "500글자 이하로 입력해주세요"),
  genre: z.string(),
  imageUrl: z.array(formDropzoneSchema),
});

export type CreateChannelSchemaType = z.infer<typeof CreateChannelSchema>;
