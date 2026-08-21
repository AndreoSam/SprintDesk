import type { AuthUser, LoginResponse } from "../types/auth";

const BASE_URL = "https://dummyjson.com";

export const loginUser = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 1,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 1,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to refresh session");
  }

  return response.json();
};

export const getCurrentUser = async (
  accessToken: string,
): Promise<AuthUser> => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch current user");
  }

  return response.json();
};
