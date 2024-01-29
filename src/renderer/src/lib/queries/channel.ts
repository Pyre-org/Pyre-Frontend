import {
  BaseError,
  Channel,
  ListResponse,
  PageParams,
} from "../../types/schema";
import { api } from "../api";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "../querykeys";
import { AxiosError } from "axios";

const baseUrl = "/community/channel";

interface GetChannelsParams extends Partial<PageParams> {
  genre?: string;
}

export const getChannels = async (params: GetChannelsParams) => {
  const res = await api.get<ListResponse<Channel>>(`${baseUrl}/list`, {
    params,
  });
  return res.data;
};

export const useGetChannels = ({
  genre,
  page = 0,
  count = 10,
  sortBy,
  orderByDesc = false,
}: GetChannelsParams) => {
  const params = {
    page,
    count,
    orderByDesc,
    sortBy,
    genre,
  };
  return useQuery({
    queryKey: QUERY_KEYS.channel.list(params),
    queryFn: () => getChannels(params),
  });
};

export const getChannel = async (id: number) => {
  const res = await api.get<Channel>(`${baseUrl}/get/${id}`);
  return res.data;
};

export const useGetChannel = (
  id: number,
  options?: Omit<
    UseQueryOptions<Channel, AxiosError<BaseError>, Channel>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.channel.single(id),
    queryFn: () => getChannel(id),
  });
};

interface ICreateChannelBody {
  title: string;
  description: string;
  genre: string;
  imageUrl: string;
}

interface ICreateChannelResponse {
  id: number;
  title: string;
}

export const createChannel = async (body: ICreateChannelBody) => {
  const res = await api.post<ICreateChannelResponse>(`${baseUrl}/create`, body);
  return res.data;
};

export const useCreateChannelMutation = (
  options?: UseMutationOptions<
    ICreateChannelResponse,
    AxiosError<BaseError>,
    ICreateChannelBody
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ICreateChannelResponse,
    AxiosError<BaseError>,
    ICreateChannelBody
  >({
    ...options,
    mutationFn: createChannel,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.waiting.list(),
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

interface IGetGenresParams {
  name?: string;
}

export const getGenres = async (params?: IGetGenresParams) => {
  const res = await api.get<ListResponse<string>>(`${baseUrl}/genres`, {
    params,
  });
  return res.data;
};

export const useGetGenres = (
  params?: IGetGenresParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<string>,
      AxiosError<BaseError>,
      ListResponse<string>,
      QueryKey[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.channel.genre.list(params),
    queryFn: () => getGenres(params),
    ...options,
  });
};

export const getWaitingChannels = async () => {
  const res = await api.get<ListResponse<Channel>>(`${baseUrl}/approval/list`);
  return res.data;
};

export const useGetWaitingChannels = () => {
  return useQuery({
    queryKey: QUERY_KEYS.channel.waiting.list(),
    queryFn: getWaitingChannels,
  });
};

export const editChannel = async (id: number, body: ICreateChannelBody) => {
  const res = await api.put<Channel>(`${baseUrl}/edit/${id}`, body);
  return res.data;
};

export const useEditChannelMutation = (
  options?: UseMutationOptions<
    Channel,
    AxiosError<BaseError>,
    ICreateChannelBody & { id: number }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, ...rest }) => editChannel(id, rest),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.single(params[0].id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.waiting.list(),
      });
      options?.onSuccess?.(...params);
    },
  });
};

interface IApproveChannelBody {
  id: number;
  status: "ALLOW" | "DENY" | "CHECKING";
}

export const approveChannel = async (body: IApproveChannelBody) => {
  const { id, ...rest } = body;
  const res = await api.patch<string>(`${baseUrl}/approval/${id}`, rest);
  return res.data;
};

export const useApproveChannelMutation = (
  options?: UseMutationOptions<
    string,
    AxiosError<BaseError>,
    IApproveChannelBody,
    unknown
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: approveChannel,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.waiting.list(),
      });
      options?.onSuccess?.(...params);
    },
  });
};

interface IDeleteChannelResponse {
  status: string;
}

export const deleteChannel = async (id: number) => {
  const res = await api.delete<IDeleteChannelResponse>(
    `${baseUrl}/delete/${id}`,
  );
  return res.data;
};

export const useDeleteChannelMutation = (
  options?: UseMutationOptions<
    IDeleteChannelResponse,
    AxiosError<BaseError>,
    number,
    unknown
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteChannel,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.waiting.list(),
      });
      options?.onSuccess?.(...params);
    },
  });
};