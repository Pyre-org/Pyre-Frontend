import {
  BaseError,
  ListResponse,
  Room,
  RoomBody,
} from "@renderer/types/schema";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  const res = await api.get<Room>(`${baseUrl}/get/${id}`);
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

interface JoinRoomBody {
  roomId: string;
  channelId: string;
}

interface JoinRoomResponse {
  id: string;
}

export const joinRoom = async (data: JoinRoomBody) => {
  const { roomId, ...body } = data;
  const res = await api.post<JoinRoomResponse>(
    `${baseUrl}/join/${roomId}`,
    body,
  );
  return res.data;
};

export const useJoinRoomMutation = (
  options?: UseMutationOptions<
    JoinRoomResponse,
    AxiosError<BaseError>,
    JoinRoomBody
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: joinRoom,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

interface CreateRoomResponse {
  id: string;
  title: string;
}

export const createRoom = async (data: RoomBody) => {
  const res = await api.post<CreateRoomResponse>(`${baseUrl}/create`, data);
  return res.data;
};

export const useCreateRoomMutation = (
  options?: UseMutationOptions<
    CreateRoomResponse,
    AxiosError<BaseError>,
    RoomBody
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createRoom,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
