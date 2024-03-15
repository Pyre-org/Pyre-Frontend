import { formDropzoneSchema } from "@renderer/components/form/FormDropzone";
import { z } from "zod";

export const EditProfileSchema = z.object({
  profilePictureUrl: z.array(formDropzoneSchema.partial()).optional(),
  shortDescription: z.string().optional(),
  selectedChannelId: z.string().optional(),
  selectedRoomId: z.string().optional(),
  selectedSpaceId: z.string().optional(),
  useCaptureRoom: z.boolean(),
  useFeedInfo: z.boolean(),
});

export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>;
