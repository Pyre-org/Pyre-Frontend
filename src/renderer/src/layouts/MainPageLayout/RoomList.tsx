import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RoomCreateDialog from "@renderer/components/room/RoomCreateDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import {
  useGetMyRoomsWithSpaces,
  useLocateRoomMutation,
} from "@renderer/lib/queries/room";
import { useRoomStore } from "@renderer/stores/RoomStore";
import { Room, RoomType } from "@renderer/types/schema";
import { SettingsIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function RoomList() {
  const { channelId } = useParams<{ channelId: string }>();
  const id = channelId as string;

  const { data: roomData } = useGetMyRoomsWithSpaces({ channelId: id });
  const locateMutation = useLocateRoomMutation();

  const total = roomData?.total ?? 0;
  const rooms = roomData?.hits ?? [];

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
    const curIdx = rooms.findIndex((room) => room.id === active.id);
    const targetIdx = rooms.findIndex((room) => room.id === over.id);
    if (targetIdx - 1 < 0) return;
    locateMutation.mutate(
      {
        from: active.id.toString(),
        to: rooms[curIdx <= targetIdx ? targetIdx : targetIdx - 1].id,
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
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="text-muted-foreground">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground truncate">
              <span>채널에 속한 내 룸</span>
            </h2>
          </div>
          {total > 0 ? (
            <SortableContext
              items={rooms}
              strategy={verticalListSortingStrategy}
            >
              {rooms.map((room) => (
                <RoomListItem key={room.id} room={room} />
              ))}
            </SortableContext>
          ) : (
            <div className="flex justify-center text-sm my-4">
              채널에 룸이 없습니다
            </div>
          )}
        </div>
      </DndContext>
      <RoomCreateDialog />
    </>
  );
}

const showSettings = (type: RoomType) => {
  return type !== RoomType.ROOM_GLOBAL && type !== RoomType.ROOM_CAPTURE;
};

function RoomListItem({ room }: { room: Room }) {
  const { channelId } = useParams<{ channelId: string }>();
  const id = channelId as string;
  const navigate = useNavigate();
  const { open: openRoom } = useRoomStore((state) => state.actions);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: room.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    navigate(`/channels/${id}/rooms/${room.id}/spaces`);
  };

  return (
    <Button
      variant="ghost"
      className="justify-between w-full items-center truncate"
      key={room.title}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <div className="flex items-center w-full truncate">
        <Avatar className="w-6 h-6 mr-2 shrink-0">
          <AvatarImage src={room.imageUrl} />
          <AvatarFallback>
            <span>{room.title[0].toUpperCase()}</span>
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{room.title}</span>
      </div>
      {showSettings(room.type) && (
        <div
          className="size-8 flex justify-center items-center aspect-square"
          onClick={(e) => {
            e.stopPropagation();
            openRoom(room);
          }}
        >
          <SettingsIcon className="w-4 hover:text-primary" />
        </div>
      )}
    </Button>
  );
}

export default RoomList;
