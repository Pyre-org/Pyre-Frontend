import Logo from "@renderer/components/Logo";
import classes from "./index.module.css";
import { SubmitErrorHandler, UseFormReturn } from "react-hook-form";
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

interface RegisterFormProps {
  methods: UseFormReturn<RegisterSchemaType>;
  onNext: () => void;
}

function RegisterForm({ methods, onNext }: RegisterFormProps) {
  const [showPwd, { toggle: togglePwd }] = useDisclosure(false);

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
                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder="example@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

                <FormField
                  control={methods.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>닉네임</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="두 글자 이상 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
