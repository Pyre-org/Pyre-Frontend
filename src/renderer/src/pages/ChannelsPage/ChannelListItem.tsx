import Image from "@renderer/components/common/Image";
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
import { useJoinChannelMutation } from "@renderer/lib/queries/channel";
import { Channel } from "@renderer/types/schema";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ChannelListItemProps {
  channel: Channel;
}

function ChannelListItem({ channel }: ChannelListItemProps) {
  const [show, setShow] = useState(false);
  const joinMutation = useJoinChannelMutation();

  const handleJoinChannel = async () => {
    if (joinMutation.isPending) return;
    setShow(false);
    joinMutation.mutate(channel.id, {
      onSuccess: () => {
        toast.success(`${channel.title}에 참가하였습니다.`);
      },
      onError: (error) => {
        toast.error("채널 참가에 실패했습니다", {
          description: error.response?.data.reason,
        });
      },
    });
  };
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
              <div className="text-xs flex gap-4">
                <span>구독 멤버 {channel.memberCounts}명</span>
                <span>{channel.roomCounts}개의 룸</span>
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
              <DropdownMenuItem
                onClick={handleJoinChannel}
                disabled={joinMutation.isPending}
              >
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
