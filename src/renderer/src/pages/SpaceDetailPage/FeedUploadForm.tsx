import { zodResolver } from "@hookform/resolvers/zod";
import FormDropzone from "@renderer/components/form/FormDropzone";
import FormDropzoneWithRemove from "@renderer/components/form/FormDropzoneWithRemove";
import FormInput from "@renderer/components/form/FormInput";
import FormTextarea from "@renderer/components/form/FormTextarea";
import { Button } from "@renderer/components/ui/button";
import { Form } from "@renderer/components/ui/form";
import { useUploadFeedMutation } from "@renderer/lib/queries/feed";
import {
  CreateFeedSchema,
  CreateFeedSchemaType,
} from "@renderer/lib/schemas/CreateFeedSchema";
import { useFeedStore } from "@renderer/stores/FeedStore";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const defaultValues = {
  title: "",
  description: "",
  imageUrl: [],
};

function FeedUploadForm() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const close = useFeedStore((state) => state.actions.close);
  const uploadMutation = useUploadFeedMutation();
  const methods = useForm<CreateFeedSchemaType>({
    resolver: zodResolver(CreateFeedSchema),
    defaultValues,
  });
  const imageUrl = useWatch({
    control: methods.control,
    name: "imageUrl",
  });

  const onSubmit = (data: CreateFeedSchemaType) => {
    uploadMutation.mutate(
      {
        spaceId: spaceId!,
        url: data.imageUrl?.[0]?.url ?? "",
      },
      {
        onSuccess: () => {
          close();
          methods.reset();
          toast.success("피드가 등록되었습니다");
        },
        onError: (error) => {
          console.error(error);
          toast.error("피드 업로드에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      },
    );
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput
          control={methods.control}
          name="title"
          label="피드 제목"
          inputProps={{ placeholder: "제목을 입력해주세요" }}
        />
        <FormTextarea
          control={methods.control}
          name="description"
          label="피드 설명"
          textareaProps={{ placeholder: "설명을 입력해주세요" }}
        />
        <FormDropzoneWithRemove
          dropzone={
            <FormDropzone
              control={methods.control}
              name="imageUrl"
              label="피드 이미지"
              dropzoneOptions={{ accept: { "image/*": [] }, multiple: false }}
            />
          }
          imageUrl={imageUrl?.[0]?.url}
          resetImageUrl={() => methods.setValue("imageUrl", [])}
        />
        <Button type="submit">피드 만들기</Button>
      </form>
    </Form>
  );
}

export default FeedUploadForm;
