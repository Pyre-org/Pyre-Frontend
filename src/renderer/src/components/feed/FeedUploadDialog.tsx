import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import FeedUploadForm from "@renderer/components/feed/FeedUploadForm";
import { useFeedStore } from "@renderer/stores/FeedStore";

function FeedUploadDialog() {
  const open = useFeedStore((state) => state.isOpen);
  const feed = useFeedStore((state) => state.feed);
  const isEdit = !!feed;
  const { open: openDialog, close: closeDialog } = useFeedStore(
    (state) => state.actions,
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDialog();
    } else {
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{`피드 ${isEdit ? "수정" : "업로드"}`}</DialogTitle>
        </DialogHeader>
        <FeedUploadForm />
      </DialogContent>
    </Dialog>
  );
}

export default FeedUploadDialog;
