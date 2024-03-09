import { formDropzoneSchema } from "@renderer/components/form/FormDropzone";
import { z } from "zod";

export const CreateChannelSchema = z.object({
  title: z
    .string({ required_error: "채널 이름을 입력해주세요" })
    .min(3, "3글자 이상 입력해주세요")
    .max(255, "255글자 이하로 입력해주세요"),
  description: z
    .string({ required_error: "채널 설명을 입력해주세요" })
    .max(500, "500글자 이하로 입력해주세요"),
  genre: z.string({ required_error: "채널 장르를 선택해주세요" }),
  imageUrl: z.array(formDropzoneSchema, {
    required_error: "채널 이미지를 업로드해주세요",
  }),
});

export type CreateChannelSchemaType = z.infer<typeof CreateChannelSchema>;
