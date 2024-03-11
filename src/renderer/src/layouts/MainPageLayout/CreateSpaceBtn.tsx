import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@renderer/components/form/FormInput";
import FormSelect from "@renderer/components/form/FormSelect";
import FormTextarea from "@renderer/components/form/FormTextarea";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { Form } from "@renderer/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { SPACE_TYPES, SPACE_TYPE_OPTIONS } from "@renderer/constants/space";
import { useCreateSpaceMutation } from "@renderer/lib/queries/space";
import {
  CreateSpaceSchema,
  CreateSpaceSchemaType,
} from "@renderer/lib/schemas/CreateSpaceSchema";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const defaultValues = {
  title: "",
  description: "",
  type: SPACE_TYPES[0],
};

function CreateSpaceBtn() {
  const { roomId } = useParams<{ roomId: string }>();
  const [openDialog, setOpenDialog] = useState(false);
  const methods = useForm<CreateSpaceSchemaType>({
    resolver: zodResolver(CreateSpaceSchema),
    defaultValues,
  });
  const createMutation = useCreateSpaceMutation();

  const onSubmit = (data: CreateSpaceSchemaType) => {
    methods.reset();
    createMutation.mutate(
      { ...data, roomId: roomId! },
      {
        onSuccess: () => {
          setOpenDialog(false);
          toast.success("스페이스가 생성되었습니다");
        },
        onError: (error) => {
          toast.error("스페이스 생성 중 오류가 발생했습니다.", {
            description: error.response?.data.reason,
          });
        },
      },
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <TooltipProvider delayDuration={300}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => setOpenDialog(true)}
              >
                <PlusIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>스페이스 추가</TooltipContent>
          </Tooltip>
        </DialogTrigger>
      </TooltipProvider>
      <DialogContent className="flex flex-col max-h-[80%] scrollbar-thin">
        <DialogHeader>
          <DialogTitle>스페이스 생성</DialogTitle>
        </DialogHeader>
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
            <FormSelect
              control={methods.control}
              name="type"
              label="스페이스 종류"
              options={SPACE_TYPE_OPTIONS}
            />
            <Button type="submit" className="mt-4">
              스페이스 만들기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSpaceBtn;
