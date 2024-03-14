import CaptureEditCard from "./CaptureEditCard";
import ProfileEditCard from "./ProfileEditCard";

function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">개인 설정</h1>
      <ProfileEditCard />
      <CaptureEditCard />
    </div>
  );
}

export default SettingsPage;
