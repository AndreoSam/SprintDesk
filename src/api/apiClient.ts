import { refreshAccessToken } from "./authApi";
import { useAuthStore } from "../stores/authStore";

const BASE_URL = "https://dummyjson.com";

let refreshPromise: Promise<string> | null = null;

const getNewAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("sprintdesk-refresh-token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const tokens = await refreshAccessToken(refreshToken);

    localStorage.setItem("sprintdesk-refresh-token", tokens.refreshToken);

    useAuthStore.getState().setAccessToken(tokens.accessToken);

    return tokens.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const accessToken = useAuthStore.getState().accessToken;

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    const newAccessToken = await getNewAccessToken();

    headers.set("Authorization", `Bearer ${newAccessToken}`);

    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  } catch {
    useAuthStore.getState().logout();

    throw new Error("Your session has expired. Please login again.");
  }
};

export const resetRefreshPromiseForTests = () => {
  refreshPromise = null;
};
