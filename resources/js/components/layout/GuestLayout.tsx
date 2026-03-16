import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { redirectLink } from "../../constant/redirectLinks";
import { useAuthContextProvider } from "../../hooks/hooks";

export default function GuestLayout() {
  const navigate = useNavigate();
  const { 
    user, 
    activeRole, 
    pendingRoleSelection, 
    setPendingRoleSelection // Make sure to destructure this
  } = useAuthContextProvider();

  useEffect(() => {
    if (!user) return;

    // If activeRole is already set, redirect to that dashboard
    if (activeRole) {
      navigate(redirectLink[activeRole]);
      return;
    }

    // Single role user — redirect directly
    if (user.roles.length === 1) {
      navigate(redirectLink[user.roles[0].name]);
      return;
    }

    // SSO / Returning User with Multiple Roles:
    // If they have multiple roles, no active role, and the modal isn't open yet, trigger it!
    if (user.roles.length > 1 && !pendingRoleSelection) {
      setPendingRoleSelection(true);
    }

  }, [user, activeRole, pendingRoleSelection, navigate, setPendingRoleSelection]);

  return <Outlet />;
}