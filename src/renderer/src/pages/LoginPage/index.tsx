import Logo from "@renderer/components/common/Logo";
import classes from "./index.module.css";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NaverLoginBtn from "@renderer/components/common/NaverLoginBtn";
import GoogleLoginBtn from "@renderer/components/common/GoogleLoginBtn";
import {
  LoginSchema,
  LoginSchemaType,
} from "@renderer/lib/schemas/LoginSchema";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@renderer/lib/queries/auth";
import { cn } from "@renderer/lib/utils";
import { Button } from "@renderer/components/ui/button";
import { Separator } from "@renderer/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import { Input } from "@renderer/components/ui/input";
import { toast } from "@renderer/components/ui/use-toast";

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
        toast({
          title: "로그인에 실패했습니다.",
          description: error.response?.data.reason,
          color: "red",
          duration: 1500,
        });
      },
    });
  }, []);

  const onError = useCallback<SubmitErrorHandler<LoginSchemaType>>((error) => {
    console.log(error);
  }, []);

  return (
    <Form {...methods}>
      <form
        className={cn(classes.Container)}
        onSubmit={methods.handleSubmit(onSubmit, onError)}
      >
        <div className={classes.InnerContainer}>
          <div className="flex w-full justify-center">
            <Logo />
          </div>
          <div className={classes.FormContainer}>
            <div className="w-full flex flex-col gap-4">
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
                      <Input
                        type="password"
                        placeholder="비밀번호"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-col gap-2">
            <NaverLoginBtn />
            <GoogleLoginBtn />
          </div>
          <div className="flex items-center justify-between">
            <Button variant="link" size="sm">
              비밀번호 찾기
            </Button>
            <Link to="/register">
              <Button variant="link" size="sm">
                회원가입
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default LoginPage;
