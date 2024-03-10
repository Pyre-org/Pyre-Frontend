import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetChannel } from "@renderer/lib/queries/channel";
import { ArrowLeftIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@renderer/components/ui/separator";
import {
  useCheckSubscribtion,
  useGetRoom,
  useJoinRoomMutation,
  useLeaveRoomMutation,
} from "@renderer/lib/queries/room";
import { toast } from "sonner";

function RoomInfoPage() {
  const joinMutation = useJoinRoomMutation();
  const leaveMutation = useLeaveRoomMutation();
  const { channelId, roomId } = useParams<{
    channelId: string;
    roomId: string;
  }>();
  const { data: channelData } = useGetChannel(channelId!, {
    enabled: !!channelId,
  });
  const { data: roomData } = useGetRoom(roomId!, {
    enabled: !!roomId,
  });
  const { data: isSubscribed } = useCheckSubscribtion(roomId!);
  const subPending = joinMutation.isPending || leaveMutation.isPending;

  const handleSubscribe = () => {
    if (subPending) return;
    if (!isSubscribed) {
      joinMutation.mutate(
        { roomId: roomId!, channelId: channelId! },
        {
          onSuccess: () => {
            toast("룸 참가에 성공했습니다");
          },
          onError: (error) => {
            toast("룸 참가에 실패했습니다", {
              description: error.response?.data.reason,
            });
          },
        },
      );
    } else {
      leaveMutation.mutate(roomId!, {
        onSuccess: () => {
          toast("룸 나가기에 성공했습니다");
        },
        onError: (error) => {
          toast("룸 나가기에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button size="icon" className="size-8" variant="ghost" asChild>
                <Link to="../../../">
                  <ArrowLeftIcon className="size-4 text-muted-foreground" />
                </Link>
              </Button>
              <Avatar className="size-8">
                <AvatarImage src={roomData?.imageUrl} />
                <AvatarFallback>
                  <span>{roomData?.title[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">{`${channelData?.title} / ${roomData?.title}`}</p>
            </div>
            <Button
              variant={isSubscribed ? "destructive" : "outline"}
              disabled={subPending}
              onClick={handleSubscribe}
            >
              {isSubscribed ? (
                <LogOutIcon className="size-4 mr-2" />
              ) : (
                <LogInIcon className="size-4 mr-2" />
              )}
              {isSubscribed ? "룸 나가기" : "룸 참가하기"}
            </Button>
          </div>
          <div className="my-2 text-xs text-muted-foreground flex items-center gap-2 mb-4">
            <span>룸의 멤버 {roomData?.memberCounts}명</span>·
            <span>{roomData?.spaceCounts}개의 스페이스</span>·
            <span>{roomData?.cAt}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {channelData?.description}
          </div>
        </div>
        <Separator />
      </div>
    </div>
  );
}

export default RoomInfoPage;
