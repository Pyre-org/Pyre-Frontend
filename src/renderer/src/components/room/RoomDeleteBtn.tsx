import { Button } from "@renderer/components/ui/button";
import { useDeleteRoomMutation } from "@renderer/lib/queries/room";
import { useRoomStore } from "@renderer/stores/RoomStore";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function RoomDeleteBtn() {
  const location = useLocation();
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const room = useRoomStore((state) => state.room);
  const { close } = useRoomStore((state) => state.actions);
  const deleteMutation = useDeleteRoomMutation();

  const handleDelete = () => {
    if (!room) return;
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        close();
        toast.success("룸이 삭제되었습니다");
        if (
          location.pathname.startsWith(
            `/channels/${channelId}/rooms/${room?.id}`,
          )
        ) {
          navigate(`/channels/${channelId}`);
        }
      },
      onError(error) {
        toast.error("룸 삭제 중 오류가 발생했습니다", {
          description: error.response?.data.reason,
        });
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          <Trash2Icon className="size-4 mr-2" />
          <span>룸 삭제하기</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>룸 삭제하기</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 룸을 삭제하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            삭제
          </AlertDialogAction>
          <AlertDialogCancel>취소</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RoomDeleteBtn;
