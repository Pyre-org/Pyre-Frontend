import { zodResolver } from "@hookform/resolvers/zod";
import FormDropzone from "@renderer/components/form/FormDropzone";
import FormDropzoneWithRemove from "@renderer/components/form/FormDropzoneWithRemove";
import FormInput from "@renderer/components/form/FormInput";
import FormTextarea from "@renderer/components/form/FormTextarea";
import { Button } from "@renderer/components/ui/button";
import { Form } from "@renderer/components/ui/form";
import {
  useUpdateFeedMutation,
  useUploadFeedMutation,
} from "@renderer/lib/queries/feed";
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
  const feed = useFeedStore((state) => state.feed);
  const isEdit = !!feed;
  const uploadMutation = useUploadFeedMutation();
  const updateMutation = useUpdateFeedMutation();

  const methods = useForm<CreateFeedSchemaType>({
    resolver: zodResolver(CreateFeedSchema),
    defaultValues: feed
      ? {
          ...feed,
          imageUrl: [{ url: feed.imageUrl }],
          description: feed.description ?? "",
        }
      : defaultValues,
  });
  const imageUrl = useWatch({
    control: methods.control,
    name: "imageUrl",
  });

  const onSubmit = (data: CreateFeedSchemaType) => {
    const options = {
      onSuccess: () => {
        close();
        methods.reset();
        toast.success(`피드가 ${isEdit ? "수정" : "등록"}되었습니다`);
      },
      onError: (error) => {
        console.error(error);
        toast.error(`피드 ${isEdit ? "수정" : "업로드"}에 실패했습니다`, {
          description: error.response?.data.reason,
        });
      },
    };

    if (isEdit) {
      updateMutation.mutate(
        {
          feedId: feed.id!,
          title: data.title,
          description: data.description,
        },
        options,
      );
    } else {
      uploadMutation.mutate(
        {
          ...data,
          spaceId: spaceId!,
          url: data.imageUrl?.[0]?.url ?? "",
        },
        options,
      );
    }
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
        {!isEdit && (
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
        )}
        <Button type="submit">피드 {isEdit ? "수정" : "만들기"}</Button>
      </form>
    </Form>
  );
}

export default FeedUploadForm;
