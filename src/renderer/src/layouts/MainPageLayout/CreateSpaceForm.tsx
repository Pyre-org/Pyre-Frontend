import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@renderer/components/form/FormInput";
import FormSelect from "@renderer/components/form/FormSelect";
import FormTextarea from "@renderer/components/form/FormTextarea";
import SpaceDeleteBtn from "@renderer/components/space/SpaceDeleteBtn";
import { Button } from "@renderer/components/ui/button";
import { Form } from "@renderer/components/ui/form";
import {
  ROLE_TYPE_OPTIONS,
  SPACE_TYPES,
  SPACE_TYPE_OPTIONS,
} from "@renderer/constants/space";
import {
  useCreateSpaceMutation,
  useUpdateSpaceMutation,
} from "@renderer/lib/queries/space";
import {
  CreateSpaceSchema,
  CreateSpaceSchemaType,
} from "@renderer/lib/schemas/CreateSpaceSchema";
import { useSpaceStore } from "@renderer/stores/SpaceStore";
import { BaseError } from "@renderer/types/schema";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const defaultValues = {
  title: "",
  description: "",
  type: SPACE_TYPES[0],
};

function CreateSpaceForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const { close: closeDialog } = useSpaceStore((store) => store.actions);
  const space = useSpaceStore((state) => state.space);
  const methods = useForm<CreateSpaceSchemaType>({
    resolver: zodResolver(CreateSpaceSchema),
    defaultValues: space ? space : defaultValues,
  });

  const createMutation = useCreateSpaceMutation();
  const updateMutation = useUpdateSpaceMutation();
  const isEdit = !!space;

  const onSubmit = (data: CreateSpaceSchemaType) => {
    methods.reset();
    const handler = {
      onSuccess: () => {
        closeDialog();
        toast.success(`스페이스가 ${isEdit ? "수정" : "생성"}되었습니다`);
      },
      onError: (error: AxiosError<BaseError>) => {
        toast.error(
          `스페이스 ${isEdit ? "수정" : "생성"} 중 오류가 발생했습니다.`,
          {
            description: error.response?.data.reason,
          },
        );
      },
    };
    if (isEdit) {
      updateMutation.mutate(
        {
          title: data.title,
          description: data.description ?? "",
          role: data.role!,
          spaceId: space.id!,
        },
        handler,
      );
    } else {
      createMutation.mutate(
        { ...data, type: data.type!, roomId: roomId! },
        handler,
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
          label="스페이스 이름"
          inputProps={{ placeholder: "스페이스의 이름을 입력해주세요" }}
        />
        <FormTextarea
          control={methods.control}
          name="description"
          label="스페이스 설명"
          textareaProps={{ placeholder: "스페이스의 설명을 입력해주세요" }}
        />
        {!isEdit && (
          <FormSelect
            control={methods.control}
            name="type"
            label="스페이스 종류"
            options={SPACE_TYPE_OPTIONS}
          />
        )}
        {isEdit && (
          <FormSelect
            control={methods.control}
            name="role"
            label="공개 범위 설정"
            options={ROLE_TYPE_OPTIONS}
          />
        )}
        <div className="mt-4 flex gap-4 items-center justify-center">
          <Button type="submit" fullWidth>
            스페이스 {isEdit ? "수정하기" : "만들기"}
          </Button>
          <SpaceDeleteBtn />
        </div>
      </form>
    </Form>
  );
}

export default CreateSpaceForm;
