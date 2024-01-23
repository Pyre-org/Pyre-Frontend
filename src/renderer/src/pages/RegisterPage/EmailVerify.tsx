import { Button, Center, Group, PinInput, Stack, Text } from "@mantine/core";
import classes from "./index.module.css";
import Logo from "@renderer/components/Logo";
import { useEffect, useState } from "react";
import {
  useSendEmailMutation,
  useVerifyEmailMutation,
} from "@renderer/lib/queries/email";
import moment from "moment";

interface EmailVerifyProps {
  email: string;
  onNext: (authNum: string) => void;
}

function EmailVerify({ email, onNext }: EmailVerifyProps) {
  const [value, setValue] = useState("");
  const sendEmailMutation = useSendEmailMutation();
  const verifyEmailMutation = useVerifyEmailMutation();
  const [timer, setTimer] = useState(300000);
  const [error, setError] = useState("");

  const handleResend = () => {
    sendEmailMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setTimer(300000);
        },
        onError: (error) => {
          console.log(error);
          setError("인증 코드 전송에 실패했습니다.");
        },
      },
    );
  };

  const handleVerify = () => {
    verifyEmailMutation.mutate(
      { email, authNum: value },
      {
        onSuccess: () => {
          onNext(value);
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setError("인증 시간이 만료되었습니다. 이메일을 재전송해주세요.");
    }
  }, [timer]);

  return (
    <Center className={classes.Container}>
      <Logo />
      <Text fz="lg" fw="bold">
        이메일 인증 코드를 입력해주세요
      </Text>
      <Stack align="center" gap="2rem">
        <Stack align="center">
          <Text fz="md">{moment(timer).format("mm:ss")}</Text>
          <Text fz="md">{email}으로 6자리 코드를 전송했습니다.</Text>
          <PinInput
            type="number"
            length={6}
            value={value}
            onChange={setValue}
            error={!!error}
          />
          {error && (
            <Text fz="sm" c="red">
              {error}
            </Text>
          )}
          <Button onClick={handleVerify}>인증하기</Button>
        </Stack>
        <Group gap="xs">
          <Text>이메일 전송에 문제가 있나요?</Text>
          <Button variant="subtle" size="compact-md" onClick={handleResend}>
            재전송
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default EmailVerify;
