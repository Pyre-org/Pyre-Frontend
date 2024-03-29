import {
  InfiniteData,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api";
import { QUERY_KEYS } from "../querykeys";
import {
  BaseError,
  Feed,
  FeedBody,
  ListResponse,
} from "@renderer/types/schema";
import { AxiosError } from "axios";

const baseUrl = "/feed";

interface GetFeedsBaseParams {
  page?: number;
  size?: number;
}

interface GetFeedsParams extends GetFeedsBaseParams {
  spaceId: string;
}

export const getFeeds = async (data: GetFeedsParams) => {
  const { spaceId, ...params } = data;
  const res = await api.get<ListResponse<Feed>>(`${baseUrl}/list/${spaceId}`, {
    params,
  });
  return res.data;
};

export const useGetFeeds = (
  { spaceId, page = 0, size = 20 }: GetFeedsParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<Feed>,
      AxiosError<BaseError>,
      ListResponse<Feed>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const params = { spaceId, page, size };
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.feed.list.general(params),
    queryFn: () => getFeeds(params),
  });
};

export const useGetFeedsInfinite = ({ spaceId, size = 20 }: GetFeedsParams) => {
  const params = { spaceId, size };
  return useInfiniteQuery<
    ListResponse<Feed>,
    AxiosError<BaseError>,
    InfiniteData<ListResponse<Feed>>,
    QueryKey,
    number
  >({
    queryKey: QUERY_KEYS.feed.list.infinite(params),
    queryFn: ({ pageParam = 0 }) =>
      getFeeds({ spaceId, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.total;
      const current =
        Math.max(0, allPages.length - 1) * size + lastPage.hits.length;
      return current < total ? allPages.length : undefined;
    },
  });
};

export const getOthersFeeds = async (data: GetFeedsBaseParams) => {
  const res = await api.get<ListResponse<Feed>>(`${baseUrl}/other/list`, {
    params: data,
  });
  return res.data;
};

export const useGetOthersFeedsInfinite = ({
  size = 20,
}: GetFeedsBaseParams) => {
  const params = { size };
  return useInfiniteQuery<
    ListResponse<Feed>,
    AxiosError<BaseError>,
    InfiniteData<ListResponse<Feed>>,
    QueryKey,
    number
  >({
    queryKey: QUERY_KEYS.feed.list.othersInfinite(params),
    queryFn: ({ pageParam = 0 }) => getOthersFeeds({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.total;
      const current =
        Math.max(0, allPages.length - 1) * size + lastPage.hits.length;
      return current < total ? allPages.length : undefined;
    },
  });
};

const getMyFeeds = async (data: GetFeedsBaseParams) => {
  const res = await api.get<ListResponse<Feed>>(`${baseUrl}/my/list`, {
    params: data,
  });
  return res.data;
};

export const useGetMyFeedsInfinite = ({ size = 20 }: GetFeedsBaseParams) => {
  const params = { size };
  return useInfiniteQuery<
    ListResponse<Feed>,
    AxiosError<BaseError>,
    InfiniteData<ListResponse<Feed>>,
    QueryKey,
    number
  >({
    queryKey: QUERY_KEYS.feed.list.myInfinite(params),
    queryFn: ({ pageParam = 0 }) => getMyFeeds({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.total;
      const current =
        Math.max(0, allPages.length - 1) * size + lastPage.hits.length;
      return current < total ? allPages.length : undefined;
    },
  });
};

export const uploadFeed = async (body: FeedBody) => {
  const res = await api.post<string>(`${baseUrl}/upload`, body);
  return res.data;
};

export const useUploadFeedMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, FeedBody>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: uploadFeed,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed.list.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

interface UpdateFeedBody {
  feedId: string;
  title: string;
  description?: string;
}

export const updateFeed = async (body: UpdateFeedBody) => {
  const res = await api.patch<Feed>(`${baseUrl}/edit`, body);
  return res.data;
};

export const useUpdateFeedMutation = (
  options?: UseMutationOptions<Feed, AxiosError<BaseError>, UpdateFeedBody>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: updateFeed,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed.list.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.feed.single(variables.feedId).all,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const deleteFeed = async (feedId: string) => {
  const res = await api.delete<string>(`${baseUrl}/delete/${feedId}`);
  return res.data;
};

export const useDeleteFeedMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, string>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: deleteFeed,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed.list.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.feed.single(variables).all,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
