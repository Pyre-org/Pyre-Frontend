import { z } from "zod";
import { checkEmail } from "../queries/auth";

export const RegisterSchema = z.object({
  email: z
    .string({ required_error: "값을 입력해주세요" })
    .min(2, "2자 이상 입력해주세요.")
    .max(20, "20자 이하로 입력해주세요.")
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
    .max(40, "40자 이하로 입력해주세요.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,40}$/,
      "최소 1개 이상의 숫자, 대문자, 소문자를 포함해주세요.",
    ),
  nickname: z
    .string({ required_error: "값을 입력해주세요" })
    .min(5, "5자 이상 입력해주세요.")
    .max(12, "12자 이하로 입력해주세요.")
    .regex(
      /^[A-Za-z0-9ㄱ-ㅎ가-힣-_]{2,20}$/,
      "한글, 영문, 숫자, -_만 입력해주세요.",
    ),
  agreement1: z.boolean().refine((v) => v, { message: "필수 동의사항입니다." }),
  agreement2: z.boolean().default(false),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
