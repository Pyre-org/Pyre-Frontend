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

// export interface BaseError {
//   code: string;
//   message: string;
// }
export type BaseError = string;

export interface User {
  id: number;
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
  id: number;
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
  id: number;
  title: string;
  description: string;
  imageurl: string;
  type: RoomType;
  cAt: string;
  mAt: string;
}

export enum RoomType {
  ROOM_PUBLIC = "ROOM_PUBLIC",
  ROOM_PRIVATE = "ROOM_PRIVATE",
  ROOM_OPEN = "ROOM_OPEN",
  ROOM_GLOBAL = "ROOM_GLOBAL",
  ROOM_CAPTURE = "ROOM_CAPTURE",
}

export interface Chat {
  id: number;
  user: User;
  room: Room;
  message: string;
  cAt: string;
  mAt: string;
}

export interface ScreenShot {
  id: number;
  user: User;
  uploadTimestamp: string;
  imageUrl: string;
  thumbnailUrl: string;
  visibility: string;
  likes: number;
}

export interface Feed {
  id: number;
  user: User;
  description: string;
  screenshots: ScreenShot[];
  tags: string[];
  visibility: string;
  likes: number;
  views: number;
  room_id: number;
}
