import { useNavigate } from "react-router-dom";
import { useAuthContextProvider } from "../../hooks/hooks";
import { redirectLink } from "../../constant/redirectLinks";
import { FaExchangeAlt } from "react-icons/fa";

const roleLabels: Record<string, string> = {
  faculty: "Faculty",
  "research-coordinator": "Coordinator",
  admin: "Administrator",
};

export default function RoleSwitcher() {
  const { user, activeRole, setActiveRole } = useAuthContextProvider();
  const navigate = useNavigate();

  // Only show if user has multiple roles
  if (!user || !user.roles || user.roles.length <= 1) return null;

  const otherRoles = user.roles.filter((r) => r.name !== activeRole);

  const handleSwitch = (roleName: string) => {
    setActiveRole(roleName);
    navigate(redirectLink[roleName]);
  };

  return (
    <div className="mx-4 mb-2 rounded-md bg-white bg-opacity-10 p-3">
      <p className="mb-2 text-xs uppercase tracking-wider text-white text-opacity-70">
        Switch Role
      </p>
      {otherRoles.map((role) => (
        <button
          key={role.name}
          onClick={() => handleSwitch(role.name)}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white transition-colors hover:bg-white hover:bg-opacity-20"
        >
          <FaExchangeAlt className="text-xs" />
          <span>{roleLabels[role.name] || role.name}</span>
        </button>
      ))}
    </div>
  );
}
