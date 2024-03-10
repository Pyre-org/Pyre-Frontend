import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { QUERY_KEYS } from "../querykeys";
import { BaseError, ListResponse, Space } from "@renderer/types/schema";
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
