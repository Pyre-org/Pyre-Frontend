import { cn } from "@renderer/lib/utils";
import { Button, ButtonProps } from "../ui/button";

function NaverLoginBtn(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-green-500 hover:bg-green-600/90 text-white",
        props.className,
      )}
    >
      <span className="text-white font-extrabold mr-2">N</span>
      <span>네이버 로그인</span>
    </Button>
  );
}

export default NaverLoginBtn;
