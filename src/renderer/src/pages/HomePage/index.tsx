import Loader from "@renderer/components/common/Loader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useMyUser } from "@renderer/lib/queries/auth";
import {
  useGetMyFeedsInfinite,
  useGetOthersFeedsInfinite,
} from "@renderer/lib/queries/feed";
import { useGetRoom } from "@renderer/lib/queries/room";
import { useGetSpace } from "@renderer/lib/queries/space";
import { cn } from "@renderer/lib/utils";
import { useFeedStore } from "@renderer/stores/FeedStore";
import { Feed } from "@renderer/types/schema";
import { ChevronRightIcon, GridIcon, ListIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ViewMap = {
  list: FeedListView,
  grid: FeedGridView,
};

function HomePage() {
  const [mode, setMode] = useState<string>("others");
  const [view, setView] = useState<string>("list");

  const {
    data: otherFeedsData,
    fetchNextPage: otherFetchNextPage,
    isFetchingNextPage: otherIsFetchingNextPage,
    hasNextPage: otherHasNextPage,
    isLoading: otherIsLoading,
  } = useGetOthersFeedsInfinite({});
  const {
    data: myFeedsData,
    fetchNextPage: myFetchNextPage,
    isFetchingNextPage: myisFetchingNextPage,
    hasNextPage: myHasNextPage,
    isLoading: myIsLoading,
  } = useGetMyFeedsInfinite({});

  const feeds =
    mode === "others"
      ? otherFeedsData?.pages.flatMap((page) => page.hits) ?? []
      : myFeedsData?.pages.flatMap((page) => page.hits) ?? [];

  const isFetchingNextPage =
    mode === "others" ? otherIsFetchingNextPage : myisFetchingNextPage;
  const hasNextPage = mode === "others" ? otherHasNextPage : myHasNextPage;
  const fetchNextPage =
    mode === "others" ? otherFetchNextPage : myFetchNextPage;
  const isLoading = mode === "others" ? otherIsLoading : myIsLoading;
  const total =
    mode === "others"
      ? otherFeedsData?.pages?.[0]?.total ?? 0
      : myFeedsData?.pages?.[0]?.total ?? 0;

  const handleFetchNext = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  const ViewComp = ViewMap[view as keyof typeof ViewMap];

  return (
    <section className="flex-1 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">최신 피드</h2>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="list">
              <ListIcon className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="grid">
              <GridIcon className="size-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
      {isLoading && (
        <div className="py-16 mx-auto">
          <Loader />
        </div>
      )}
      {total > 0 ? (
        <ViewComp feeds={feeds} />
      ) : (
        <div className="text-center text-muted-foreground text-sm py-16">
          표시할 피드가 없습니다
        </div>
      )}
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

function FeedListView({ feeds }: { feeds: Feed[] }) {
  return (
    <div className="flex flex-col gap-4">
      {feeds.map((feed) => (
        <FeedItem key={feed.id} feed={feed} />
      ))}
    </div>
  );
}

function FeedGridView({ feeds }: { feeds: Feed[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {feeds.map((feed) => (
        <FeedGridItem key={feed.id} feed={feed} />
      ))}
    </div>
  );
}

const FeedItem: React.FC<{ feed: Feed }> = ({ feed }) => {
  const { data: myUser } = useMyUser();
  const { open } = useFeedStore((state) => state.actions);
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
        <img
          src={feed.imageUrl}
          alt="img"
          className={cn(myUser?.id === feed.userId && "cursor-pointer")}
          onClick={() => myUser?.id === feed.userId && open(feed)}
        />
      </CardHeader>
      {feed.nickname && (
        <CardContent>
          <Link to={`/users/${feed.userId}`}>
            <div className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={feed.profilePictureUrl} />
                <AvatarFallback>
                  <span>{feed.nickname[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{feed.nickname}</span>
                <span className="text-muted-foreground text-xs">
                  {feed.cAt}
                </span>
              </div>
            </div>
          </Link>
        </CardContent>
      )}
    </Card>
  );
};

const FeedGridItem = ({ feed }: { feed: Feed }) => {
  const { data: myUser } = useMyUser();
  const { open } = useFeedStore((state) => state.actions);
  return (
    <Card className="flex flex-col">
      <CardHeader
        className={cn(
          "flex gap-2 items-center flex-1",
          myUser?.id === feed.userId && "cursor-pointer",
        )}
        onClick={() => myUser?.id === feed.userId && open(feed)}
      >
        <img
          src={feed.imageUrl}
          alt="img"
          className="object-cover aspect-square"
        />
      </CardHeader>
      {feed.nickname && (
        <CardContent>
          <Link to={`/users/${feed.userId}`}>
            <div className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={feed.profilePictureUrl} />
                <AvatarFallback>
                  <span>{feed.nickname[0].toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{feed.nickname}</span>
                <span className="text-muted-foreground text-xs">
                  {feed.cAt}
                </span>
              </div>
            </div>
          </Link>
        </CardContent>
      )}
    </Card>
  );
};
