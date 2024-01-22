import axios from "axios";
import { getToken, setToken } from "../stores/authStore";
import { refresh } from "./queries/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["access_token"] = `Bearer ${token}`;
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
        const { access_token } = await refresh();
        if (!access_token) {
          return Promise.reject(error);
        }
        originalRequest.headers["access_token"] = `Bearer ${access_token}`;
        setToken(access_token);
        return api(originalRequest);
      } catch (e) {
        console.log(e);
      }
    }
    return Promise.reject(error);
  },
);
