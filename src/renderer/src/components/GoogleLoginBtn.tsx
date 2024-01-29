import GoogleIcon from "@resources/google_icon.svg";
import { Button } from "./ui/button";

function GoogleLoginBtn() {
  return (
    <Button variant="outline">
      <img src={GoogleIcon} className="w-4 h-4 mr-2" />
      <span>구글 로그인</span>
    </Button>
  );
}

export default GoogleLoginBtn;
