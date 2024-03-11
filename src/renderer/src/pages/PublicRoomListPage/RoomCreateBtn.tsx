import { Button } from "@renderer/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRoomStore } from "@renderer/stores/RoomStore";

function RoomCreateBtn() {
  const room = useRoomStore((state) => state.room);
  const { open: openRoom } = useRoomStore((state) => state.actions);
  const isEdit = !!room;

  return (
    <Button
      onClick={() => openRoom()}
      variant="ghost"
      className="text-primary hover:text-primary"
    >
      <PlusCircleIcon className="size-4 mr-2" />
      <span>룸 {isEdit ? "수정" : "생성"}하기</span>
    </Button>
  );
}

export default RoomCreateBtn;
