import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetRoom } from "@renderer/lib/queries/room";
import { useGetSpace, useGetSpaces } from "@renderer/lib/queries/space";
import { Space } from "@renderer/types/schema";
import { LucideIcon, MessageSquareIcon, NewspaperIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CreateSpaceBtn from "./CreateSpaceBtn";

function SpaceList() {
  const { channelId, roomId } = useParams<{ channelId; roomId: string }>();
  const { data: roomData } = useGetRoom(roomId as string);
  const { data: spaceData } = useGetSpaces({ roomId: roomId as string });
  const total = spaceData?.total ?? 0;
  const spaces = spaceData?.hits ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Link
          to={`/channels/${channelId}/rooms/${roomId}/spaces`}
          className="flex flex-1 truncate"
        >
          <Avatar className="w-6 h-6 mr-2 shrink-0">
            <AvatarImage src={roomData?.imageUrl} />
            <AvatarFallback>
              <span>{roomData?.title[0].toUpperCase()}</span>
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{roomData?.title}</span>
        </Link>
        <CreateSpaceBtn />
      </div>

      <div className="text-muted-foreground">
        {total > 0 ? (
          spaces.map((space) => <SpaceListItem key={space.id} space={space} />)
        ) : (
          <div className="flex justify-center text-sm my-4">
            채널에 스페이스가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}

const iconMap: Record<Space["type"], LucideIcon> = {
  SPACE_FEED: NewspaperIcon,
  SPACE_CHAT: MessageSquareIcon,
};

function SpaceListItem({ space }: { space: Space }) {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: spaceData } = useGetSpace(space.id);
  const Icon = iconMap[space.type];

  return (
    <Button
      variant="ghost"
      className="justify-start w-full"
      key={space.id}
      asChild
    >
      <Link
        to={`/channels/${channelId}/rooms/${space.roomId}/spaces/${space.id}`}
      >
        <Icon className="size-4 mr-2" />
        <span className="truncate">{spaceData?.title}</span>
      </Link>
    </Button>
  );
}

export default SpaceList;
