import { useGetSpaces } from "@renderer/lib/queries/space";
import { useParams } from "react-router-dom";

function SpaceDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: spaceData } = useGetSpaces(
    { roomId: roomId! },
    { enabled: !!roomId },
  );
  const total = spaceData?.total ?? 0;
  const spaces = spaceData?.hits ?? [];

  console.log(total, spaces);

  return <div>Space Detail Page</div>;
}

export default SpaceDetailPage;
