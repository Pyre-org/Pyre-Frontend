import { useForm } from "react-hook-form";
import CaptureEditCard from "./CaptureEditCard";
import ProfileEditCard from "./ProfileEditCard";
import { Form } from "@renderer/components/ui/form";
import { Button } from "@renderer/components/ui/button";
import { SaveIcon } from "lucide-react";
import {
  EditProfileSchema,
  EditProfileSchemaType,
} from "@renderer/lib/schemas/EditProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEditProfileMutation,
  useGetFeedSettings,
  useGetMyProfile,
} from "@renderer/lib/queries/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BaseError } from "@renderer/types/schema";
import { useEffect } from "react";
import { useGetSpace } from "@renderer/lib/queries/space";

function SettingsPage() {
  const { data: profileData } = useGetMyProfile();
  const { data: feedSettings } = useGetFeedSettings();
  const { data: spaceData } = useGetSpace(feedSettings?.spaceId!, {
    enabled: !!feedSettings?.spaceId,
  });
  const editProfileMutation = useEditProfileMutation();

  const methods = useForm<EditProfileSchemaType>({
    resolver: zodResolver(EditProfileSchema),
  });

  const onSubmit = (data) => {
    const { selectedRoomId, selectedChannelId, ...body } = data;
    editProfileMutation.mutate(
      {
        ...body,
        profilePictureUrl: data.profilePictureUrl?.[0]?.url ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success("프로필이 수정되었습니다");
        },
        onError: (error: AxiosError<BaseError>) => {
          toast.error("프로필 수정에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      },
    );
  };

  useEffect(() => {
    const defaultValues: EditProfileSchemaType = {
      profilePictureUrl: profileData?.profilePictureUrl
        ? [{ url: profileData.profilePictureUrl }]
        : [],
      nickname: profileData?.nickname ?? "",
      shortDescription: profileData?.shortDescription ?? "",
      selectedRoomId: spaceData?.roomId ?? undefined,
      selectedSpaceId: feedSettings?.spaceId ?? undefined,
      selectedChannelId: feedSettings?.channelId ?? undefined,
      useCaptureRoom: feedSettings?.useCaptureRoom ?? false,
      useFeedInfo: feedSettings?.useFeedInfo ?? false,
    };
    if (!methods.formState.isDirty) methods.reset(defaultValues);
  }, [profileData, feedSettings, spaceData]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">개인 설정</h1>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <ProfileEditCard />
          <CaptureEditCard />
          <div className="flex justify-end">
            <Button type="submit" disabled={editProfileMutation.isPending}>
              <SaveIcon className="size-4 mr-2" />
              <span>설정 저장</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SettingsPage;
