import { zodResolver } from "@hookform/resolvers/zod";
import FormDropzone from "@renderer/components/form/FormDropzone";
import FormInput from "@renderer/components/form/FormInput";
import FormSelect from "@renderer/components/form/FormSelect";
import FormTextarea from "@renderer/components/form/FormTextarea";
import RoomDeleteBtn from "@renderer/components/room/RoomDeleteBtn";
import { Button } from "@renderer/components/ui/button";
import { Form } from "@renderer/components/ui/form";
import {
  SPACE_ROOM_TYPES,
  SPACE_ROOM_TYPE_OPTIONS,
} from "@renderer/constants/room";
import {
  RoomCreateSchemaType,
  roomCreateSchema,
} from "@renderer/lib/schemas/RoomCreateSchema";
import { useRoomStore } from "@renderer/stores/RoomStore";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

interface RoomCreateFormProps {
  onSubmit: (data: RoomCreateSchemaType) => void;
}

const defaultValues = {
  imageUrl: [],
  type: SPACE_ROOM_TYPES[0],
};

function RoomCreateForm({ onSubmit }: RoomCreateFormProps) {
  const room = useRoomStore((state) => state.room);
  const isEdit = !!room;

  const methods = useForm<RoomCreateSchemaType>({
    resolver: zodResolver(roomCreateSchema),
    defaultValues: isEdit
      ? { ...room, imageUrl: room?.imageUrl ? [{ url: room.imageUrl }] : [] }
      : defaultValues,
  });

  const imageUrl = useWatch({
    control: methods.control,
    name: "imageUrl",
  });

  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      methods.reset();
    }
  }, [methods.formState.isSubmitSuccessful]);

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormInput
          control={methods.control}
          name="title"
          label="룸 이름"
          inputProps={{ placeholder: "룸의 이름을 입력해주세요" }}
        />
        <FormTextarea
          control={methods.control}
          name="description"
          label="룸 설명"
          textareaProps={{ placeholder: "룸의 설명을 입력해주세요" }}
        />
        <FormSelect
          control={methods.control}
          label="공개 여부"
          name="type"
          placeholder="공개 여부를 선택해주세요"
          options={SPACE_ROOM_TYPE_OPTIONS}
        />
        <FormDropzone
          control={methods.control}
          name="imageUrl"
          label="룸 프로필 이미지"
          dropzoneOptions={{
            accept: { "image/*": [] },
            multiple: false,
          }}
        />
        {imageUrl && imageUrl.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            <img src={imageUrl?.[0].url} alt="profile" />
            <Button
              variant="outline"
              onClick={() => methods.setValue("imageUrl", [])}
            >
              <Trash2Icon className="size-4 mr-2" />
              <span>이미지 삭제</span>
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button type="submit" fullWidth>
            룸 {isEdit ? "수정" : "생성"}하기
          </Button>
          {isEdit && <RoomDeleteBtn />}
        </div>
      </form>
    </Form>
  );
}

export default RoomCreateForm;
