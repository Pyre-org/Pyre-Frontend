import FormCheckbox from "@renderer/components/form/FormCheckbox";
import FormComboBox from "@renderer/components/form/FormCombobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { useGetMyChannels } from "@renderer/lib/queries/channel";
import { useGetMyRooms } from "@renderer/lib/queries/room";
import { useGetSpaces } from "@renderer/lib/queries/space";
import { EditProfileSchemaType } from "@renderer/lib/schemas/EditProfileSchema";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

function CaptureEditCard() {
  const methods = useFormContext<EditProfileSchemaType>();
  const [channelInput, setChannelInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [spaceInput, setSpaceInput] = useState("");
  const channelKeyword = useDebounce(channelInput, 300);
  const roomKeyword = useDebounce(roomInput, 300);
  const channelId = useWatch({
    control: methods.control,
    name: "selectedChannelId",
  });
  const roomId = useWatch({
    control: methods.control,
    name: "selectedRoomId",
  });
  const { data: channelData } = useGetMyChannels({ keyword: channelKeyword });
  const { data: roomData } = useGetMyRooms(
    { keyword: roomKeyword, channelId: channelId! },
    { enabled: !!channelId },
  );
  const { data: spaceData } = useGetSpaces(
    { roomId: roomId! },
    { enabled: !!roomId },
  );
  const channels = channelData?.hits ?? [];
  const channelOptions = channels.map((channel) => ({
    label: channel.title,
    value: channel.id,
  }));
  const rooms = roomData?.hits ?? [];
  const roomOptions = rooms.map((room) => ({
    label: room.title,
    value: room.id,
  }));
  const spaces = spaceData?.hits ?? [];
  const spaceOptions = spaces.map((space) => ({
    label: space.title,
    value: space.id,
  }));

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
        <FormComboBox
          control={methods.control}
          name="selectedChannelId"
          label="기본 채널 설정"
          keyword={channelInput}
          setKeyword={setChannelInput}
          placeholder="채널을 선택해주세요"
          searchPlaceholder="구독 중인 채널 이름을 검색해주세요"
          options={channelOptions}
        />
        {channelId && (
          <FormComboBox
            control={methods.control}
            name="selectedRoomId"
            label="기본 룸 설정"
            keyword={roomInput}
            setKeyword={setRoomInput}
            placeholder="룸을 선택해주세요"
            searchPlaceholder="룸의 이름을 검색해주세요"
            options={roomOptions}
          />
        )}
        {roomId && (
          <FormComboBox
            control={methods.control}
            name="selectedSpaceId"
            label="기본 스페이스 설정"
            keyword={spaceInput}
            setKeyword={setSpaceInput}
            placeholder="스페이스를 선택해주세요"
            searchPlaceholder="스페이스의 이름을 검색해주세요"
            options={spaceOptions}
          />
        )}
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
