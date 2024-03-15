import { useInviteStore } from "@renderer/stores/InviteStore";
import { useEffect } from "react";
import { toast } from "sonner";

// pyre://invitations/{UUID}
const re = /pyre:\/\/invitations\/([a-zA-Z0-9-]+)/;

export const useInvite = () => {
  const { setOpen } = useInviteStore((state) => state.actions);

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
};
