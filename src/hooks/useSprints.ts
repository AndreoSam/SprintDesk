import { useQuery } from "@tanstack/react-query";
import { getSprints } from "../services/mockDataService";

export const useSprints = () => {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: getSprints,
  });
};
