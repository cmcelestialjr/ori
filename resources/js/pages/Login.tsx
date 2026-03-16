import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import { useEffect } from "react"; // Add useEffect
import { useAuthContextProvider } from "../hooks/hooks";
import { InputPassword } from "../components/ui/InputPassword";
import RoleSelectionModal from "../components/ui/RoleSelectionModal";

export default function Login() {
  const {
    handleLogin,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    pendingRoleSelection,
  } = useAuthContextProvider();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read URL parameters

  // Pre-fill the login fields if coming from the access gateway
  useEffect(() => {
    const ssoEmail = searchParams.get("email");
    const isSso = searchParams.get("sso");

    if (ssoEmail) {
      setEmail(ssoEmail);
    }
    if (isSso) {
      setPassword("••••••••"); // Dummy password for visual effect
    }
  }, [searchParams, setEmail, setPassword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(navigate);
  };

  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center">
      <div className="max-w-[50rem] rounded-md bg-secondary px-10 py-16 shadow-custom">
        <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
          {/* ... existing form UI ... */}
          <h2 className="text-center text-3xl font-bold">
            Sign in to your account
          </h2>

          {error && (
            <p className="border border-red-500 bg-[#ffebe8] p-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="username"
              name="Username"
              type="email"
              placeholder="johndoe@example.com"
              autoComplete="text"
              required
              className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>

          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex flex-col items-center text-center">
            {!loading ? (
              <button
                type="submit"
                className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Sign in
              </button>
            ) : (
              <button
                type="submit"
                disabled
                className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white focus:outline-none"
              >
                Signing in...
              </button>
            )}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-blue-700 hover:underline">
                    Register as Faculty
                </Link>
            </div>
        </form>
      </div>

      {pendingRoleSelection && <RoleSelectionModal />}
    </div>
  );
}