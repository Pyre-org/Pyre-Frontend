import { Button } from "@renderer/components/ui/button";
import { useDeleteSpaceMutation } from "@renderer/lib/queries/space";
import { useSpaceStore } from "@renderer/stores/SpaceStore";
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

function SpaceDeleteBtn() {
  const space = useSpaceStore((state) => state.space);
  const { close } = useSpaceStore((state) => state.actions);
  const deleteMutation = useDeleteSpaceMutation();

  const handleDelete = () => {
    if (!space) return;
    deleteMutation.mutate(space.id, {
      onSuccess: () => {
        close();
        toast.success("스페이스가 삭제되었습니다");
      },
      onError(error) {
        toast.error("스페이스 삭제 중 오류가 발생했습니다", {
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
          <span>스페이스 삭제</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>스페이스 삭제하기</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 스페이스를 삭제하시겠습니까?
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

export default SpaceDeleteBtn;
