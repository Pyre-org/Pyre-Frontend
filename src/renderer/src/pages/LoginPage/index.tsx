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
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NaverLoginBtn from "@renderer/components/NaverLoginBtn";
import GoogleLoginBtn from "@renderer/components/GoogleLoginBtn";
import {
  LoginSchema,
  LoginSchemaType,
} from "@renderer/lib/schemas/LoginSchema";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@renderer/lib/queries/auth";
import { notifications } from "@mantine/notifications";

function LoginPage() {
  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const onSubmit = useCallback<SubmitHandler<LoginSchemaType>>((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        console.log(error);
        notifications.show({
          title: "로그인에 실패했습니다.",
          message: "아이디와 비밀번호를 확인해주세요.",
          color: "red",
          autoClose: 1500,
        });
      },
    });
  }, []);

  const onError = useCallback<SubmitErrorHandler<LoginSchemaType>>((error) => {
    console.log(error);
  }, []);

  return (
    <form
      className={classes.Container}
      onSubmit={methods.handleSubmit(onSubmit, onError)}
    >
      <div className={classes.InnerContainer}>
        <Center>
          <Logo />
        </Center>
        <div className={classes.FormContainer}>
          <Stack w="100%">
            <TextInput
              label="이메일"
              placeholder="example@domain.com"
              {...methods.register("email")}
              error={methods.formState.errors.email?.message}
            />
            <TextInput
              label="비밀번호"
              placeholder="비밀번호"
              type="password"
              {...methods.register("password")}
              error={methods.formState.errors.password?.message}
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
          <Link to="/register">
            <Button variant="transparent" size="xs">
              회원가입
            </Button>
          </Link>
        </Group>
      </div>
    </form>
  );
}

export default LoginPage;
