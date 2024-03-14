import { useGetFeeds } from "@renderer/lib/queries/feed";
import { useParams } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import FeedUploadBtn from "./FeedUploadBtn";

function FeedDetail() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { data: feedData } = useGetFeeds(
    { spaceId: spaceId! },
    { enabled: !!spaceId },
  );
  const total = feedData?.total ?? 0;
  // const feeds = feedData?.hits ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end">
        <FeedUploadBtn />
      </div>
      {total > 0 ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            <>{null}</>
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
