import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetRoom, useGetRoomRole } from "@renderer/lib/queries/room";
import {
  useGetSpace,
  useGetSpaces,
  useLocateSpaceMutation,
} from "@renderer/lib/queries/space";
import { RoomRole, Space } from "@renderer/types/schema";
import {
  LucideIcon,
  MessageSquareIcon,
  NewspaperIcon,
  SettingsIcon,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateSpaceBtn from "./CreateSpaceDialog";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useSpaceStore } from "@renderer/stores/SpaceStore";

function SpaceList() {
  const { channelId, roomId } = useParams<{ channelId; roomId: string }>();
  const { data: roomData } = useGetRoom(roomId as string);
  const { data: roomRole } = useGetRoomRole(roomId as string);
  const { data: spaceData } = useGetSpaces({ roomId: roomId as string });
  const locateMutation = useLocateSpaceMutation();

  const canEdit = roomRole === "ROOM_ADMIN" || roomRole === "ROOM_MODE";
  const total = spaceData?.total ?? 0;
  const spaces = spaceData?.hits ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }
    const curIdx = spaces.findIndex((room) => room.id === active.id);
    const targetIdx = spaces.findIndex((room) => room.id === over.id);
    if (targetIdx - 1 < 0) return;
    locateMutation.mutate(
      {
        from: active.id.toString(),
        to: spaces[curIdx <= targetIdx ? targetIdx : targetIdx - 1].id,
      },
      {
        onError: (error) => {
          console.error(error);
          toast.error("룸 위치 변경에 실패했습니다", {
            description: error.response?.data.reason,
          });
        },
      },
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link
            to={`/channels/${channelId}/rooms/${roomId}/spaces`}
            className="flex flex-1 truncate"
          >
            <Avatar className="w-6 h-6 mr-2 shrink-0">
              <AvatarImage src={roomData?.imageUrl} />
              <AvatarFallback>
                <span>{roomData?.title[0].toUpperCase()}</span>
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{roomData?.title}</span>
          </Link>
          {canEdit && <CreateSpaceBtn />}
        </div>

        <div className="text-muted-foreground">
          {total > 0 ? (
            <SortableContext
              items={spaces}
              strategy={verticalListSortingStrategy}
            >
              {spaces.map((space) => (
                <SpaceListItem key={space.id} space={space} />
              ))}
            </SortableContext>
          ) : (
            <div className="flex justify-center text-sm my-4">
              채널에 스페이스가 없습니다
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

const iconMap: Record<Space["type"], LucideIcon> = {
  SPACE_FEED: NewspaperIcon,
  SPACE_CHAT: MessageSquareIcon,
  SPACE_GENERAL: NewspaperIcon,
  SPACE_GENERAL_CHAT: MessageSquareIcon,
};

const showSettings = (space: Space, role: RoomRole) => {
  return (
    space.type !== "SPACE_GENERAL" &&
    space.type !== "SPACE_GENERAL_CHAT" &&
    (role === "ROOM_ADMIN" || role === "ROOM_MODE")
  );
};

function SpaceListItem({ space }: { space: Space }) {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: spaceData } = useGetSpace(space.id);
  const Icon = iconMap[space.type!];
  const { open: openDialog } = useSpaceStore((state) => state.actions);
  const { data: roleData } = useGetRoomRole(space.roomId);
  const role = roleData ?? "ROOM_GUEST";
  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: space.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    navigate(`/channels/${channelId}/rooms/${space.roomId}/spaces/${space.id}`);
  };

  if (!spaceData) return null;

  return (
    <Button
      variant="ghost"
      className="justify-between w-full items-center truncate"
      key={space.id}
      onClick={handleClick}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center w-full truncate">
        <Icon className="size-4 mr-2" />
        <span className="truncate">{spaceData.title}</span>
      </div>
      {showSettings(spaceData, role) && (
        <div
          className="size-8 flex justify-center items-center aspect-square"
          onClick={(e) => {
            e.stopPropagation();
            openDialog(space);
          }}
        >
          <SettingsIcon className="w-4 hover:text-primary" />
        </div>
      )}
    </Button>
  );
}

export default SpaceList;
