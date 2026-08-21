import { useQuery } from "@tanstack/react-query";

import { getTasks } from "./services/mockDataService";

function App() {
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">SprintDesk</h1>

      <p className="mt-4">Tasks loaded: {tasks?.length}</p>
    </div>
  );
}

export default App;
