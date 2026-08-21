import { useAuthStore } from "../stores/authStore";

function Login() {
  const login = useAuthStore((state) => state.login);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-center text-3xl font-bold">SprintDesk</h1>

        <button
          onClick={login}
          className="w-full rounded-lg bg-black px-4 py-3 text-white"
        >
          Temporary Login
        </button>
      </div>
    </div>
  );
}

export default Login;
