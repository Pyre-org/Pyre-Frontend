import { Button } from "@mantine/core";

function NaverLoginBtn() {
  return (
    <Button
      color="green"
      leftSection={<span className="text-white font-extrabold">N</span>}
    >
      네이버 로그인
    </Button>
  );
}

export default NaverLoginBtn;
