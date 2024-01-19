import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("이메일 형식을 입력해주세요."),
  password: z.string().min(8, "8자 이상 입력해주세요."),
  nickname: z.string().min(2, "2자 이상 입력해주세요."),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
