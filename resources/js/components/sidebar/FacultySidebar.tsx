import { NavLink } from "react-router-dom";
import { FaArchive, FaClipboardList, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Logout from "../util/Logout";
import RoleSwitcher from "../ui/RoleSwitcher";

// react icon

const FacultySidebar = () => {
  return (
    <aside className="left-0 top-0 hidden h-full w-60 bg-primary text-white shadow-lg md:fixed md:block">
      <div className="relative flex h-[3.8rem] items-center justify-center">
        <div className="absolute left-8 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ">
            <img
            src="/favicon.ico"
            alt="Profile"
            loading="lazy"
            className="absolute object-contain"
            />
        </div>
        <h1 className="text-xl">Faculty</h1>
        <div className="absolute bottom-0 left-1/2 h-[1px] w-11/12 -translate-x-1/2 bg-white"></div>
      </div>

      <nav>
        <ul className="mt-4">
          <li>
            <NavLink
              to="/faculty-dashboard"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <MdDashboard className="mr-2" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/research-monitoring-form"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <FaClipboardList className="mr-2" />
              <span>Monitoring Form</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/faculty/archived"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <FaArchive className="mr-2" />
              <span>Archived Submission</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/faculty-settings"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <FaCog className="mr-2" />
              <span>Settings</span>
            </NavLink>
          </li>

          <li>
            <RoleSwitcher />
          </li>

          <li>
            <Logout style="flex w-full items-center px-6 py-3 hover:bg-indigo-800 transition-colors text-whtie" />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default FacultySidebar;
