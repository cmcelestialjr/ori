import { useNavigate } from "react-router-dom";
import { useAuthContextProvider } from "../../hooks/hooks";
import { redirectLink } from "../../constant/redirectLinks";
import { FaChalkboardTeacher, FaUserShield, FaClipboardCheck } from "react-icons/fa";

const roleConfig: Record<string, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  faculty: {
    label: "Faculty",
    description: "Submit and manage your research monitoring forms",
    icon: <FaChalkboardTeacher className="text-3xl" />,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  "research-coordinator": {
    label: "Research Coordinator",
    description: "Review and approve research submissions",
    icon: <FaClipboardCheck className="text-3xl" />,
    color: "bg-green-600 hover:bg-green-700",
  },
  admin: {
    label: "Administrator",
    description: "Manage users, settings, and system configuration",
    icon: <FaUserShield className="text-3xl" />,
    color: "bg-red-600 hover:bg-red-700",
  },
};

export default function RoleSelectionModal() {
  const { user, setActiveRole, setPendingRoleSelection } = useAuthContextProvider();
  const navigate = useNavigate();

  if (!user || !user.roles || user.roles.length <= 1) return null;

  const handleSelectRole = (roleName: string) => {
    setActiveRole(roleName);
    setPendingRoleSelection(false);
    navigate(redirectLink[roleName]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Welcome, {user.fname}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            You have multiple roles. Choose which dashboard to open.
          </p>
        </div>

        {/* Role Cards */}
        <div className="flex flex-col gap-3 p-6">
          {user.roles.map((role) => {
            const config = roleConfig[role.name];
            if (!config) return null;

            return (
              <button
                key={role.name}
                onClick={() => handleSelectRole(role.name)}
                className={`flex items-center gap-4 rounded-lg p-4 text-left text-white transition-all ${config.color}`}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white bg-opacity-20">
                  {config.icon}
                </div>
                <div>
                  <p className="font-semibold">{config.label}</p>
                  <p className="text-sm text-white text-opacity-80">
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
