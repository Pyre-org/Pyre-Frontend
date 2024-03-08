import { useGetMyChannels } from "@renderer/lib/queries/channel";
import MyRoomList from "./MyRoomList";

function MyChannelRoomList() {
  const { data: channelData } = useGetMyChannels();
  const channels = channelData?.hits ?? [];
  const total = channelData?.total ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">내 채널 및 룸</h1>
      {total > 0 ? (
        <div className="flex flex-col">
          {channels.map((channel) => (
            <MyRoomList key={channel.id} channel={channel} />
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          채널이 없습니다. 채널을 추가해보세요.
        </div>
      )}
    </div>
  );
}

export default MyChannelRoomList;
