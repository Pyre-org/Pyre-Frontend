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

function PublicRoomListPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: channelData } = useGetChannel(channelId!, {
    enabled: !!channelId,
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-3">
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
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">공개 룸 탐색</h1>
          <RoomCreateBtn />
        </div>
      </div>
    </div>
  );
}

export default PublicRoomListPage;
