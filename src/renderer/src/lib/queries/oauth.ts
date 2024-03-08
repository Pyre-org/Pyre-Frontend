import { api } from "../api";

const baseUrl = "/auth-service/oauth";

export const getOAuthRequestUrl = (authority: string) => {
  return `${import.meta.env.VITE_API_URL}/auth-service/oauth/${authority}`;
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
