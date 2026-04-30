import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { redirectLink } from "../../constant/redirectLinks";
import { useAuthContextProvider } from "../../hooks/hooks";

export default function GuestLayout() {
  const navigate = useNavigate();
  const { user, activeRole, pendingRoleSelection } = useAuthContextProvider();

  useEffect(() => {
    if (!user) return;

    // Don't redirect if user needs to pick a role first
    if (pendingRoleSelection) return;

    // If activeRole is set (returning user), redirect to that dashboard
    if (activeRole) {
      navigate(redirectLink[activeRole]);
      return;
    }

    // Single role user — redirect directly
    if (user.roles.length === 1) {
      navigate(redirectLink[user.roles[0].name]);
    }
  }, [user, activeRole, pendingRoleSelection, navigate]);

  return <Outlet />;
}
