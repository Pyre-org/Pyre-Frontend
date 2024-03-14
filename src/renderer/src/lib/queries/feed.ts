import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api";
import { QUERY_KEYS } from "../querykeys";
import { BaseError, Feed, ListResponse } from "@renderer/types/schema";
import { AxiosError } from "axios";

const baseUrl = "/feed";

interface GetFeedsParams {
  spaceId: string;
  page?: number;
  size?: number;
}

export const getFeeds = async (data: GetFeedsParams) => {
  const { spaceId, ...params } = data;
  const res = await api.get(`${baseUrl}/list/${spaceId}`, { params });
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
    queryKey: QUERY_KEYS.feed.list(params),
    queryFn: () => getFeeds(params),
  });
};

interface UploadFeedParams {
  spaceId: string;
  url: string;
}

export const uploadFeed = async (body: UploadFeedParams) => {
  const res = await api.post<string>(`${baseUrl}/upload`, body);
  return res.data;
};

export const useUploadFeedMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, UploadFeedParams>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: uploadFeed,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed.list() });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
