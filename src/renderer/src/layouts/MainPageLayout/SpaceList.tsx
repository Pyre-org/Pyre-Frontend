import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetRoom } from "@renderer/lib/queries/room";
import {
  useGetSpace,
  useGetSpaces,
  useLocateSpaceMutation,
} from "@renderer/lib/queries/space";
import { Space } from "@renderer/types/schema";
import { LucideIcon, MessageSquareIcon, NewspaperIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateSpaceBtn from "./CreateSpaceBtn";
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

function SpaceList() {
  const { channelId, roomId } = useParams<{ channelId; roomId: string }>();
  const { data: roomData } = useGetRoom(roomId as string);
  const { data: spaceData } = useGetSpaces({ roomId: roomId as string });
  const locateMutation = useLocateSpaceMutation();

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
          <CreateSpaceBtn />
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

function SpaceListItem({ space }: { space: Space }) {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: spaceData } = useGetSpace(space.id);
  const Icon = iconMap[space.type];
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

  return (
    <Button
      variant="ghost"
      className="justify-start w-full"
      key={space.id}
      onClick={handleClick}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Icon className="size-4 mr-2" />
      <span className="truncate">{spaceData?.title}</span>
    </Button>
  );
}

export default SpaceList;
