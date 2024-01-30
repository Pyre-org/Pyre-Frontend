import { HashtagIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
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
import { Link } from "react-router-dom";

function ChannelList() {
  const { data: publicChannelData } = useGetChannels({});
  const { data: myChannelData } = useGetMyChannels();

  if (!publicChannelData || !myChannelData) return null;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">
            내 채널
          </h2>
          <div className="relative">
            <Input className="h-8 mb-4 pl-8" placeholder="채널 이름으로 검색" />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-1 top-0 translate-y-1.5" />
          </div>
        </div>
        {myChannelData.total > 0 ? (
          myChannelData.hits.map((channel) => (
            <Button
              variant="ghost"
              className="justify-start"
              key={channel.title}
              asChild
            >
              <Link to={`/channels/${channel.id}`}>
                <HashtagIcon className="w-5 h-5 mr-2 shrink-0" />
                <span className="truncate">{channel.title}</span>
              </Link>
            </Button>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <span className="text-muted-foreground text-sm">
              채널을 추가해보세요
            </span>
            <Button size="sm" variant="secondary">
              채널 탐색
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">탐색</h2>
        </div>
        {publicChannelData.hits.map((channel) => (
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
                  <HashtagIcon />
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{channel.title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ChannelList;
