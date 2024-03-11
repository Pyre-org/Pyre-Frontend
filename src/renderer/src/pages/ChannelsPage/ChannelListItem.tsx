import Image from "@renderer/components/common/Image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { Channel } from "@renderer/types/schema";
import { Link } from "react-router-dom";

interface ChannelListItemProps {
  channel: Channel;
}

function ChannelListItem({ channel }: ChannelListItemProps) {
  return (
    <Link to={`/channels/${channel.id}`}>
      <Card className="flex flex-col gap-4">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex gap-4">
            <Image
              className="rounded-sm h-32 aspect-square"
              src={channel.imageUrl}
              fallback={
                <div className="w-32 h-32 bg-muted flex justify-center items-center">
                  <span className="text-center text-xs text-muted-foreground">
                    이미지가 없습니다
                  </span>
                </div>
              }
              alt="avatar"
            />
            <div className="flex flex-col gap-4 overflow-clip">
              <div className="flex flex-col gap-2 w-full">
                <CardTitle className="text-xl truncate">
                  {channel.title}
                </CardTitle>
                <CardDescription className="truncate">
                  {channel.description}
                </CardDescription>
              </div>
              <div className="text-xs flex gap-2">
                <span>구독 멤버 {channel.memberCounts}명</span>·
                <span>{channel.roomCounts}개의 룸</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {`생성일 ${channel.cAt}`}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default ChannelListItem;
