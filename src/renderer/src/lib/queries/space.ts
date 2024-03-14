import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api";
import { QUERY_KEYS } from "../querykeys";
import {
  BaseError,
  ListResponse,
  Space,
  SpaceBody,
  UpdateSpaceBody,
} from "@renderer/types/schema";
import { AxiosError } from "axios";

const baseUrl = "/community/space";

interface GetSpacesParams {
  roomId: string;
}

export const getSpaces = async (params: GetSpacesParams) => {
  const res = await api.get<ListResponse<Space>>(`${baseUrl}/list`, { params });
  return res.data;
};

export const useGetSpaces = (
  params: GetSpacesParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<Space>,
      AxiosError<BaseError>,
      ListResponse<Space>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.space.list(params),
    queryFn: () => getSpaces(params),
  });
};

export const getSpace = async (spaceId: string) => {
  const res = await api.get<Space>(`${baseUrl}/info/${spaceId}`);
  return res.data;
};

export const useGetSpace = (
  spaceId: string,
  options?: Omit<
    UseQueryOptions<Space, AxiosError<BaseError>, Space>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.space.single(spaceId).all,
    queryFn: () => getSpace(spaceId),
  });
};

export const createSpace = async (body: SpaceBody) => {
  const res = await api.post(`${baseUrl}/create`, body);
  return res.data;
};

export const useCreateSpaceMutation = (
  options?: UseMutationOptions<Space, AxiosError<BaseError>, SpaceBody>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createSpace,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.space.list() });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

interface LocateSpaceBody {
  from: string;
  to: string;
}

export const locateSpace = async (body: LocateSpaceBody) => {
  const res = await api.patch<string>(`${baseUrl}/locate`, body);
  return res.data;
};

export const useLocateSpaceMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, LocateSpaceBody>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: locateSpace,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.space.list() });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const updateSpace = async (data: UpdateSpaceBody) => {
  const { spaceId, ...body } = data;
  const res = await api.put<string>(`${baseUrl}/update/${spaceId}`, body);
  return res.data;
};

export const useUpdateSpaceMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, UpdateSpaceBody>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updateSpace,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.space.single(variables.spaceId).all,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.space.list() });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const deleteSpace = async (spaceId: string) => {
  const res = await api.delete<string>(`${baseUrl}/delete/${spaceId}`);
  return res.data;
};

export const useDeleteSpaceMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteSpace,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.space.list() });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const canWrite = async (spaceId: string) => {
  const res = await api.get<boolean>(`${baseUrl}/canWrite/${spaceId}`);
  return res.data;
};

export const useCanWrite = (
  spaceId: string,
  options?: Omit<
    UseQueryOptions<boolean, AxiosError<BaseError>, boolean>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.space.single(spaceId).write,
    queryFn: () => canWrite(spaceId),
  });
};

export const getCaptureSpaceId = async (spaceId: string) => {
  const res = await api.get<string>(`${baseUrl}/getCapture/${spaceId}`);
  return res.data;
};

export const useGetCaptureSpaceId = (
  spaceId: string,
  options?: Omit<
    UseQueryOptions<string, AxiosError<BaseError>, string>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.space.capture,
    queryFn: () => getCaptureSpaceId(spaceId),
  });
};
