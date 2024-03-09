import { formDropzoneSchema } from "@renderer/components/form/FormDropzone";
import { ROOM_TYPES } from "@renderer/constants/room";
import { z } from "zod";

export const roomCreateSchema = z.object({
  title: z.string({ required_error: "룸 이름을 입력해주세요" }),
  description: z.string().optional(),
  imageUrl: z.array(formDropzoneSchema),
  type: z.enum(ROOM_TYPES),
});

export type RoomCreateSchemaType = z.infer<typeof roomCreateSchema>;
