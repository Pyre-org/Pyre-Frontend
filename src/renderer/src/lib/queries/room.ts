import {
  BaseError,
  ListResponse,
  Room,
  RoomBody,
  RoomRole,
  RoomWithSpace,
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

interface ChannelIdParams {
  channelId: string;
}

interface GetRoomsParams extends ChannelIdParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export const getRooms = async (params: GetRoomsParams) => {
  const { channelId, ...rest } = params;
  const res = await api.get<ListResponse<Room>>(
    `${baseUrl}/list/${channelId}`,
    { params: rest },
  );
  return res.data;
};

export const useGetRooms = (
  { channelId, keyword, page = 0, size = 10 }: GetRoomsParams,
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
    page,
    size,
  };

  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.list.public(params),
    queryFn: () => getRooms(params),
  });
};

export const getMyRooms = async (params: GetRoomsParams) => {
  const { channelId, ...rest } = params;
  const res = await api.get<ListResponse<Room>>(
    `${baseUrl}/my/list/${channelId}`,
    { params: rest },
  );
  return res.data;
};

export const useGetMyRooms = (
  { channelId, keyword }: GetRoomsParams,
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

export const getMyRoomsWithSpaces = async (params: ChannelIdParams) => {
  const channelId = params.channelId;
  const res = await api.get<ListResponse<RoomWithSpace>>(
    `${baseUrl}/my/${channelId}`,
  );
  return res.data;
};

export const useGetMyRoomsWithSpaces = (
  { channelId }: ChannelIdParams,
  options?: Omit<
    UseQueryOptions<
      ListResponse<RoomWithSpace>,
      AxiosError<BaseError>,
      ListResponse<RoomWithSpace>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.list.myWithSpaces(channelId),
    queryFn: () => getMyRoomsWithSpaces({ channelId }),
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
    queryKey: QUERY_KEYS.room.single(id).all,
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.room.single(variables.roomId).all,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const leaveRoom = async (roomId: string) => {
  const res = await api.post<string>(`${baseUrl}/leave/${roomId}`);
  return res.data;
};

export const useLeaveRoomMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: leaveRoom,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.room.single(variables).all,
      });
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

interface UpdateRoomBody extends Omit<RoomBody, "channelId"> {
  roomId: string;
}

export const updateRoom = async (data: UpdateRoomBody) => {
  const { roomId, ...rest } = data;
  const res = await api.put<string>(`${baseUrl}/update/${roomId}`, rest);
  return res.data;
};

export const useUpdateRoomMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, UpdateRoomBody>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updateRoom,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.room.single(variables.roomId).all,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const checkSubscribtion = async (roomId: string) => {
  const res = await api.get<boolean>(`${baseUrl}/isSubscribe/${roomId}`);
  return res.data;
};

export const useCheckSubscribtion = (
  roomId: string,
  options?: Omit<
    UseQueryOptions<boolean, AxiosError<BaseError>, boolean>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.single(roomId).sub,
    queryFn: () => checkSubscribtion(roomId),
  });
};

interface LocateRoomBody {
  from: string;
  to: string;
}

export const locateRoom = async (body: LocateRoomBody) => {
  const res = await api.patch<string>(`${baseUrl}/locate`, body);
  return res.data;
};

export const useLocateRoomMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, LocateRoomBody>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: locateRoom,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const deleteRoom = async (roomId: string) => {
  const res = await api.delete<string>(`${baseUrl}/delete/${roomId}`);
  return res.data;
};

export const useDeleteRoomMutation = (
  options?: UseMutationOptions<string, AxiosError<BaseError>, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteRoom,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const getRoomRole = async (roomId: string) => {
  const res = await api.get<RoomRole>(`${baseUrl}/role/${roomId}`);
  return res.data;
};

export const useGetRoomRole = (
  roomId: string,
  options?: Omit<
    UseQueryOptions<RoomRole, AxiosError<BaseError>, RoomRole>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.single(roomId).role,
    queryFn: () => getRoomRole(roomId),
  });
};

interface CreateInvitationBody {
  roomId: string;
  maxDays: number;
}

// returns invitation id
export const createInvitation = async (body: CreateInvitationBody) => {
  const res = await api.post<string>(`${baseUrl}/invitation`, body);
  return res.data;
};

export const useCreateInvitationMutation = (
  options?: UseMutationOptions<
    string,
    AxiosError<BaseError>,
    CreateInvitationBody
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: createInvitation,
  });
};

// returns room id of the invitation
interface AcceptInvitationResponse {
  id: string;
}

export const acceptInvitation = async (invitationId: string) => {
  const res = await api.post<AcceptInvitationResponse>(
    `${baseUrl}/invitation/accept`,
    {
      invitationId,
    },
  );
  return res.data;
};

export const useAcceptInvitationMutation = (
  options?: UseMutationOptions<
    AcceptInvitationResponse,
    AxiosError<BaseError>,
    string
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: acceptInvitation,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.list.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.room.single(data.id).all,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const getInvitationInfo = async (invitationId: string) => {
  const res = await api.get<Room>(`${baseUrl}/invitation/${invitationId}`);
  return res.data;
};

export const useGetInvitationInfo = (
  invitationId: string,
  options?: Omit<
    UseQueryOptions<Room, AxiosError<BaseError>, Room>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.invitation(invitationId),
    queryFn: () => getInvitationInfo(invitationId),
  });
};

interface MemberResponse {
  userId: string;
  nickname: string;
  profileImageUrl: string;
  role: RoomRole;
  isOwner: boolean;
}

export const getRoomMembers = async (roomId: string) => {
  const res = await api.get<ListResponse<MemberResponse>>(
    `${baseUrl}/members/${roomId}`,
  );
  return res.data;
};

export const useGetRoomMembers = (
  roomId: string,
  options?: Omit<
    UseQueryOptions<
      ListResponse<MemberResponse>,
      AxiosError<BaseError>,
      ListResponse<MemberResponse>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: QUERY_KEYS.room.single(roomId).members,
    queryFn: () => getRoomMembers(roomId),
  });
};

interface UpdateRoomRoleBody {
  userId: string;
  roomId: string;
  role: RoomRole;
}

export const updateRoomRole = async (body: UpdateRoomRoleBody) => {
  const res = await api.patch<string>(`${baseUrl}/role`, body);
  return res.data;
};

export const useUpdateRoomRoleMutation = (
  options?: UseMutationOptions<
    string,
    AxiosError<BaseError>,
    UpdateRoomRoleBody
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updateRoomRole,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.room.single(variables.roomId).members,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
