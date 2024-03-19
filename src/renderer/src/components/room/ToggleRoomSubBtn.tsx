import {
  useCheckSubscribtion,
  useJoinRoomMutation,
  useLeaveRoomMutation,
} from "@renderer/lib/queries/room";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";

interface ToggleRoomSubBtnProps {
  channelId: string;
  roomId: string;
}

function ToggleRoomSubBtn({ roomId, channelId }: ToggleRoomSubBtnProps) {
  const joinMutation = useJoinRoomMutation();
  const leaveMutation = useLeaveRoomMutation();
  const { data: isSubscribed } = useCheckSubscribtion(roomId!);
  const subPending = joinMutation.isPending || leaveMutation.isPending;

  const handleSubscribe = () => {
    if (subPending) return;
    if (!isSubscribed) {
      joinMutation.mutate(
        { roomId, channelId },
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
  );
}

export default ToggleRoomSubBtn;
