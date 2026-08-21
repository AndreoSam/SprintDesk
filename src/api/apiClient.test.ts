import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient, resetRefreshPromiseForTests } from "./apiClient";

import { useAuthStore } from "../stores/authStore";

import * as authApi from "./authApi";

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    localStorage.clear();

    resetRefreshPromiseForTests();

    useAuthStore.setState({
      user: null,
      accessToken: "expired-token",
      isAuthenticated: true,
      isInitializing: false,
    });

    localStorage.setItem("sprintdesk-refresh-token", "refresh-token");
  });

  it("refreshes token and retries after 401", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock
      .mockResolvedValueOnce(
        new Response("", {
          status: 401,
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 1,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

    vi.spyOn(authApi, "refreshAccessToken").mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    const response = await apiClient("/auth/me");

    expect(response.status).toBe(200);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(useAuthStore.getState().accessToken).toBe("new-access-token");

    expect(localStorage.getItem("sprintdesk-refresh-token")).toBe(
      "new-refresh-token",
    );
  });
});
