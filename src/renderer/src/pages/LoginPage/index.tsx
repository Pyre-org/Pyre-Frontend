import Logo from "@renderer/components/Logo";
import classes from "./index.module.css";
import {
  Button,
  Center,
  Divider,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import NaverLoginBtn from "@renderer/components/NaverLoginBtn";
import GoogleLoginBtn from "@renderer/components/GoogleLoginBtn";

function LoginPage() {
  return (
    <form className={classes.Container}>
      <div className={classes.InnerContainer}>
        <Center>
          <Logo />
        </Center>
        <div className={classes.FormContainer}>
          <Stack w="100%">
            <TextInput label="이메일" placeholder="example@domain.com" />
            <TextInput
              label="비밀번호"
              placeholder="비밀번호"
              type="password"
            />
          </Stack>
          <Button type="submit" fullWidth>
            로그인
          </Button>
        </div>
        <Divider label="또는" />
        <Stack gap="xs">
          <NaverLoginBtn />
          <GoogleLoginBtn />
        </Stack>
        <Group justify="space-between">
          <Button variant="transparent" size="xs">
            비밀번호 찾기
          </Button>
          <Button variant="transparent" size="xs">
            회원가입
          </Button>
        </Group>
      </div>
    </form>
  );
}

export default LoginPage;
