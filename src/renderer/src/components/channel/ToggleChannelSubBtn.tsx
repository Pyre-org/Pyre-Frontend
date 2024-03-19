import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  useCheckSubscription,
  useJoinChannelMutation,
  useLeaveChannelMutation,
} from "@renderer/lib/queries/channel";
import { useTheme } from "../common/ThemeProvider";
import { toast } from "sonner";

interface ToggleChannelSubBtnProps {
  channelId: string;
}

function ToggleChannelSubBtn({ channelId }: ToggleChannelSubBtnProps) {
  const joinMutation = useJoinChannelMutation();
  const leaveMutation = useLeaveChannelMutation();
  const { data: subData } = useCheckSubscription(channelId!);
  const { theme } = useTheme();

  const isSubscribed = subData;
  const subPending = joinMutation.isPending || leaveMutation.isPending;

  const handleSubscribe = () => {
    if (subPending) return;
    if (!isSubscribed) {
      joinMutation.mutate(channelId!, {
        onSuccess: () => {
          toast("채널 구독에 성공했습니다");
        },
        onError: (error) => {
          toast("채널 구독에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      });
    } else {
      leaveMutation.mutate(channelId!, {
        onSuccess: () => {
          toast("채널 구독을 취소했습니다");
        },
        onError: (error) => {
          toast("채널 구독 취소에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      });
    }
  };

  return (
    <Button variant="outline" disabled={subPending} onClick={handleSubscribe}>
      <StarIcon
        className="size-4 mr-2"
        {...(isSubscribed
          ? { fill: theme !== "light" ? "white" : "black" }
          : {})}
      />
      {isSubscribed ? "구독 중" : "채널 구독"}
    </Button>
  );
}

export default ToggleChannelSubBtn;
