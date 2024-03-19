import CategoryIndicator from "@renderer/components/common/CategoryIndicator";
import { useGetChannel } from "@renderer/lib/queries/channel";
import { useGetRoom } from "@renderer/lib/queries/room";
import { useSearchSpace } from "@renderer/lib/queries/search";
import { Space } from "@renderer/types/schema";
import SearchResultLayout from "./SearchResultLayout";
import { ITabItemCompProps } from ".";

function SpaceSearchTab({ keyword, page, size }: ITabItemCompProps) {
  const { data: spaceData, isLoading } = useSearchSpace({
    keyword,
    page,
    size,
  });
  const spaces = spaceData?.hits ?? [];
  const total = spaceData?.total ?? 0;

  return (
    <SearchResultLayout
      items={spaces}
      renderItem={(item) => <SpaceSearchItem space={item} />}
      total={total}
      size={size}
      isLoading={isLoading}
    />
  );
}

export default SpaceSearchTab;

const SpaceSearchItem = ({ space }: { space: Space }) => {
  const { data: roomData } = useGetRoom(space.roomId);
  const { data: channelData } = useGetChannel(roomData?.channelId!, {
    enabled: !!roomData?.channelId,
  });

  return (
    <div className="flex flex-col">
      <CategoryIndicator
        categories={[
          { label: channelData?.title!, link: `/channels/${channelData?.id}` },
          {
            label: roomData?.title!,
            link: `/channels/${channelData?.id}/rooms/${roomData?.id}/spaces`,
          },
          {
            label: space.title!,
            link: `/channels/${channelData?.id}/rooms/${roomData?.id}/spaces/${space.id}`,
          },
        ]}
      />
      <div className="text-sm text-muted-foreground line-clamp-4">
        {space.description}
      </div>
    </div>
  );
};
