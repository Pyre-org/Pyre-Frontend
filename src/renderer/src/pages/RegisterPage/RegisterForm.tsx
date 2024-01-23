import Logo from "@renderer/components/Logo";
import classes from "./index.module.css";
import {
  Button,
  Center,
  Checkbox,
  Stack,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { RegisterSchemaType } from "@renderer/lib/schemas/RegisterSchema";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useDisclosure } from "@mantine/hooks";
import { useSendEmailMutation } from "@renderer/lib/queries/email";

interface RegisterFormProps {
  methods: UseFormReturn<RegisterSchemaType>;
  onNext: () => void;
}

function RegisterForm({ methods, onNext }: RegisterFormProps) {
  const sendEmailMutation = useSendEmailMutation();
  const [showPwd, { toggle: togglePwd }] = useDisclosure(false);

  const onSubmit = useCallback<SubmitHandler<RegisterSchemaType>>((data) => {
    sendEmailMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          onNext();
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
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
            <Checkbox
              label="[필수] 서비스 이용자 약관 동의"
              {...methods.register("agreement1")}
              error={methods.formState.errors.agreement1?.message}
            />
            <Checkbox
              label="[선택] 개인정보 수집 및 이용 동의"
              {...methods.register("agreement2")}
              error={methods.formState.errors.agreement2?.message}
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

export default RegisterForm;
