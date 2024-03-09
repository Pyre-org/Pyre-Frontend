import Logo from "@renderer/components/common/Logo";
import classes from "./index.module.css";
import { SubmitErrorHandler, UseFormReturn, useWatch } from "react-hook-form";
import { RegisterSchemaType } from "@renderer/lib/schemas/RegisterSchema";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Checkbox } from "@renderer/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import FormInput from "@renderer/components/form/FormInput";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "@renderer/lib/utils";

interface RegisterFormProps {
  methods: UseFormReturn<RegisterSchemaType>;
  onNext: () => void;
}

function RegisterForm({ methods, onNext }: RegisterFormProps) {
  const [showPwd, { toggle: togglePwd }] = useDisclosure(false);
  const pwd = useWatch({ control: methods.control, name: "password" }) ?? "";

  const onError = useCallback<SubmitErrorHandler<RegisterSchemaType>>(
    (error) => {
      console.log(error);
    },
    [],
  );

  return (
    <Form {...methods}>
      <form
        className={classes.Container}
        onSubmit={methods.handleSubmit(onNext, onError)}
      >
        <div className={classes.InnerContainer}>
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className={classes.FormContainer}>
            <div className="w-full flex flex-col">
              <div className="flex flex-col gap-4">
                <FormInput
                  control={methods.control}
                  name="email"
                  label="이메일"
                  inputProps={{ placeholder: "example@domain.com" }}
                />

                <FormField
                  control={methods.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPwd ? "text" : "password"}
                            placeholder="비밀번호"
                            className="pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            className="rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"
                            size="icon"
                            variant="ghost"
                            onClick={togglePwd}
                          >
                            {showPwd ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mb-4 flex gap-2 items-center">
                  <PasswordIndicator
                    value={pwd}
                    regex={/.{8,}/}
                    label="8자 이상"
                  />
                  <PasswordIndicator
                    value={pwd}
                    regex={/[a-z]/}
                    label="영어 소문자"
                  />
                  <PasswordIndicator
                    value={pwd}
                    regex={/[A-Z]/}
                    label="영어 대문자"
                  />
                  <PasswordIndicator value={pwd} regex={/\d/} label="숫자" />
                </div>

                <FormInput
                  control={methods.control}
                  name="nickname"
                  label="닉네임"
                  inputProps={{ placeholder: "두 글자 이상 입력해주세요" }}
                />
              </div>

              <FormField
                control={methods.control}
                name="agreement1"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormLabel className="cursor-pointer text-muted-foreground">
                        [필수] 서비스 이용자 약관 동의
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          ref={field.ref}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="agreement2"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                      <FormLabel className="cursor-pointer text-muted-foreground">
                        [선택] 개인정보 수집 및 이용 동의
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          ref={field.ref}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" fullWidth>
              회원가입
            </Button>
          </div>
          <div className="text-xs">
            이미 계정이 있으신가요?{" "}
            <Button variant="link" size="sm" asChild>
              <Link to="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;

interface PasswordIndicatorProps {
  value: string;
  regex: RegExp;
  label: string;
}

export function PasswordIndicator({
  value,
  regex,
  label,
}: PasswordIndicatorProps) {
  const isMatch = regex.test(value);
  return (
    <div className="flex gap-1 items-center">
      <CheckCircleIcon
        className={`w-4 h-4 ${isMatch ? "text-primary" : "text-muted-foreground"}`}
      />
      <div
        className={cn(
          !isMatch ? "text-muted-foreground" : "text-primary",
          "text-xs",
        )}
      >
        {label}
      </div>
    </div>
  );
}
