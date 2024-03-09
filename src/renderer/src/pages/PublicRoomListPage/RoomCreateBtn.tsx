import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import RoomCreateForm from "./RoomCreateForm";
import { RoomCreateSchemaType } from "@renderer/lib/schemas/RoomCreateSchema";
import { useState } from "react";
import { useCreateRoomMutation } from "@renderer/lib/queries/room";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function RoomCreateBtn() {
  const [open, setOpen] = useState(false);
  const { channelId } = useParams<{ channelId: string }>();
  const createMutation = useCreateRoomMutation();
  const handleSubmit = (data: RoomCreateSchemaType) => {
    setOpen(false);
    const body = {
      ...data,
      description: data.description ?? "",
      imageUrl: data.imageUrl?.[0]?.url ?? undefined,
      channelId: channelId as string,
    };

    createMutation.mutate(body, {
      onSuccess: () => {
        toast.success("룸이 생성되었습니다");
      },
      onError: (error) => {
        toast.error("채널 생성 중 오류가 발생했습니다", {
          description: error.response?.data.reason,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <PlusCircleIcon className="size-4 mr-2" />
          <span>룸 생성</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>룸 생성하기</DialogTitle>
          <DialogDescription>
            생성하실 룸의 정보를 입력해주세요
          </DialogDescription>
        </DialogHeader>
        <RoomCreateForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default RoomCreateBtn;
