import { Button } from "@mantine/core";
import GoogleIcon from "../../../../resources/google_icon.svg";

function GoogleLoginBtn() {
  return (
    <Button
      leftSection={<img src={GoogleIcon} className="w-4 h-4" />}
      variant="outline"
    >
      구글 로그인
    </Button>
  );
}

export default GoogleLoginBtn;
