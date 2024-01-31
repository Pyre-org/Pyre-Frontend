import { useGetChannels } from "@renderer/lib/queries/channel";
import ChannelListItem from "./ChannelListItem";
import Loader from "@renderer/components/Loader";

function ChannelsPage() {
  const { data: publicChannelData, isLoading } = useGetChannels({});
  return (
    <div className="container my-8">
      <h1 className="text-xl">채널 탐색</h1>
      {isLoading ? (
        <div className="flex justify-center items-center my-8">
          <Loader />
        </div>
      ) : (
        <div className="mt-4">
          {publicChannelData?.hits.map((channel) => (
            <ChannelListItem channel={channel} key={channel.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChannelsPage;
