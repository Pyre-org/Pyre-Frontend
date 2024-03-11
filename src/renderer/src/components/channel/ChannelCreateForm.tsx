import { Form } from "@renderer/components/ui/form";
import {
  CreateChannelSchema,
  CreateChannelSchemaType,
} from "@renderer/lib/schemas/CreateChannelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@renderer/components/ui/button";
import {
  useCreateChannelMutation,
  useEditChannelMutation,
  useGetChannel,
  useGetGenres,
} from "@renderer/lib/queries/channel";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@renderer/components/ui/dialog";
import { useDebouncedValue } from "@mantine/hooks";
import FormDropzone from "../form/FormDropzone";
import FormInput from "../form/FormInput";
import FormComboBox from "../form/FormCombobox";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface ChannelCreateForm {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  editChannelId?: string | null;
}

const defaultValues = {
  title: "",
  description: "",
  imageUrl: [],
};

function ChannelCreateForm({
  open,
  setOpen,
  editChannelId,
}: ChannelCreateForm) {
  const { data: editChannelData } = useGetChannel(editChannelId ?? "", {
    enabled: !!editChannelId,
  });
  const methods = useForm<CreateChannelSchemaType>({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues,
  });
  const imageUrl = useWatch({ control: methods.control, name: "imageUrl" });
  const [genreKeyword, setGenreKeyword] = useState("");
  const [debounced] = useDebouncedValue(genreKeyword, 250);
  const { data: genreData } = useGetGenres(
    { name: debounced },
    { placeholderData: (previousData) => previousData },
  );
  const createChannelMutation = useCreateChannelMutation();
  const editChannelMutation = useEditChannelMutation();
  const isEdit = !!editChannelId;

  const onMutationSuccess = useCallback(() => {
    setOpen(false);
    toast.success(`채널 ${isEdit ? "수정" : "등록"}이 완료되었습니다`);
  }, [isEdit]);

  const onMutationError = useCallback(() => {
    toast.error(`채널 ${isEdit ? "수정" : "등록"} 중 오류가 발생했습니다`);
  }, [isEdit]);

  const onSubmit = (data: CreateChannelSchemaType) => {
    methods.reset();
    const body = { ...data, imageUrl: data.imageUrl?.[0]?.url };
    if (!isEdit) {
      createChannelMutation.mutate(body, {
        onSuccess: onMutationSuccess,
        onError: onMutationError,
      });
    } else {
      editChannelMutation.mutate(
        { id: editChannelId, ...body },
        {
          onSuccess: onMutationSuccess,
          onError: onMutationError,
        },
      );
    }
  };
  const onError = (errors: any) => {
    console.log(errors);
  };

  useEffect(() => {
    if (editChannelId && editChannelData) {
      methods.reset({
        title: editChannelData.title,
        description: editChannelData.description,
        genre: editChannelData.genre,
        imageUrl: [{ url: editChannelData.imageUrl }],
      });
    } else {
      methods.reset(defaultValues);
    }
  }, [editChannelData, editChannelId]);

  const genres = genreData?.hits.map((g) => ({ label: g, value: g })) ?? [];

  console.log(imageUrl);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80%] overflow-y-scroll flex flex-col scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{isEdit ? "채널 수정" : "새 채널 생성"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `'${editChannelData?.title}' 채널을 수정합니다`
              : "채널을 생성합니다"}
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-3"
          >
            <FormInput
              control={methods.control}
              name="title"
              label="채널 이름"
            />
            <FormInput
              control={methods.control}
              name="description"
              label="채널 설명"
            />
            <FormComboBox
              control={methods.control}
              name="genre"
              label="채널 장르"
              options={genres}
              placeholder="채널 장르를 선택해주세요"
              searchPlaceholder="채널 장르를 검색해주세요"
              keyword={genreKeyword}
              setKeyword={setGenreKeyword}
            />
            <div className="flex flex-col gap-2">
              <FormDropzone
                control={methods.control}
                name="imageUrl"
                label="채널 이미지"
                dropzoneOptions={{
                  accept: { "image/*": [] },
                  multiple: false,
                }}
              />
              {imageUrl && imageUrl.length > 0 && (
                <div className="flex flex-col gap-2">
                  <img src={imageUrl?.[0].url ?? ""} alt="imgUrl" />
                  <Button
                    variant="outline"
                    onClick={() => methods.setValue("imageUrl", [])}
                  >
                    <Trash2Icon className="size-4 mr-2" />
                    <span>이미지 삭제</span>
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? "수정" : "생성"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(ChannelCreateForm);
