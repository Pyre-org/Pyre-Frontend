import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useSpaceStore } from "@renderer/stores/SpaceStore";
import { PlusIcon } from "lucide-react";
import CreateSpaceForm from "./CreateSpaceForm";

function CreateSpaceDialog() {
  const open = useSpaceStore((state) => state.isOpen);
  const space = useSpaceStore((state) => state.space);
  const { open: openDialog, close: closeDialog } = useSpaceStore(
    (store) => store.actions,
  );

  const isEdit = !!space;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeDialog();
    } else {
      openDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <TooltipProvider delayDuration={300}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => openDialog()}
              >
                <PlusIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>스페이스 추가</TooltipContent>
          </Tooltip>
        </DialogTrigger>
      </TooltipProvider>
      <DialogContent className="flex flex-col max-h-[80%] scrollbar-thin">
        <DialogHeader>
          <DialogTitle>스페이스 {isEdit ? "수정" : "생성"}</DialogTitle>
        </DialogHeader>
        <CreateSpaceForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateSpaceDialog;
