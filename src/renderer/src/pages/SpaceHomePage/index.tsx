import RoomUserList from "@renderer/components/room/RoomUserList";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { Separator } from "@renderer/components/ui/separator";
import {
  useCreateInvitationMutation,
  useGetRoom,
  useGetRoomRole,
} from "@renderer/lib/queries/room";
import { useRoomStore } from "@renderer/stores/RoomStore";
import { MailIcon, MoreHorizontalIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function SpaceHomePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [showList, setShowList] = useState(false);
  const { open: openDialog } = useRoomStore((state) => state.actions);
  const { data: roomData } = useGetRoom(roomId!, { enabled: !!roomId });
  const { data: roomRole } = useGetRoomRole(roomId!, { enabled: !!roomId });
  const createInviteMutation = useCreateInvitationMutation();

  const handleOpenDialog = () => {
    openDialog(roomData);
    setShowList(false);
  };

  const handleCreateInvite = () => {
    createInviteMutation.mutate(
      { roomId: roomId!, maxDays: 7 },
      {
        onSuccess: (httpLink) => {
          const link = `pyre://invitations/${httpLink.split("/").pop()}`;
          navigator.clipboard.writeText(link);
          toast.success("초대 링크가 클립보드에 복사되었습니다", {
            description: link,
          });
        },
        onError: (error) => {
          toast.error("초대 링크 생성에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={roomData?.imageUrl} />
                <AvatarFallback>
                  <span>{roomData?.title[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold">{roomData?.title}</p>
            </div>
            {(roomRole === "ROOM_ADMIN" || roomRole === "ROOM_MODE") && (
              <DropdownMenu open={showList} onOpenChange={setShowList}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowList(true)}
                  >
                    <MoreHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleOpenDialog}>
                    <SettingsIcon className="size-4 mr-3" />
                    <span>룸 정보 수정</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCreateInvite}>
                    <MailIcon className="size-4 mr-3" />
                    <span>초대 링크 생성</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="my-2 text-xs text-muted-foreground flex items-center gap-2 mb-4">
            <span>룸의 멤버 {roomData?.memberCounts}명</span>·
            <span>{roomData?.spaceCounts}개의 스페이스</span>·
            <span>생성일 {roomData?.cAt}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {roomData?.description}
          </div>
        </div>
        <Separator />
      </div>
      <RoomUserList roomId={roomId!} />
    </div>
  );
}

export default SpaceHomePage;
