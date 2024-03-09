import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  useGetChannels,
  useGetMyChannels,
} from "@renderer/lib/queries/channel";
import { Channel } from "@renderer/types/schema";
import { AtSignIcon } from "lucide-react";
import { Link } from "react-router-dom";

function ChannelList() {
  const { data: initialPublicChannelData } = useGetChannels({});
  const { data: myChannelData } = useGetMyChannels();

  if (!initialPublicChannelData || !myChannelData) return null;

  const publicChannels = initialPublicChannelData.hits.filter(
    (channel) =>
      !myChannelData.hits.some((myChannel) => myChannel.id === channel.id),
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">
            구독 채널
          </h2>
          <div className="relative">
            <Input className="h-8 mb-4 pl-8" placeholder="채널 이름으로 검색" />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-1 top-0 translate-y-1.5" />
          </div>
        </div>
        {myChannelData.total > 0 ? (
          myChannelData.hits.map((channel) => (
            <ChannelListItem channel={channel} key={channel.id} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <span className="text-muted-foreground text-sm">
              채널을 추가해보세요
            </span>
            <Button size="sm" variant="secondary" asChild>
              <Link to="/channels">채널 탐색</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">탐색</h2>
        </div>
        {publicChannels.length > 0 ? (
          publicChannels.map((channel) => (
            <ChannelListItem channel={channel} key={channel.id} />
          ))
        ) : (
          <div className="flex justify-center items-center text-sm">
            <span>표시할 채널이 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChannelListItem({ channel }: { channel: Channel }) {
  return (
    <Button
      variant="ghost"
      className="justify-start"
      key={channel.title}
      asChild
    >
      <Link to={`/channels/${channel.id}`}>
        <Avatar className="w-6 h-6 mr-2 shrink-0">
          <AvatarImage src={channel.imageUrl} />
          <AvatarFallback>
            <AtSignIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{channel.title}</span>
      </Link>
    </Button>
  );
}

export default ChannelList;
