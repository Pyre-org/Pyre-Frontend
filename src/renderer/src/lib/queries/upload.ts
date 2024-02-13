import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { AxiosError } from "axios";
import { BaseError } from "@renderer/types/schema";

const baseUrl = "/auth-service/s3";

export const uploadFileToS3 = async (file: File) => {
  const formData = new FormData();
  formData.append("multipartFile", file);
  const res = await api.post<string>(`${baseUrl}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const useUploadFileToS3Mutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, File>,
) => {
  return useMutation<string, AxiosError<BaseError>, File>({
    ...options,
    mutationFn: uploadFileToS3,
  });
};
