import { useGetChannels } from "@renderer/lib/queries/channel";
import ChannelListItem from "./ChannelListItem";
import Loader from "@renderer/components/common/Loader";
import { Button } from "@renderer/components/ui/button";
import { useRef, useState } from "react";
import ChannelCreateForm from "@renderer/components/channel/ChannelCreateForm";
import { useSearchParams } from "react-router-dom";
import Pagination from "@renderer/components/common/Pagination";
import { Input } from "@renderer/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";

const SIZE = 15;

function ChannelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const count = parseInt(searchParams.get("count") || SIZE.toString());
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const { data: publicChannelData, isLoading } = useGetChannels({
    keyword,
    page,
    count,
  });
  const total = publicChannelData?.total ?? 0;

  const handleSearch = () => {
    setSearchParams(() => {
      const searchParams = new URLSearchParams();
      searchParams.set("keyword", inputRef.current?.value ?? "");
      return searchParams;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="container my-8 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">채널 탐색</h1>
          <Button
            size="sm"
            onClick={() => setShowCreateChannel(true)}
            variant="link"
          >
            <PlusIcon className="size-4 mr-2" />
            <span>채널 생성 요청</span>
          </Button>
        </div>
        <div className="flex gap-4">
          <Input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="채널 이름으로 검색"
          />
          <Button size="icon" className="shrink-0" onClick={handleSearch}>
            <SearchIcon size={16} />
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center my-8">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {total > 0 ? (
              publicChannelData?.hits.map((channel) => (
                <ChannelListItem channel={channel} key={channel.id} />
              ))
            ) : (
              <div className="flex justify-center items-center text-muted-foreground text-sm py-8">
                표시할 채널이 없습니다
              </div>
            )}
          </div>
        )}
      </div>
      <ChannelCreateForm
        open={showCreateChannel}
        setOpen={setShowCreateChannel}
      />
      <div className="pb-8">
        <Pagination total={total} linkCount={5} perPage={count} />
      </div>
    </>
  );
}

export default ChannelsPage;
