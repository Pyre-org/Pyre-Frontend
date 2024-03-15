import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { useInviteStore } from "@renderer/stores/InviteStore";
import { useEffect, useState } from "react";

function InviteDialog() {
  const isOpen = useInviteStore((state) => state.isOpen);
  const { setOpen } = useInviteStore((state) => state.actions);
  const [link, setLink] = useState("");

  useEffect(() => {
    const ref = window.electron.ipcRenderer.on(
      "deeplink",
      (_, link: string) => {
        setOpen(true);
        setLink(link);
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
        <div className="flex flex-col justify-center items-center">{link}</div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>참가하기</Button>
          <Button variant="secondary">취소</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteDialog;
