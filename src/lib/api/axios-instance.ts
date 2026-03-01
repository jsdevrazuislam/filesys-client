import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for requests is no longer needed for token injection
// because we are using HttpOnly cookies automatically sent by the browser.

import { ApiError, Config } from "@/types/api";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as unknown as Config;
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";

    // If 401 and not already retrying
    if (status === 401 && !originalRequest._retry) {
      const isAuthRoute =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/logout") ||
        originalRequest.url?.includes("/auth/refresh");

      const hasSessionHint = Cookies.get("has_session") === "true";

      // Don't attempt refresh if:
      // 1. It's an auth route already (to avoid infinite loops)
      // 2. We don't have a session hint (user is likely already logged out)
      if (isAuthRoute || !hasSessionHint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        // On refresh failure, redirect to login if we have a session hint
        if (typeof window !== "undefined") {
          Cookies.remove("has_session", { path: "/" });
          Cookies.remove("user_role", { path: "/" });
          Cookies.remove("access_token", { path: "/" });
          Cookies.remove("refresh_token", { path: "/" });
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const normalizedError = {
      status,
      message,
      data: error.response?.data,
    };

    return Promise.reject(normalizedError);
  }
);
