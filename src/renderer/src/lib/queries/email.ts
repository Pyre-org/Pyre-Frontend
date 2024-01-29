import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { AxiosError } from "axios";
import { BaseError } from "@renderer/types/schema";

const baseUrl = "/auth-service/email";

interface ISendEmailBody {
  email: string;
}

export const sendEmail = async (body: ISendEmailBody) => {
  const res = await api.post<string>(`${baseUrl}/send/mail`, body);
  return res.data;
};

export const useSendEmailMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, ISendEmailBody>,
) => {
  return useMutation<string, AxiosError<BaseError>, ISendEmailBody>({
    ...options,
    mutationFn: sendEmail,
  });
};

interface IVerifyEmailBody {
  email: string;
  authNum: string;
}

export const verifyEmail = async (body: IVerifyEmailBody) => {
  const res = await api.post<string>(`${baseUrl}/auth/check`, body);
  return res.data;
};

export const useVerifyEmailMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, IVerifyEmailBody>,
) => {
  return useMutation<string, AxiosError<BaseError>, IVerifyEmailBody>({
    ...options,
    mutationFn: verifyEmail,
  });
};
