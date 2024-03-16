import { useGetFeedsInfinite } from "@renderer/lib/queries/feed";
import { Link, useParams } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import FeedUploadBtn from "./FeedUploadBtn";
import { Feed } from "@renderer/types/schema";
import { motion } from "framer-motion";
import Loader from "@renderer/components/common/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { EditIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useFeedStore } from "@renderer/stores/FeedStore";
import { useMyUser } from "@renderer/lib/queries/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import FeedDeleteDialog from "./FeedDeleteDialog";
import { useState } from "react";

function FeedDetail() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const {
    data: feedData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetFeedsInfinite({
    spaceId: spaceId!,
  });

  const total = feedData?.pages?.[0].total ?? 0;
  const feeds = feedData?.pages?.flatMap((page) => page.hits) ?? [];

  const handleFetchNextPage = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full w-full overflow-y-scroll flex-1 scrollbar-thin">
      <div className="flex justify-end">
        <FeedUploadBtn />
      </div>
      {isLoading ? (
        <div className="py-16 mx-auto">
          <Loader />
        </div>
      ) : total > 0 ? (
        <div className="flex flex-col gap-4">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry gutter="10px">
              {feeds.map((feed) => (
                <FeedItem key={feed.id} feed={feed} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
          {hasNextPage && (
            <Button
              variant="outline"
              disabled={isFetchingNextPage}
              onClick={handleFetchNextPage}
            >
              피드 더보기
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center text-sm py-16 text-muted-foreground">
          표시할 피드가 없습니다
        </div>
      )}
    </div>
  );
}

export default FeedDetail;

interface FeedItemProps {
  feed: Feed;
}

const ProfileNickname = ({
  imageUrl,
  nickname,
}: {
  imageUrl: string;
  nickname: string;
}) => {
  return (
    <div className="flex items-center gap-2 truncate">
      <Avatar className="size-8">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{nickname[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <h3 className="text-sm truncate">{nickname}</h3>
    </div>
  );
};

const FeedItem = ({ feed }: FeedItemProps) => {
  const { open: openDialog } = useFeedStore((state) => state.actions);
  const { data: myUser } = useMyUser();
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <Dialog>
      <div className="flex flex-col text-muted-foreground shadow-md">
        <DialogTrigger asChild>
          <motion.img
            src={feed.imageUrl}
            alt={feed.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="cursor-pointer"
          />
        </DialogTrigger>
        <div className="flex gap-2 rounded-b-md p-2 justify-between">
          <Link to={`/users/${feed.userId}`}>
            <ProfileNickname
              imageUrl={feed.profilePictureUrl}
              nickname={feed.nickname}
            />
          </Link>
          {myUser?.id === feed.userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="size-8 shrink-0">
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openDialog(feed)}>
                  <EditIcon className="size-4 mr-2" />
                  <span>피드 수정</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                  <Trash2Icon className="size-4 mr-2" />
                  <span>피드 삭제</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{feed.title ?? feed.cAt}</DialogTitle>
          <DialogDescription className="text-xs flex items-center justify-between gap-4 py-4">
            <Link to={`/users/${feed.userId}`}>
              <ProfileNickname
                imageUrl={feed.profilePictureUrl}
                nickname={feed.nickname}
              />
            </Link>
            <span>{feed.cAt}</span>
          </DialogDescription>
          <DialogDescription>{feed.description}</DialogDescription>
        </DialogHeader>
        <img src={feed.imageUrl} alt="img" />
      </DialogContent>
      <FeedDeleteDialog
        feedId={feed.id}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </Dialog>
  );
};
