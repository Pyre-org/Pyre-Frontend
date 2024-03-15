import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import RoomCreateForm from "../../pages/PublicRoomListPage/RoomCreateForm";
import { useRoomStore } from "@renderer/stores/RoomStore";
import { useParams } from "react-router-dom";
import {
  useCreateRoomMutation,
  useUpdateRoomMutation,
} from "@renderer/lib/queries/room";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BaseError } from "@renderer/types/schema";
import { RoomCreateSchemaType } from "@renderer/lib/schemas/RoomCreateSchema";

function RoomCreateDialog() {
  const open = useRoomStore((state) => state.isOpen);
  const room = useRoomStore((state) => state.room);
  const { open: openRoom, close: closeRoom } = useRoomStore(
    (state) => state.actions,
  );
  const { channelId } = useParams<{ channelId: string }>();
  const createMutation = useCreateRoomMutation();
  const updateMutation = useUpdateRoomMutation();
  const isEdit = !!room;

  const handleSubmit = (data: RoomCreateSchemaType) => {
    const body = {
      ...data,
      description: data.description ?? "",
      imageUrl: data.imageUrl?.[0]?.url ?? undefined,
    };
    const options = {
      onSuccess: () => {
        closeRoom();
        toast.success(`룸이 ${isEdit ? "수정" : "생성"}되었습니다`);
      },
      onError: (error: AxiosError<BaseError>) => {
        toast.error(`룸 ${isEdit ? "수정" : "생성"} 중 오류가 발생했습니다`, {
          description: error.response?.data.reason,
        });
      },
    };

    if (isEdit) {
      updateMutation.mutate({ ...body, roomId: room.id }, options);
    } else {
      createMutation.mutate({ ...body, channelId: channelId! }, options);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeRoom();
    } else {
      openRoom();
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>룸 {isEdit ? "수정" : "생성"}하기</DialogTitle>
        </DialogHeader>
        <RoomCreateForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default RoomCreateDialog;
