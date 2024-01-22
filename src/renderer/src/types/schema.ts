export interface ListResponse<T> {
  total: number;
  hits: T[];
}

export interface BaseError {
  code: string;
  message: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  username?: string;
  gender?: number;
  image_url?: string;
  age?: number;
  phone_number?: string;
  refresh_token: string | null;
}

export interface IProfile
  extends Pick<User, "id" | "email" | "image_url" | "name" | "username"> {}

export type UserDTO = Omit<User, "id" | "refresh_token">;
