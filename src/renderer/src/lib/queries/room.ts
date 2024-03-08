import { BaseError, ListResponse, Room } from "@renderer/types/schema";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "../querykeys";
import { api } from "../api";

const baseUrl = "/community/room";

interface GetRoomsParams {
  channelId: string;
  keyword: string;
}

export const getRooms = async (params: Partial<GetRoomsParams>) => {
  const { channelId, ...rest } = params;
  const res = await api.get<ListResponse<Room>>(
    `${baseUrl}/list/${channelId}`,
    { params: rest },
  );
  return res.data;
};

export const useGetRooms = (
  { channelId, keyword }: Partial<GetRoomsParams>,
  options?: Omit<
    UseQueryOptions<
      ListResponse<Room>,
      AxiosError<BaseError>,
      ListResponse<Room>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const params = {
    channelId,
    keyword,
  };

  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.list.public(params),
    queryFn: () => getRooms(params),
  });
};

export const getMyRooms = async (params: Partial<GetRoomsParams>) => {
  const { channelId, ...rest } = params;
  const res = await api.get<ListResponse<Room>>(
    `${baseUrl}/my/list/${channelId}`,
    { params: rest },
  );
  return res.data;
};

export const useGetMyRooms = (
  { channelId, keyword }: Partial<GetRoomsParams>,
  options?: Omit<
    UseQueryOptions<
      ListResponse<Room>,
      AxiosError<BaseError>,
      ListResponse<Room>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const params = {
    channelId,
    keyword,
  };

  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.list.my(params),
    queryFn: () => getMyRooms(params),
  });
};

export const getRoom = async (id: string) => {
  const res = await api.get<Room>(`${baseUrl}/${id}`);
  return res.data;
};

export const useGetRoom = (
  id: string,
  options?: Omit<
    UseQueryOptions<Room, AxiosError<BaseError>, Room>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.single(id),
    queryFn: () => getRoom(id),
  });
};

export const joinRoom = async (id: string) => {
  const res = await api.post<Room>(`${baseUrl}/${id}/join`);
  return res.data;
};
