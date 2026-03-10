import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContextProvider } from "../../hooks/hooks";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: string;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  allowedRole,
  redirectPath = "/404",
}: ProtectedRouteProps) => {
  const { user, authLoading } = useAuthContextProvider();

  // 1. Show spinner while checking auth status
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // 2. Redirect to landing if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Check if user HAS the required role (not just activeRole)
  if (allowedRole) {
    const userHasRole = user.roles?.some((role) => role.name === allowedRole);
    if (!userHasRole) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  // 4. All checks pass
  return children;
};

export default ProtectedRoute;