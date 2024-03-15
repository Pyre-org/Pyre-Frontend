import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import {
  useAcceptInvitationMutation,
  useGetInvitationInfo,
} from "@renderer/lib/queries/room";
import { useInviteStore } from "@renderer/stores/InviteStore";
import { useEffect } from "react";
import { toast } from "sonner";

// pyre://invitations/{UUID}
const re = /pyre:\/\/invitations\/([a-zA-Z0-9-]+)/;

function InviteDialog() {
  const isOpen = useInviteStore((state) => state.isOpen);
  const { setOpen } = useInviteStore((state) => state.actions);
  const invitationId = useInviteStore((state) => state.invitationId);
  const { data: roomData } = useGetInvitationInfo(invitationId!, {
    enabled: !!invitationId,
  });
  const acceptMutation = useAcceptInvitationMutation();

  useEffect(() => {
    const ref = window.electron.ipcRenderer.on(
      "deeplink",
      (_e, link: string) => {
        const match = link.match(re);
        if (!match) {
          toast.error("잘못된 초대 링크입니다.");
          return;
        }
        const [_, invitationId] = match;
        setOpen(true, invitationId);
      },
    );

    return ref;
  }, []);

  const handleAccept = () => {
    acceptMutation.mutate(invitationId!, {
      onSuccess: () => {
        setOpen(false, invitationId);
        toast.success("성공적으로 룸에 참가했습니다");
      },
      onError: (error) => {
        toast.error("룸 참가에 실패했습니다", {
          description: error.response?.data.reason,
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open, invitationId)}>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>초대 링크로 룸 참가하기</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center py-8 gap-2">
          <Avatar>
            <AvatarImage src={roomData?.imageUrl} />
            <AvatarFallback>{roomData?.title[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{roomData?.title}</h1>
          <div className="text-sm text-muted-foreground gap-2 flex">
            <span>멤버 수 {roomData?.memberCounts}명</span>·
            <span>{roomData?.spaceCounts}개의 스페이스</span>
          </div>
          <p className="line-clamp-3 mt-2">{roomData?.description}</p>
        </div>
        <DialogFooter>
          <Button onClick={handleAccept} disabled={acceptMutation.isPending}>
            참가하기
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">취소</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteDialog;
