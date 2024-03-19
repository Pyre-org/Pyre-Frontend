import { useSearchRoom } from "@renderer/lib/queries/search";
import SearchResultLayout from "./SearchResultLayout";
import { Room } from "@renderer/types/schema";
import { useGetChannel } from "@renderer/lib/queries/channel";
import CategoryIndicator from "@renderer/components/common/CategoryIndicator";
import { ITabItemCompProps } from ".";

function RoomSearchTab({ keyword, page, size }: ITabItemCompProps) {
  const { data: roomData, isLoading } = useSearchRoom({
    keyword,
    page,
    size,
  });
  const rooms = roomData?.hits ?? [];
  const total = roomData?.total ?? 0;

  return (
    <SearchResultLayout
      items={rooms}
      renderItem={(item) => <RoomSearchItem room={item} />}
      total={total}
      size={size}
      isLoading={isLoading}
    />
  );
}

export default RoomSearchTab;

const RoomSearchItem = ({ room }: { room: Room }) => {
  const { data: channelData } = useGetChannel(room.channelId);
  return (
    <div className="flex flex-col">
      <CategoryIndicator
        categories={[
          { label: channelData?.title!, link: `/channels/${channelData?.id}` },
          {
            label: room.title!,
            link: `/channels/${channelData?.id}/rooms/${room.id}/spaces`,
          },
        ]}
      />
      <div className="text-sm text-muted-foreground line-clamp-4">
        {room.description}
      </div>
    </div>
  );
};
