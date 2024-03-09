import { HashtagIcon } from "@heroicons/react/16/solid";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetChannel } from "@renderer/lib/queries/channel";
import { useGetRooms } from "@renderer/lib/queries/room";
import { Room } from "@renderer/types/schema";
import { Link, useParams } from "react-router-dom";

function RoomList() {
  const { channelId } = useParams<{ channelId: string }>();
  const id = channelId as string;

  const { data: channelData } = useGetChannel(id);
  const { data: roomData } = useGetRooms({ channelId: id });
  const total = roomData?.total ?? 0;
  const rooms = roomData?.hits ?? [];

  return (
    <div className="text-muted-foreground">
      <div>
        <h2 className="text-lg font-semibold mb-2 text-foreground">
          {channelData?.title} 채널의 내 룸
        </h2>
      </div>
      {total > 0 ? (
        rooms.map((room) => <RoomListItem key={room.id} room={room} />)
      ) : (
        <div className="flex justify-center text-sm my-4">
          채널에 룸이 없습니다
        </div>
      )}
    </div>
  );
}

function RoomListItem({ room }: { room: Room }) {
  const { channelId } = useParams<{ channelId: string }>();
  const id = channelId as string;

  return (
    <Button variant="ghost" className="justify-start" key={room.title} asChild>
      <Link to={`/channels/${id}/rooms/${room.id}`}>
        <Avatar className="w-6 h-6 mr-2 shrink-0">
          <AvatarImage src={room.imageUrl} />
          <AvatarFallback>
            <HashtagIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{room.title}</span>
      </Link>
    </Button>
  );
}

export default RoomList;
