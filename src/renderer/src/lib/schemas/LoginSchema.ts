import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("이메일 형식을 입력해주세요."),
  password: z.string().min(8, "8자 이상 입력해주세요."),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
