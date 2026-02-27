import axios, { AxiosError } from "axios";

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

import { ApiError } from "@/types/api";

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";

    const normalizedError = {
      status,
      message,
      data: error.response?.data,
    };

    return Promise.reject(normalizedError);
  }
);
