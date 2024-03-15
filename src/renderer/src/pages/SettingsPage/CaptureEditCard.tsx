import FormCheckbox from "@renderer/components/form/FormCheckbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { EditProfileSchemaType } from "@renderer/lib/schemas/EditProfileSchema";
import { useFormContext } from "react-hook-form";

function CaptureEditCard() {
  const methods = useFormContext<EditProfileSchemaType>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>캡처 설정</CardTitle>
        <CardDescription>
          캡처된 스크린샷을 업로드할 스페이스 혹은 기본 캡처룸 등 설정을 변경할
          수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FormCheckbox
          control={methods.control}
          name="useCaptureRoom"
          label="캡처룸 사용 여부"
          description="설정하신 '방금 캡처됨' 룸에 캡처된 스크린샷을 업로드합니다."
          reverse
        />
        <FormCheckbox
          control={methods.control}
          name="useFeedInfo"
          label="캡처 시 팝업 입력창 표시 여부"
          description="캡처 시 제목 및 설명 등을 입력할 수 있는 팝업 입력창을 표시합니다."
          reverse
        />
      </CardContent>
    </Card>
  );
}

export default CaptureEditCard;
