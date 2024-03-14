import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";

function CaptureEditCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>캡처 설정</CardTitle>
        <CardDescription>
          캡처된 스크린샷을 업로드할 스페이스 혹은 기본 캡처룸 등 설정을 변경할
          수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default CaptureEditCard;
