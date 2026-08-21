import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/userApi";
import { useToast } from "../hooks/useToast";
function Dashboard() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
  });
  const { showToast } = useToast();

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">{error.message}</div>;
  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <button
        type="button"
        onClick={() => showToast("Toast system works!", "success")}
        className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
      >
        Test Toast
      </button>
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">Welcome back</p>

        <h2 className="mt-1 text-xl font-semibold">
          {user?.firstName} {user?.lastName}
        </h2>

        <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
}

export default Dashboard;
