import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useGetRooms } from "@renderer/lib/queries/room";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import RoomItem from "./RoomItem";

function RoomList() {
  const { channelId } = useParams<{ channelId: string }>();
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: roomData } = useGetRooms({ channelId: channelId!, keyword });

  const handleSearch = () => {
    if (!inputRef.current) return;

    setKeyword(inputRef.current.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const rooms = roomData?.hits ?? [];
  const total = roomData?.total ?? 0;

  return (
    <div className="flex flex-col gap-2">
      {keyword && (
        <span className="font-semibold text-sm">
          &apos;{keyword}&apos;의 검색 결과 {total}건
        </span>
      )}
      <div className="flex items-center gap-4">
        <Input
          className="flex-1"
          placeholder="룸 이름으로 검색"
          ref={inputRef}
          onKeyDown={handleSearchKeyDown}
        />
        <Button
          size="icon"
          variant="secondary"
          className="shrink-0"
          onClick={handleSearch}
        >
          <SearchIcon className="size-4" />
        </Button>
      </div>
      {total > 0 ? (
        <div className="grid grid-cols-3 gap-4 py-4">
          {rooms.map((room) => (
            <RoomItem key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm py-8">
          {keyword ? "검색 결과가 없습니다" : "채널에 룸이 없습니다"}
        </div>
      )}
    </div>
  );
}

export default RoomList;
