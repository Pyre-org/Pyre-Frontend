import { api } from "../api";
import {
  BaseError,
  DetailedProfile,
  FeedSettings,
  IProfile,
  ProfileSettingBody,
} from "../../types/schema";
import { AxiosError } from "axios";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "../querykeys";
import { useAuthStoreActions } from "../../stores/authStore";

const baseUrl = "/auth-service/user";

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ITokenResponse {
  access_token: string;
}

export const login = async (body: ILoginBody) => {
  const res = await api.post<ITokenResponse>(`${baseUrl}/login`, body);
  return res.data;
};

export const useLoginMutation = (
  options?: UseMutationOptions<
    ITokenResponse,
    AxiosError<BaseError>,
    ILoginBody
  >,
) => {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStoreActions();
  return useMutation<ITokenResponse, AxiosError<BaseError>, ILoginBody>({
    ...options,
    mutationFn: login,
    onSuccess: (...params) => {
      setToken(params[0].access_token);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me.all });
      options?.onSuccess?.(...params);
    },
  });
};

export interface IRegisterBody {
  email: string;
  password: string;
  nickname: string;
  agreement1: boolean;
  agreement2: boolean;
  authNum: string;
}

export const register = async (body: IRegisterBody) => {
  const res = await api.post<ITokenResponse>(`${baseUrl}/register`, body);
  return res.data;
};

export const useRegisterMutation = (
  options?: UseMutationOptions<
    ITokenResponse,
    AxiosError<BaseError>,
    IRegisterBody
  >,
) => {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStoreActions();
  return useMutation<ITokenResponse, AxiosError<BaseError>, IRegisterBody>({
    ...options,
    mutationFn: register,
    onSuccess: (...params) => {
      setToken(params[0].access_token);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me.all });
      options?.onSuccess?.(...params);
    },
  });
};

export const logout = async () => {
  const res = await api.post(`${baseUrl}/logout`);
  return res.data;
};

export const useLogoutMutation = (
  options?: UseMutationOptions<void, AxiosError<BaseError>, void>,
) => {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStoreActions();
  return useMutation<void, AxiosError<BaseError>, void>({
    ...options,
    mutationFn: logout,
    onSuccess: (...params) => {
      setToken(null);
      queryClient.setQueryData(QUERY_KEYS.user.me.all, null);
      options?.onSuccess?.(...params);
    },
  });
};

export const refresh = async () => {
  const res = await api.post<ITokenResponse>(`${baseUrl}/refresh`, null, {
    headers: { refresh: "true" },
  });
  return res.data;
};

export const useRefreshMutation = (
  options?: UseMutationOptions<ITokenResponse, AxiosError<BaseError>, void>,
) => {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStoreActions();
  return useMutation<ITokenResponse, AxiosError<BaseError>, void>({
    ...options,
    mutationFn: refresh,
    onSuccess: (...params) => {
      setToken(params[0].access_token);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me.all });
      options?.onSuccess?.(...params);
    },
  });
};

export const me = async () => {
  const res = await api.get(`${baseUrl}/me`);
  return res.data;
};

export const useMyUser = () => {
  return useQuery<IProfile, AxiosError<BaseError>>({
    queryKey: QUERY_KEYS.user.me.all,
    queryFn: me,
  });
};

export const useSetTokenMutation = (
  options?: UseMutationOptions<void, AxiosError<BaseError>, string>,
) => {
  const { setToken } = useAuthStoreActions();
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<BaseError>, string>({
    ...options,
    mutationFn: (token) => {
      setToken(token);
      return Promise.resolve();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export interface ICheckResponse {
  present: boolean;
  message: string;
}

export const checkEmail = async (email: string) => {
  const res = await api.post<ICheckResponse>(`${baseUrl}/check/email`, {
    email,
  });
  return res.data;
};

export const checkNickname = async (nickname: string) => {
  const res = await api.post<ICheckResponse>(`${baseUrl}/check/nickname`, {
    nickname,
  });
  return res.data;
};

export const editProfile = async (body: ProfileSettingBody) => {
  const res = await api.put(`${baseUrl}/profile/my/edit`, body);
  return res.data;
};

export const useEditProfileMutation = (
  options?: UseMutationOptions<void, AxiosError<BaseError>, ProfileSettingBody>,
) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<BaseError>, ProfileSettingBody>({
    ...options,
    mutationFn: editProfile,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.me.all });
      options?.onSuccess?.(...params);
    },
  });
};

export const getFeedSettings = async () => {
  const res = await api.get<FeedSettings>(`${baseUrl}/feedSpace`);
  return res.data;
};

export const useGetFeedSettings = (
  options?: Omit<
    UseQueryOptions<FeedSettings, AxiosError<BaseError>, FeedSettings>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<FeedSettings, AxiosError<BaseError>>({
    ...options,
    queryKey: QUERY_KEYS.user.me.feed,
    queryFn: getFeedSettings,
  });
};

export const getMyProfile = async () => {
  const res = await api.get<DetailedProfile>(`${baseUrl}/profile/my`);
  return res.data;
};

export const useGetMyProfile = (
  options?: Omit<
    UseQueryOptions<DetailedProfile, AxiosError<BaseError>, DetailedProfile>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<DetailedProfile, AxiosError<BaseError>>({
    ...options,
    queryKey: QUERY_KEYS.user.me.profile,
    queryFn: getMyProfile,
  });
};
