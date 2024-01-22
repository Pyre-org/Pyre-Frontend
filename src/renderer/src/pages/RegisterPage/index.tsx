import Logo from "@renderer/components/Logo";
import classes from "./index.module.css";
import {
  Button,
  Center,
  Stack,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  RegisterSchemaType,
} from "@renderer/lib/schemas/RegisterSchema";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useDisclosure } from "@mantine/hooks";
import { useRegisterMutation } from "@renderer/lib/queries/auth";

function RegisterPage() {
  const methods = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [showPwd, { toggle: togglePwd }] = useDisclosure(false);

  const onSubmit = useCallback<SubmitHandler<RegisterSchemaType>>((data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        alert("회원가입이 완료되었습니다.");
        navigate("/home");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }, []);

  const onError = useCallback<SubmitErrorHandler<RegisterSchemaType>>(
    (error) => {
      console.log(error);
    },
    [],
  );

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
              type={showPwd ? "text" : "password"}
              rightSection={
                <UnstyledButton onClick={togglePwd}>
                  {!showPwd ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </UnstyledButton>
              }
              {...methods.register("password")}
              error={methods.formState.errors.password?.message}
            />
            <TextInput
              label="닉네임"
              placeholder="두 글자 이상 입력해주세요"
              {...methods.register("nickname")}
              error={methods.formState.errors.nickname?.message}
            />
          </Stack>
          <Button type="submit" fullWidth>
            회원가입
          </Button>
        </div>
        <div className="text-xs">
          이미 계정이 있으신가요?{" "}
          <Link to="/login">
            <Button variant="transparent" size="xs">
              로그인
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}

export default RegisterPage;
