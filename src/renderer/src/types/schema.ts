import { ROOM_ROLE_TYPES } from "@renderer/constants/room";
import { ROLE_TYPES } from "@renderer/constants/space";
import { CreateSpaceSchemaType } from "@renderer/lib/schemas/CreateSpaceSchema";
import { RoomCreateSchemaType } from "@renderer/lib/schemas/RoomCreateSchema";

export interface ListResponse<T> {
  total: number;
  hits: T[];
}

export interface PageParams {
  page: number;
  count: number;
  sortBy: string;
  orderByDesc: boolean;
}

export interface BaseError {
  status: number;
  divisionCode: string;
  resultMsg: string;
  errors: null;
  reason: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string;
  image_url: string;
  shortDescription: string;
  createDate: string;
  modifyDate: string;
  lastActive: string;
  refresh_token: string | null;
}

export interface IProfile
  extends Pick<User, "id" | "email" | "image_url" | "nickname"> {}

export type UserDTO = Omit<User, "id" | "refresh_token">;

export interface Channel {
  id: string;
  title: string;
  description: string;
  genre: string;
  rating: number;
  memberCounts: number;
  roomCounts: number;
  imageUrl: string;
  type: ChannelType;
  cAt: string;
  mAt?: string;
}

export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  OPEN = "OPEN",
}

export interface Room {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  memberCounts: number;
  spaceCounts: number;
  type: RoomType;
  cAt: string;
  mAt?: string;
}

export interface RoomWithSpace extends Room {
  spaces: ListResponse<Space>;
}

export interface RoomBody extends Omit<RoomCreateSchemaType, "imageUrl"> {
  imageUrl?: string;
  channelId: string;
}

export enum RoomType {
  ROOM_PUBLIC = "ROOM_PUBLIC",
  ROOM_PRIVATE = "ROOM_PRIVATE",
  ROOM_OPEN = "ROOM_OPEN",
  ROOM_GLOBAL = "ROOM_GLOBAL",
  ROOM_CAPTURE = "ROOM_CAPTURE",
}

export type RoomRole = (typeof ROOM_ROLE_TYPES)[number];

export interface Chat {
  id: string;
  user: User;
  room: Room;
  message: string;
  cAt: string;
  mAt: string;
}

export interface ScreenShot {
  id: string;
  user: User;
  uploadTimestamp: string;
  imageUrl: string;
  thumbnailUrl: string;
  visibility: string;
  likes: number;
}

export interface Feed {
  id: string;
  userId: string;
  nickname: string;
  spaceId: string;
  imageUrl: string;
  cAt: string;
}

export type SpaceRole = (typeof ROLE_TYPES)[number];

export interface Space extends SpaceBody {
  id: string;
  role: SpaceRole;
  prevSpaceId: string;
  nextSpaceId: string;
}

export interface SpaceBody
  extends Omit<Required<CreateSpaceSchemaType>, "role" | "description"> {
  roomId: string;
  description?: string;
}

export interface UpdateSpaceBody {
  title: string;
  description: string;
  role: SpaceRole;
  spaceId: string;
}

export interface ICaptureResponse {
  dataURL: string;
  width: number;
  height: number;
  name: string;
  path: string;
}
