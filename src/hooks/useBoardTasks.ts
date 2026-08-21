import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getTasks } from "../services/mockDataService";
import { useBoardStore } from "../stores/boardStore";

export const useBoardTasks = () => {
  const tasks = useBoardStore((state) => state.tasks);

  const setTasks = useBoardStore((state) => state.setTasks);

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  useEffect(() => {
    if (query.data && tasks.length === 0) {
      setTasks(query.data);
    }
  }, [query.data, tasks.length, setTasks]);

  return {
    ...query,
    tasks,
  };
};
