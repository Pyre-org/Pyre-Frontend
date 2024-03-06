import GoogleIcon from "@resources/google_icon.svg";
import { Button, ButtonProps } from "../ui/button";

function GoogleLoginBtn(props: ButtonProps) {
  return (
    <Button variant="outline" {...props}>
      <img src={GoogleIcon} className="w-4 h-4 mr-2" />
      <span>구글 로그인</span>
    </Button>
  );
}

export default GoogleLoginBtn;
