import { z } from "zod";
import { checkEmail, checkNickname } from "../queries/auth";

export const RegisterSchema = z.object({
  email: z
    .string({ required_error: "값을 입력해주세요" })
    .min(5, "5자 이상 입력해주세요.")
    .max(40, "40자 이하로 입력해주세요.")
    .email("이메일 형식을 입력해주세요.")
    .refine(
      async (v) => {
        const { present } = await checkEmail(v);
        return !present;
      },
      {
        message: "이미 존재하는 이메일입니다.",
      },
    ),
  password: z
    .string({ required_error: "값을 입력해주세요" })
    .min(8, "8자 이상 입력해주세요.")
    .max(40, "40자 이하로 입력해주세요."),
  nickname: z
    .string({ required_error: "값을 입력해주세요" })
    .min(5, "5자 이상 입력해주세요.")
    .max(12, "12자 이하로 입력해주세요.")
    .regex(/^[a-zA-Z0-9]+$/, "영문과 숫자만 입력해주세요.")
    .refine(
      async (v) => {
        const { present } = await checkNickname(v);
        return !present;
      },
      { message: "이미 존재하는 닉네임입니다." },
    ),
  agreement1: z.boolean().refine((v) => v, { message: "필수 동의사항입니다." }),
  agreement2: z.boolean().default(false),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
