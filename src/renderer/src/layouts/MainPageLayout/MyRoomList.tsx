import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { useGetMyRoomsWithSpaces } from "@renderer/lib/queries/room";
import { Channel } from "@renderer/types/schema";
import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@renderer/lib/utils";
import { Link } from "react-router-dom";

interface MyRoomListProps {
  channel: Channel;
}

function MyRoomList({ channel }: MyRoomListProps) {
  const { data: roomData } = useGetMyRoomsWithSpaces({ channelId: channel.id });
  const [open, setOpen] = useState(true);
  const rooms = roomData?.hits ?? [];
  const total = roomData?.total ?? 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2 flex-1 truncate">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={channel.imageUrl} />
            <AvatarFallback>{channel.title[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold truncate">{channel.title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDownIcon size={16} className={cn(open && "rotate-180")} />
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="flex flex-col overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            {total > 0 ? (
              <>
                {rooms.map((room) => (
                  <Button
                    key={room.id}
                    className="flex justify-start gap-2"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      to={`/channels/${channel.id}/rooms/${room.id}/spaces`}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={room.imageUrl} />
                        <AvatarFallback>
                          {room.title[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{room.title}</span>
                    </Link>
                  </Button>
                ))}
              </>
            ) : (
              <div className="text-muted-foreground text-sm text-center">
                룸이 없습니다
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyRoomList;
