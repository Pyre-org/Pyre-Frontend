import { formDropzoneSchema } from "@renderer/components/form/FormDropzone";
import { z } from "zod";

export const EditProfileSchema = z.object({
  profilePictureUrl: z.array(formDropzoneSchema.partial()).optional(),
  nickname: z
    .string()
    .min(2, "닉네임은 2글자 이상이어야 합니다")
    .max(20, "닉네임은 20글자 이하여야 합니다")
    .regex(
      /[A-Za-z0-9ㄱ-ㅎ가-힣-_]+/,
      "닉네임은 영문, 한글, 숫자, -_만 사용할 수 있습니다",
    ),
  shortDescription: z.string().optional(),
  selectedChannelId: z.string().optional(),
  selectedRoomId: z.string().optional(),
  selectedSpaceId: z.string().optional(),
  useCaptureRoom: z.boolean(),
  useFeedInfo: z.boolean(),
});

export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>;
