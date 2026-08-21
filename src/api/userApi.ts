import type { AuthUser } from "../types/auth";
import { apiClient } from "./apiClient";

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient("/auth/me");

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
};
