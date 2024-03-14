import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";

function ProfileEditCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 및 소개</CardTitle>
        <CardDescription>
          프로필 사진 및 다른 유저에게 표시되는 설명을 수정할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default ProfileEditCard;
