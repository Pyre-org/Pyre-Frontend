import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "값을 입력해주세요." })
    .email("이메일 형식을 입력해주세요."),
  password: z
    .string({ required_error: "값을 입력해주세요." })
    .min(8, "8자 이상 입력해주세요."),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
