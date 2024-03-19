import {
  useGetRoomMembers,
  useGetRoomRole,
  useUpdateRoomRoleMutation,
} from "@renderer/lib/queries/room";
import { buttonVariants } from "../ui/button";
import { cn } from "@renderer/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RoomMember, RoomRole } from "@renderer/types/schema";
import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMyUser } from "@renderer/lib/queries/auth";
import { CrownIcon } from "lucide-react";
import { toast } from "sonner";

interface RoomUserListProps {
  roomId: string;
}

const RoleLabels: Record<RoomRole, string> = {
  ROOM_ADMIN: "어드민",
  ROOM_MODE: "관리자",
  ROOM_GUEST: "게스트",
  ROOM_USER: "사용자",
};

const RoleBadges: Partial<Record<RoomRole, ReactNode>> = {
  ROOM_ADMIN: (
    <CrownIcon className="fill-yellow-500 stroke-yellow-500 size-4" />
  ),
  ROOM_MODE: <CrownIcon className="fill-blue-500 stroke-blue-500 size-4" />,
};

function RoomUserList({ roomId }: RoomUserListProps) {
  const { data: memberData } = useGetRoomMembers(roomId);
  const members = memberData?.hits ?? [];
  const total = memberData?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold">
        멤버 목록 ({total.toLocaleString()})
      </h2>
      <div className="flex flex-col gap-1">
        {members.map((member) => (
          <RoomUserListItem
            key={member.userId}
            member={member}
            roomId={roomId}
          />
        ))}
      </div>
    </div>
  );
}

export default RoomUserList;

function RoomUserListItem({
  member,
  roomId,
}: {
  member: RoomMember;
  roomId: string;
}) {
  const { data: myUser } = useMyUser();
  const { data: myRoomRole } = useGetRoomRole(roomId);
  const updateRoleMutation = useUpdateRoomRoleMutation();
  const canEdit = myRoomRole === "ROOM_ADMIN" || myRoomRole === "ROOM_MODE";

  const handleUpdateRole = (userId: string, role: RoomRole) => {
    updateRoleMutation.mutate(
      { roomId, userId, role },
      {
        onSuccess: () => {
          toast.success("멤버 역할이 변경되었습니다");
        },
        onError: (error) => {
          toast.error("멤버 역할 변경에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      },
    );
  };

  return (
    <div
      key={member.userId}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex justify-between py-6",
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage src={member.profileImageUrl} alt="profile" />
          <AvatarFallback>{member.nickname[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span>{member.nickname}</span>
        {RoleBadges[member.role]}
      </div>
      <div>
        <Select
          value={member.role}
          onValueChange={(role) =>
            handleUpdateRole(member.userId, role as RoomRole)
          }
          disabled={!canEdit || member.userId === myUser?.id}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(RoleLabels).map(([role, label]) => {
              return (
                <SelectItem key={role} value={role}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
