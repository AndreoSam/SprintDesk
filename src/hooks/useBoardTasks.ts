import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getTasks, getUsers, getComments } from "../services/mockDataService";

import { useBoardStore } from "../stores/boardStore";

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

  useEffect(() => {
    if (tasksQuery.data && tasks.length === 0) {
      setTasks(tasksQuery.data);
    }
  }, [tasksQuery.data, tasks.length, setTasks]);

  return {
    tasks,
    users: usersQuery.data ?? [],
    comments: commentsQuery.data ?? [],

    isLoading:
      tasksQuery.isLoading || usersQuery.isLoading || commentsQuery.isLoading,

    isError: tasksQuery.isError || usersQuery.isError || commentsQuery.isError,
  };
};
