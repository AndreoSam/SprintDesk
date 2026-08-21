import { act, renderHook } from "@testing-library/react";

import { beforeEach, describe, expect, it } from "vitest";

import { useToast } from "./useToast";

import { useToastStore } from "../stores/toastStore";

describe("useToast", () => {
  beforeEach(() => {
    useToastStore.setState({
      toasts: [],
    });
  });

  it("adds a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Task saved", "success");
    });

    const toasts = useToastStore.getState().toasts;

    expect(toasts).toHaveLength(1);

    expect(toasts[0].message).toBe("Task saved");

    expect(toasts[0].type).toBe("success");
  });

  it("uses info as default type", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Hello");
    });

    const toast = useToastStore.getState().toasts[0];

    expect(toast.type).toBe("info");
  });
});
