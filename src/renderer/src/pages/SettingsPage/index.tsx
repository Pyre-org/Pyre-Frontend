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

const defaultValues: EditProfileSchemaType = {
  profilePictureUrl: [],
  shortDescription: "",
  useCaptureRoom: false,
  useFeedInfo: false,
};

function SettingsPage() {
  const methods = useForm<EditProfileSchemaType>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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
            <Button>
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
