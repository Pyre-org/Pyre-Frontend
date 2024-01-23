import { useCallback, useState } from "react";
import RegisterForm from "./RegisterForm";
import { useSendEmailMutation } from "@renderer/lib/queries/email";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  RegisterSchemaType,
} from "@renderer/lib/schemas/RegisterSchema";
import EmailVerify from "./EmailVerify";
import { useRegisterMutation } from "@renderer/lib/queries/auth";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [step, setStep] = useState(0);
  const sendEmailMutation = useSendEmailMutation();
  const registerMutation = useRegisterMutation();
  const methods = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });
  const navigate = useNavigate();

  const handleFormSuccess = useCallback(() => {
    setStep(1);
    sendEmailMutation.mutate({ email: methods.getValues("email") });
  }, []);

  const handleRegister = useCallback((value) => {
    registerMutation.mutate(
      {
        ...methods.getValues(),
        authNum: value,
      },
      {
        onSuccess: () => {
          console.log("success");
          navigate("/");
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  }, []);

  return (
    <>
      {step === 0 && (
        <RegisterForm methods={methods} onNext={handleFormSuccess} />
      )}
      {step === 1 && (
        <EmailVerify
          email={methods.getValues("email")}
          onNext={handleRegister}
        />
      )}
    </>
  );
}

export default RegisterPage;
