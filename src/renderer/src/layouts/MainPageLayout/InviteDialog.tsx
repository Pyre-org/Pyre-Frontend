import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { useGetInvitationInfo } from "@renderer/lib/queries/room";
import { useInviteStore } from "@renderer/stores/InviteStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// pyre://invitations/{UUID}
const re = /pyre:\/\/invitations\/([a-zA-Z0-9-]+)/;

function InviteDialog() {
  const isOpen = useInviteStore((state) => state.isOpen);
  const { setOpen } = useInviteStore((state) => state.actions);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const { data: roomData } = useGetInvitationInfo(invitationId!, {
    enabled: !!invitationId,
  });

  useEffect(() => {
    const ref = window.electron.ipcRenderer.on(
      "deeplink",
      (_e, link: string) => {
        setOpen(true);
        const match = link.match(re);
        if (!match) {
          toast.error("잘못된 초대 링크입니다.");
          return;
        }
        const [_, invitationId] = match;
        setInvitationId(invitationId);
      },
    );

    return ref;
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>초대 링크로 룸 참가하기</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center">
          {roomData?.id}
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>참가하기</Button>
          <Button variant="secondary">취소</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteDialog;
