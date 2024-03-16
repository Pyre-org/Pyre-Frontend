import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import {
  useGetMyFeedsInfinite,
  useGetOthersFeedsInfinite,
} from "@renderer/lib/queries/feed";
import { useGetRoom } from "@renderer/lib/queries/room";
import { useGetSpace } from "@renderer/lib/queries/space";
import { Feed } from "@renderer/types/schema";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [mode, setMode] = useState<string>("others");

  const {
    data: otherFeedsData,
    fetchNextPage: otherFetchNextPage,
    isFetchingNextPage: otherIsFetchingNextPage,
    hasNextPage: otherHasNextPage,
  } = useGetOthersFeedsInfinite({});
  const {
    data: myFeedsData,
    fetchNextPage: myFetchNextPage,
    isFetchingNextPage: myisFetchingNextPage,
    hasNextPage: myHasNextPage,
  } = useGetMyFeedsInfinite({});

  const otherFeeds =
    mode === "others"
      ? otherFeedsData?.pages.flatMap((page) => page.hits) ?? []
      : myFeedsData?.pages.flatMap((page) => page.hits) ?? [];

  const isFetchingNextPage =
    mode === "others" ? otherIsFetchingNextPage : myisFetchingNextPage;
  const hasNextPage = mode === "others" ? otherHasNextPage : myHasNextPage;
  const fetchNextPage =
    mode === "others" ? otherFetchNextPage : myFetchNextPage;

  const handleFetchNext = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <section className="flex-1 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">최신 피드</h2>
      </div>
      <Tabs value={mode} onValueChange={setMode} className="w-full">
        <TabsList className="w-full flex">
          <TabsTrigger value="others" className="flex-1">
            구독 채널의 최신 피드
          </TabsTrigger>
          <TabsTrigger value="my" className="flex-1">
            내가 업로드한 피드
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-4">
        {otherFeeds.map((feed) => (
          <FeedItem key={feed.id} feed={feed} />
        ))}
      </div>
      {hasNextPage && (
        <Button
          variant="outline"
          disabled={isFetchingNextPage}
          onClick={handleFetchNext}
        >
          피드 더 불러오기
        </Button>
      )}
    </section>
  );
}

export default HomePage;

const FeedItem: React.FC<{ feed: Feed }> = ({ feed }) => {
  const { data: spaceData } = useGetSpace(feed.spaceId);
  const { data: roomData } = useGetRoom(spaceData?.roomId!, {
    enabled: !!spaceData?.roomId,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex gap-2 items-center truncate">
          <Avatar className="size-8">
            <AvatarImage src={roomData?.imageUrl} />
            <AvatarFallback>
              <span>{roomData?.title?.[0]?.toUpperCase()}</span>
            </AvatarFallback>
          </Avatar>
          <div className="truncate text-sm font-semibold flex items-center gap-2">
            <Button variant="link" className="p-0" asChild>
              <Link
                to={`/channels/${roomData?.channelId}/rooms/${roomData?.id}/spaces`}
              >
                {roomData?.title}
              </Link>
            </Button>
            <ChevronRightIcon className="size-4" />
            <Button variant="link" className="p-0" asChild>
              <Link
                to={`/channels/${roomData?.channelId}/rooms/${roomData?.id}/spaces/${spaceData?.id}`}
              >
                {spaceData?.title}
              </Link>
            </Button>
          </div>
        </div>
        <h2 className="font-semibold truncate">{feed.title}</h2>
        <img src={feed.imageUrl} alt="img" />
      </CardHeader>
      {feed.nickname && (
        <CardContent>
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={feed.profilePictureUrl} />
              <AvatarFallback>
                <span>{feed.nickname[0].toUpperCase()}</span>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{feed.nickname}</span>
              <span className="text-muted-foreground text-xs">{feed.cAt}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
