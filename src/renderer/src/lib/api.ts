import axios from "axios";
import { getToken, setToken } from "../stores/AuthStore";
import { ITokenResponse, refresh } from "./queries/auth";

let refreshPromise: Promise<ITokenResponse> | null = null;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !error.config.headers.refresh
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) refreshPromise = refresh();
        const { access_token } = await refreshPromise;
        if (!access_token) {
          return Promise.reject(error);
        }
        originalRequest.headers["authorization"] = `Bearer ${access_token}`;
        setToken(access_token);
        return api(originalRequest);
      } catch (e) {
        console.log(e);
      } finally {
        refreshPromise = null;
      }
    }
    return Promise.reject(error);
  },
);
