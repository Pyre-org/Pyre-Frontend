import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { useGetUserProfile } from "@renderer/lib/queries/auth";
import { useParams } from "react-router-dom";

function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: userData } = useGetUserProfile(userId!, { enabled: !!userId });
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage src={userData?.profilePictureUrl} />
          <AvatarFallback>{userData?.nickname[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{userData?.nickname}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {userData?.shortDescription}
      </p>
      <div className="grid grid-cols-4 gap-2 p-2 divide-x border rounded-md">
        <div className="flex flex-col justify-center items-center gap-2">
          <h3 className="font-semibold">가입일</h3>
          <span className="text-sm text-muted-foreground">
            {userData?.createDate}
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <h3 className="font-semibold">최근 활동일</h3>
          <span className="text-sm text-muted-foreground">
            {userData?.lastActive}
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <h3 className="font-semibold">팔로워 수</h3>
          <span className="text-sm text-muted-foreground">
            {userData?.followerCounts}명
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <h3 className="font-semibold">팔로잉 수</h3>
          <span className="text-sm text-muted-foreground">
            {userData?.followingCounts}명
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserDetailPage;
