import { api } from "../api";

const baseUrl = "/auth-service/oauth";

export const requestOAuth = async (authority: string) => {
  const res = await api.get<string>(`${baseUrl}/${authority}`);
  return res.data;
};

interface TokenResponse {
  access_token: string;
}

export const postOAuth = async (authority: string, code: string) => {
  const res = await api.post<TokenResponse>(`${baseUrl}/login/${authority}`, {
    code,
  });
  return res.data;
};
