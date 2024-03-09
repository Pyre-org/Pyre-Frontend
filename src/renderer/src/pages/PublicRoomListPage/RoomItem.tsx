import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Room } from "@renderer/types/schema";

interface RoomItemProps {
  room: Room;
}

function RoomItem({ room }: RoomItemProps) {
  return (
    <div className="border rounded-lg aspect-square p-4 flex flex-col justify-center cursor-pointer hover:bg-border/20 transition-all duration-200 ease-in-out">
      <Avatar className="mx-auto">
        <AvatarImage src={room.imageUrl} />
        <AvatarFallback>
          <span>{room.title[0].toUpperCase()}</span>
        </AvatarFallback>
      </Avatar>
      <div className="mt-4">
        <h2 className="font-semibold truncate text-center">{room.title}</h2>
        <p className="text-xs text-muted-foreground text-center">{`멤버 ${room.memberCounts}명 · ${room.spaceCounts}개 스페이스`}</p>
      </div>
    </div>
  );
}

export default RoomItem;
