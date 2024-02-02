import { useGetChannels } from "@renderer/lib/queries/channel";
import ChannelListItem from "./ChannelListItem";
import Loader from "@renderer/components/Loader";
import { Button } from "@renderer/components/ui/button";
import { useState } from "react";
import ChannelCreateForm from "@renderer/components/channel/ChannelCreateForm";

function ChannelsPage() {
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const { data: publicChannelData, isLoading } = useGetChannels({});
  const total = publicChannelData?.total ?? 0;
  return (
    <>
      <div className="container my-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl">채널 탐색</h1>
          <Button size="sm" onClick={() => setShowCreateChannel(true)}>
            채널 생성 요청
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center my-8">
            <Loader />
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {total > 0 ? (
              publicChannelData?.hits.map((channel) => (
                <ChannelListItem channel={channel} key={channel.id} />
              ))
            ) : (
              <div className="flex justify-center items-center text-muted-foreground text-sm">
                표시할 채널이 없습니다
              </div>
            )}
          </div>
        )}
      </div>
      <ChannelCreateForm
        open={showCreateChannel}
        setOpen={setShowCreateChannel}
      />
    </>
  );
}

export default ChannelsPage;
