import useCapture from "@renderer/hooks/useCapture";
import { PropsWithChildren, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import FormInput from "./form/FormInput";
import FormTextarea from "./form/FormTextarea";
import { Button } from "./ui/button";

const CaptureUploadSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type CaptureUploadSchemaType = z.infer<typeof CaptureUploadSchema>;

const defaultValues = {
  title: "",
  description: "",
};

function CaptureWrapper({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const { url, onSubmit } = useCapture({ setOpenPopup: setOpen });
  const methods = useForm<CaptureUploadSchemaType>({
    resolver: zodResolver(CaptureUploadSchema),
    defaultValues,
  });

  const handleSubmit = (data: CaptureUploadSchemaType) => {
    onSubmit({ ...data, url: url ?? "" });
  };

  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      methods.reset();
    }
  }, [methods.formState.isSubmitSuccessful]);

  return (
    <>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
          <DialogHeader>
            <DialogTitle>캡처 정보 설정</DialogTitle>
          </DialogHeader>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
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
              <img src={url ?? ""} alt="img" />
              <DialogFooter>
                <Button type="submit">캡처 업로드</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CaptureWrapper;
