import { Button } from "@renderer/components/ui/button";
import { useGetSpaces } from "@renderer/lib/queries/space";
import { Space } from "@renderer/types/schema";
import { Link, useParams } from "react-router-dom";

function SpaceList() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: spaceData } = useGetSpaces({ roomId: roomId as string });
  const total = spaceData?.total ?? 0;
  const spaces = spaceData?.hits ?? [];

  return (
    <div className="text-muted-foreground">
      {total > 0 ? (
        spaces.map((space) => <SpaceListItem key={space.id} space={space} />)
      ) : (
        <div className="flex justify-center text-sm my-4">
          채널에 스페이스가 없습니다
        </div>
      )}
    </div>
  );
}

function SpaceListItem({ space }: { space: Space }) {
  const { channelId } = useParams<{ channelId: string }>();

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
        <span className="truncate">{space.id}</span>
      </Link>
    </Button>
  );
}

export default SpaceList;
