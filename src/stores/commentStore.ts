import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Comment } from "../types/comment";

interface CommentState {
  comments: Comment[];

  setComments: (comments: Comment[]) => void;

  addComment: (comment: Comment) => void;
}

export const useCommentStore = create<CommentState>()(
  persist(
    (set) => ({
      comments: [],

      setComments: (comments) => {
        set({ comments });
      },

      addComment: (comment) => {
        set((state) => ({
          comments: [...state.comments, comment],
        }));
      },
    }),
    {
      name: "sprintdesk-comments",
    },
  ),
);
