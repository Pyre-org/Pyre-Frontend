import { Button } from "@mantine/core";
import GoogleIcon from "@resources/google_icon.svg";

function GoogleLoginBtn() {
  return (
    <Button
      variant="outline"
      c="white"
      leftSection={<img src={GoogleIcon} className="w-4 h-4" />}
    >
      구글 로그인
    </Button>
  );
}

export default GoogleLoginBtn;
