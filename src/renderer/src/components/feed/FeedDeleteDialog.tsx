import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog";
import { useDeleteFeedMutation } from "@renderer/lib/queries/feed";
import { toast } from "sonner";

interface FeedDeleteDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  feedId: string;
}

function FeedDeleteDialog({
  feedId,
  open,
  onOpenChange,
}: FeedDeleteDialogProps) {
  const deleteMutation = useDeleteFeedMutation();

  const handleDelete = () => {
    deleteMutation.mutate(feedId, {
      onSuccess: () => {
        toast.success("피드가 삭제되었습니다");
      },
      onError: (error) => {
        console.error(error);
        toast.error("피드 삭제에 실패했습니다", {
          description: error.response?.data.reason,
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 피드를 삭제하시겠습니까?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            삭제
          </AlertDialogAction>
          <AlertDialogCancel>취소</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default FeedDeleteDialog;
