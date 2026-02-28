import { AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
}

export interface Config extends AxiosRequestConfig {
  _retry?: boolean;
}
