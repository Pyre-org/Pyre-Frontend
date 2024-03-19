import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetChannel } from "@renderer/lib/queries/channel";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@renderer/components/ui/separator";
import { useGetRoom } from "@renderer/lib/queries/room";
import ToggleRoomSubBtn from "@renderer/components/room/ToggleRoomSubBtn";

function RoomInfoPage() {
  const { channelId, roomId } = useParams<{
    channelId: string;
    roomId: string;
  }>();
  const { data: channelData } = useGetChannel(channelId!, {
    enabled: !!channelId,
  });
  const { data: roomData } = useGetRoom(roomId!, {
    enabled: !!roomId,
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button size="icon" className="size-8" variant="ghost" asChild>
                <Link to="../../../">
                  <ArrowLeftIcon className="size-4 text-muted-foreground" />
                </Link>
              </Button>
              <Avatar className="size-8">
                <AvatarImage src={roomData?.imageUrl} />
                <AvatarFallback>
                  <span>{roomData?.title[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">{`${channelData?.title} / ${roomData?.title}`}</p>
            </div>
            <ToggleRoomSubBtn roomId={roomId!} channelId={channelId!} />
          </div>
          <div className="my-2 text-xs text-muted-foreground flex items-center gap-2 mb-4">
            <span>룸의 멤버 {roomData?.memberCounts}명</span>·
            <span>{roomData?.spaceCounts}개의 스페이스</span>·
            <span>{roomData?.cAt}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {roomData?.description}
          </div>
        </div>
        <Separator />
      </div>
    </div>
  );
}

export default RoomInfoPage;
