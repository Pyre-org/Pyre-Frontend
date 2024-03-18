import { Button } from "@renderer/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useFeedStore } from "@renderer/stores/FeedStore";

function FeedUploadBtn() {
  const { open: openDialog } = useFeedStore((state) => state.actions);

  return (
    <Button onClick={() => openDialog()}>
      <UploadIcon className="size-4 mr-2" />
      <span>피드 업로드</span>
    </Button>
  );
}

export default FeedUploadBtn;
