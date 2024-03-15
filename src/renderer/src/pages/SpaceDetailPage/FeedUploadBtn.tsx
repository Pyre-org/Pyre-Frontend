import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { UploadIcon } from "lucide-react";
import FeedUploadForm from "./FeedUploadForm";
import { useFeedStore } from "@renderer/stores/FeedStore";

function FeedUploadBtn() {
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
      <DialogTrigger asChild>
        <Button onClick={() => openDialog()}>
          <UploadIcon className="size-4 mr-2" />
          <span>피드 업로드</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{`피드 ${isEdit ? "수정" : "업로드"}`}</DialogTitle>
        </DialogHeader>
        <FeedUploadForm />
      </DialogContent>
    </Dialog>
  );
}

export default FeedUploadBtn;
