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
  keyword?: string;
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
  keyword,
  orderByDesc = false,
}: GetChannelsParams) => {
  const params = {
    page,
    count,
    orderByDesc,
    keyword,
    sortBy,
    genre,
  };
  return useQuery({
    queryKey: QUERY_KEYS.channel.list.public(params),
    queryFn: () => getChannels(params),
  });
};

export const getChannel = async (id: string) => {
  const res = await api.get<Channel>(`${baseUrl}/get/${id}`);
  return res.data;
};

export const useGetChannel = (
  id: string,
  options?: Omit<
    UseQueryOptions<Channel, AxiosError<BaseError>, Channel>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.channel.single(id).all,
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
  id: string;
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

export const editChannel = async (id: string, body: ICreateChannelBody) => {
  const res = await api.put<Channel>(`${baseUrl}/edit/${id}`, body);
  return res.data;
};

export const useEditChannelMutation = (
  options?: UseMutationOptions<
    Channel,
    AxiosError<BaseError>,
    ICreateChannelBody & { id: string }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, ...rest }) => editChannel(id, rest),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.single(params[0].id).all,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list.all,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.waiting.list(),
      });
      options?.onSuccess?.(...params);
    },
  });
};

interface IApproveChannelBody {
  id: string;
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
        queryKey: QUERY_KEYS.channel.list.all,
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

export const deleteChannel = async (id: string) => {
  const res = await api.delete<IDeleteChannelResponse>(
    `${baseUrl}/delete/${id}`,
  );
  return res.data;
};

export const useDeleteChannelMutation = (
  options?: UseMutationOptions<
    IDeleteChannelResponse,
    AxiosError<BaseError>,
    string,
    unknown
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteChannel,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list.all,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.waiting.list(),
      });
      options?.onSuccess?.(...params);
    },
  });
};

interface GetMyChannelsParams {
  genre: string;
  keyword: string;
  sortBy: string;
  orderByDesc: boolean;
}

export const getMyChannels = async (params: Partial<GetMyChannelsParams>) => {
  const res = await api.get<ListResponse<Channel>>(`${baseUrl}/my/search`, {
    params,
  });
  return res.data;
};

export const useGetMyChannels = (
  { genre = "", keyword, sortBy, orderByDesc }: Partial<GetMyChannelsParams>,
  options?: UseQueryOptions<
    ListResponse<Channel>,
    AxiosError<BaseError>,
    ListResponse<Channel>
  >,
) => {
  const params = {
    genre,
    keyword,
    sortBy,
    orderByDesc,
  };

  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.channel.list.my(params),
    queryFn: () => getMyChannels(params),
  });
};

interface IJoinChannelResponse {
  channelId: string;
  joinDate: string;
  agreement: boolean;
}

export const joinChannel = async (id: string) => {
  const res = await api.post<IJoinChannelResponse>(`${baseUrl}/join`, {
    channelId: id,
    agreement: true,
  });
  return res.data;
};

export const useJoinChannelMutation = (
  options?: UseMutationOptions<
    IJoinChannelResponse,
    AxiosError<BaseError>,
    string
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: joinChannel,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.single(params[1]).all,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list.all,
      });
      options?.onSuccess?.(...params);
    },
  });
};

export const leaveChannel = async (id: string) => {
  const res = await api.delete<string>(`${baseUrl}/leave/${id}`);
  return res.data;
};

export const useLeaveChannelMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, string>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: leaveChannel,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.single(params[1]).all,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.channel.list.all,
      });
      options?.onSuccess?.(...params);
    },
  });
};

export const checkSubscription = async (channelId: string) => {
  const res = await api.get<boolean>(`${baseUrl}/isSubscribe/${channelId}`);
  return res.data;
};

export const useCheckSubscription = (
  channelId: string,
  options?: Omit<
    UseQueryOptions<boolean, AxiosError<BaseError>, boolean>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.channel.single(channelId).sub,
    queryFn: () => checkSubscription(channelId),
  });
};
