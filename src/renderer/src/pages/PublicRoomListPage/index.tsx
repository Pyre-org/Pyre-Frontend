import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetChannel } from "@renderer/lib/queries/channel";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import RoomCreateBtn from "./RoomCreateBtn";
import { Separator } from "@renderer/components/ui/separator";
import RoomList from "./RoomList";
import ToggleChannelSubBtn from "@renderer/components/channel/ToggleChannelSubBtn";

function PublicRoomListPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: channelData } = useGetChannel(channelId!, {
    enabled: !!channelId,
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button size="icon" className="size-8" variant="ghost" asChild>
                <Link to="/channels">
                  <ArrowLeftIcon className="size-4 text-muted-foreground" />
                </Link>
              </Button>
              <Avatar className="size-8">
                <AvatarImage src={channelData?.imageUrl} />
                <AvatarFallback>
                  <span>{channelData?.title[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">{channelData?.title}</p>
            </div>
            <div>
              <ToggleChannelSubBtn channelId={channelId!} />
            </div>
          </div>
          <div className="my-2 text-xs text-muted-foreground flex items-center gap-2 mb-4">
            <span>구독한 멤버 {channelData?.memberCounts}명</span>·
            <span>{channelData?.roomCounts}개의 룸</span>·
            <span>{channelData?.cAt}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {channelData?.description}
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">공개 룸 탐색</h1>
          <RoomCreateBtn />
        </div>
        <RoomList />
      </div>
    </div>
  );
}

export default PublicRoomListPage;
