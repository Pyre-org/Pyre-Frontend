import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import {
  BaseError,
  DetailedProfile,
  Feed,
  ListResponse,
  Room,
  Space,
} from "@renderer/types/schema";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "../querykeys";

const baseUrl = "/search";

export interface SearchQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export const searchUser = async (params: SearchQueryParams) => {
  const res = await api.get<ListResponse<DetailedProfile>>(`${baseUrl}/user`, {
    params,
  });
  return res.data;
};

export const useSearchUser = (
  params: SearchQueryParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<DetailedProfile>,
      AxiosError<BaseError>,
      ListResponse<DetailedProfile>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.user.list.search(params),
    queryFn: () => searchUser(params),
  });
};

export const searchFeed = async (params: SearchQueryParams) => {
  const res = await api.get<ListResponse<Feed>>(`${baseUrl}/feed`, {
    params,
  });
  return res.data;
};

export const useSearchFeed = (
  params: SearchQueryParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<Feed>,
      AxiosError<BaseError>,
      ListResponse<Feed>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.feed.list.search(params),
    queryFn: () => searchFeed(params),
  });
};

export const searchSpace = async (params: SearchQueryParams) => {
  const res = await api.get<ListResponse<Space>>(`${baseUrl}/space`, {
    params,
  });
  return res.data;
};

export const useSearchSpace = (
  params: SearchQueryParams,
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
    queryKey: QUERY_KEYS.space.list.search(params),
    queryFn: () => searchSpace(params),
  });
};

export const searchRoom = async (params: SearchQueryParams) => {
  const res = await api.get<ListResponse<Room>>(`${baseUrl}/room`, {
    params,
  });
  return res.data;
};

export const useSearchRoom = (
  params: SearchQueryParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<Room>,
      AxiosError<BaseError>,
      ListResponse<Room>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.list.search(params),
    queryFn: () => searchRoom(params),
  });
};
