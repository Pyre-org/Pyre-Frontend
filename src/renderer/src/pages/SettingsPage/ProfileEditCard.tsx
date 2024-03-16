import FormDropzone from "@renderer/components/form/FormDropzone";
import FormDropzoneWithRemove from "@renderer/components/form/FormDropzoneWithRemove";
import FormInput from "@renderer/components/form/FormInput";
import FormTextarea from "@renderer/components/form/FormTextarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { EditProfileSchemaType } from "@renderer/lib/schemas/EditProfileSchema";
import { useFormContext, useWatch } from "react-hook-form";

function ProfileEditCard() {
  const methods = useFormContext<EditProfileSchemaType>();
  const imageUrl = useWatch({
    control: methods.control,
    name: "profilePictureUrl",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 및 소개</CardTitle>
        <CardDescription>
          프로필 사진 및 다른 유저에게 표시되는 설명을 수정할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FormInput control={methods.control} name="nickname" label="닉네임" />
        <FormDropzoneWithRemove
          dropzone={
            <FormDropzone
              control={methods.control}
              name="profilePictureUrl"
              label="프로필 이미지"
              dropzoneOptions={{ accept: { "image/*": [] }, multiple: false }}
            />
          }
          imageUrl={imageUrl?.[0]?.url}
          resetImageUrl={() => methods.setValue("profilePictureUrl", [])}
        />
        <FormTextarea
          control={methods.control}
          name="shortDescription"
          label="자기 소개"
          textareaProps={{
            placeholder: "자신에 대한 소개를 작성해주세요",
          }}
        />
      </CardContent>
    </Card>
  );
}

export default ProfileEditCard;
