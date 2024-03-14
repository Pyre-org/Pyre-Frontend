import { useGetFeeds } from "@renderer/lib/queries/feed";
import { useParams } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import FeedUploadBtn from "./FeedUploadBtn";
import { Feed } from "@renderer/types/schema";
import { motion } from "framer-motion";

function FeedDetail() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { data: feedData } = useGetFeeds(
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
      {total > 0 ? (
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

const FeedItem = ({ feed }: FeedItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="cursor-pointer"
    >
      <img src={feed.imageUrl} alt={feed.id} />
    </motion.div>
  );
};
