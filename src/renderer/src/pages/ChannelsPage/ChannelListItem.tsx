import { Button } from "@renderer/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { toast } from "@renderer/components/ui/use-toast";
import { useJoinChannelMutation } from "@renderer/lib/queries/channel";
import { Channel } from "@renderer/types/schema";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ChannelListItemProps {
  channel: Channel;
}

function ChannelListItem({ channel }: ChannelListItemProps) {
  const [show, setShow] = useState(false);
  const joinMutation = useJoinChannelMutation();

  const handleJoinChannel = async () => {
    setShow(false);
    joinMutation.mutate(channel.id, {
      onSuccess: () => {
        toast({
          title: "채널 참가 성공",
          description: `${channel.title}에 참가하였습니다.`,
          duration: 3000,
        });
      },
      onError: (error) => {
        toast({
          title: "채널 참가 실패",
          description: error.message,
          duration: 3000,
        });
      },
    });
  };
  return (
    <Link to={`/channels/${channel.id}`}>
      <Card className="flex flex-col gap-4 group">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex gap-4">
            <img
              className="rounded-sm h-32 aspect-square"
              src={channel.imageUrl}
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
              <div className="text-xs flex gap-4">
                <span>멤버 수 {channel.memberCounts}명</span>
                <span>{channel.roomCounts}개의 스페이스</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {`생성일 ${channel.cAt}`}
              </p>
            </div>
          </div>
          <DropdownMenu open={show} onOpenChange={setShow}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="group-hover:block hidden"
                onClick={() => {
                  setShow((show) => !show);
                }}
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onClick={(e) => e.stopPropagation()}
              className="w-44"
            >
              <DropdownMenuItem onClick={handleJoinChannel}>
                <PlusIcon className="w-4 h-4 mr-2" />
                <span>채널 참가하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default ChannelListItem;
