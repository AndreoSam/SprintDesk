import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks, getUsers, getComments } from "../services/mockDataService";
import { useBoardStore } from "../stores/boardStore";
import { useCommentStore } from "../stores/commentStore";

export const useBoardTasks = () => {
  const tasks = useBoardStore((state) => state.tasks);

  const setTasks = useBoardStore((state) => state.setTasks);

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const commentsQuery = useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
  });

  const comments = useCommentStore((state) => state.comments);

  const setComments = useCommentStore((state) => state.setComments);

  useEffect(() => {
    if (tasksQuery.data && tasks.length === 0) {
      setTasks(tasksQuery.data);
    }
  }, [tasksQuery.data, tasks.length, setTasks]);

  useEffect(() => {
    if (commentsQuery.data && comments.length === 0) {
      setComments(commentsQuery.data);
    }
  }, [commentsQuery.data, comments.length, setComments]);

  return {
    tasks,
    users: usersQuery.data ?? [],
    // comments: commentsQuery.data ?? [],
    comments,

    isLoading:
      tasksQuery.isLoading || usersQuery.isLoading || commentsQuery.isLoading,

    isError: tasksQuery.isError || usersQuery.isError || commentsQuery.isError,
  };
};
