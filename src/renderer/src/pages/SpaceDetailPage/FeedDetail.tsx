import { useGetFeeds } from "@renderer/lib/queries/feed";
import { useParams } from "react-router-dom";
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
import { EditIcon } from "lucide-react";
import { useFeedStore } from "@renderer/stores/FeedStore";
import FeedDeleteBtn from "./FeedDeleteBtn";
import { useMyUser } from "@renderer/lib/queries/auth";

function FeedDetail() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { data: feedData, isLoading } = useGetFeeds(
    { spaceId: spaceId! },
    { enabled: !!spaceId },
  );
  const total = feedData?.total ?? 0;
  const feeds = feedData?.hits ?? [];

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
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="10px">
            {feeds.map((feed) => (
              <FeedItem key={feed.id} feed={feed} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
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
    <div className="flex items-center gap-2">
      <Avatar className="size-8">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{nickname[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <h3 className="text-sm">{nickname}</h3>
    </div>
  );
};

const FeedItem = ({ feed }: FeedItemProps) => {
  const { open: openDialog } = useFeedStore((state) => state.actions);
  const { data: myUser } = useMyUser();

  return (
    <Dialog>
      <div className="cursor-pointer flex flex-col gap-4 text-muted-foreground">
        <DialogTrigger asChild>
          <motion.img
            src={feed.imageUrl}
            alt={feed.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </DialogTrigger>
        {feed.userId === myUser?.id && (
          <div className="flex gap-2">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => openDialog(feed)}
            >
              <EditIcon className="size-4 mr-2 text-muted-foreground" />
              <span>수정</span>
            </Button>
            <FeedDeleteBtn feedId={feed.id} />
          </div>
        )}
      </div>
      <DialogContent className="flex flex-col max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{feed.title ?? feed.cAt}</DialogTitle>
          <DialogDescription className="text-xs flex items-center justify-between gap-4 py-4">
            <ProfileNickname
              imageUrl={feed.profilePictureUrl}
              nickname={feed.nickname}
            />
            <span>{feed.cAt}</span>
          </DialogDescription>
          <DialogDescription>{feed.description}</DialogDescription>
        </DialogHeader>
        <img src={feed.imageUrl} alt="img" />
      </DialogContent>
    </Dialog>
  );
};
