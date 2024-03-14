import { ROLE_TYPES, SPACE_TYPES } from "@renderer/constants/space";
import { z } from "zod";

export const CreateSpaceSchema = z.object({
  title: z
    .string({ required_error: "스페이스 이름을 입력해주세요" })
    .min(1, { message: "스페이스 이름을 입력해주세요" }),
  description: z.string().optional(),
  type: z.enum(SPACE_TYPES).optional(),
  role: z.enum(ROLE_TYPES).optional(),
});

export type CreateSpaceSchemaType = z.infer<typeof CreateSpaceSchema>;
