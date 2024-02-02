import { z } from "zod";

export const CreateChannelSchema = z.object({
  title: z
    .string()
    .min(3, "3글자 이상 입력해주세요")
    .max(255, "255글자 이하로 입력해주세요")
    .default(""),
  description: z.string().default(""),
  genre: z.string().default(""),
  imageUrl: z.string().default(""),
});

export type CreateChannelSchemaType = z.infer<typeof CreateChannelSchema>;
