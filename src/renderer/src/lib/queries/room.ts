import { BaseError, ListResponse, Room } from "@renderer/types/schema";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "../querykeys";
import { api } from "../api";

const baseUrl = "/community/room";

export const getRooms = async (id: string) => {
  const res = await api.get<ListResponse<Room>>(`${baseUrl}/my/${id}`);
  return res.data;
};

export const useGetRooms = (
  id: string,
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
    queryKey: QUERY_KEYS.room.list.public(id),
    queryFn: () => getRooms(id),
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
