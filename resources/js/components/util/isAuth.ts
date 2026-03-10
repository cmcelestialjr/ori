import { useAuthContextProvider } from "../../hooks/hooks";

const useIsAuth = () => {
  const { isAuthenticated } = useAuthContextProvider();

  if (!isAuthenticated) return false;

  return true;
};

export default useIsAuth;
