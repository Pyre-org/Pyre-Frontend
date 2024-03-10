import { useGetSpace } from "@renderer/lib/queries/space";
import { Space } from "@renderer/types/schema";
import { ComponentType } from "react";
import { useParams } from "react-router-dom";
import FeedDetail from "./FeedDetail";
import ChatDetail from "./ChatDetail";

export const SpaceTypeMap: Record<Space["type"], ComponentType> = {
  SPACE_FEED: FeedDetail,
  SPACE_CHAT: ChatDetail,
};

function SpaceDetailPage() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { data: spaceData } = useGetSpace(spaceId!, {
    enabled: !!spaceId,
  });
  const SpaceComponent = SpaceTypeMap[spaceData?.type ?? "SPACE_FEED"];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold p-4">{spaceData?.title}</h2>
      <div className="flex-1 overflow-hidden">
        <SpaceComponent />
      </div>
    </div>
  );
}

export default SpaceDetailPage;
