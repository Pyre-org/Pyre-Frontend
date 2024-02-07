import classes from "./index.module.css";
import Logo from "@renderer/components/common/Logo";
import { useEffect, useState } from "react";
import {
  useSendEmailMutation,
  useVerifyEmailMutation,
} from "@renderer/lib/queries/email";
import moment from "moment";
import { Button } from "@renderer/components/ui/button";
import PinField from "react-pin-field";

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
      { email, authNum: value.toLowerCase() },
      {
        onSuccess: () => {
          onNext(value);
        },
        onError: (error) => {
          console.log(error);
          setError("인증 코드가 일치하지 않거나 인증 시간이 만료되었습니다.");
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
    <div className={classes.Container}>
      <Logo />
      <h2 className="font-bold text-lg">이메일 인증 코드를 입력해주세요</h2>
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <p>{moment(timer).format("mm:ss")}</p>
          <p>{email}으로 6자리 코드를 전송했습니다.</p>
          <div className="grid auto-cols-max grid-flow-col justify-center">
            <PinField
              length={6}
              format={(c) => c.toUpperCase()}
              onChange={setValue}
              className="first:rounded-l-lg last:rounded-r-lg border border-background h-12 text-2xl text-center w-12 bg-accent"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            onClick={handleVerify}
            fullWidth
            disabled={verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? "인증 중입니다..." : "인증하기"}
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <p>이메일 전송에 문제가 있나요?</p>
          <Button
            variant="link"
            size="sm"
            onClick={handleResend}
            disabled={sendEmailMutation.isPending}
          >
            {sendEmailMutation.isPending ? "재전송 중..." : "재전송"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerify;
