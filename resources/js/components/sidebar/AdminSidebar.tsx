import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaCog,
  FaChevronDown,
  FaFile,
  FaChartPie,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Logout from "../util/Logout";
import RoleSwitcher from "../ui/RoleSwitcher";


// react icon

const AdminSidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  return (
    <aside className="left-0 top-0 z-20 hidden h-full w-60 bg-primary text-white shadow-lg md:fixed md:block">
      <div className="relative flex h-[3.8rem] items-center justify-center">
        <h1 className="text-xl">Administrator</h1>
        <div className="absolute bottom-0 left-1/2 h-[1px] w-11/12 -translate-x-1/2 bg-white"></div>
      </div>

      <nav>
        <ul className="mt-4">
          <li>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <MdDashboard className="mr-2" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <div
              onClick={() => toggleMenu("users")}
              className="flex items-center px-6 py-3 transition-colors hover:bg-indigo-800"
            >
              <FaUsers className="mr-2" />
              <span>Users</span>
              <FaChevronDown
                size={15}
                className={`ml-auto transition-transform duration-300 ${
                  activeMenu === "users" ? "rotate-180" : ""
                }`}
              />
            </div>
            <AnimatePresence>
              {activeMenu === "users" && (
                <motion.ul
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 flex flex-col gap-1 overflow-hidden"
                >
                  <li>
                    <NavLink
                      to="/manage-faculty"
                      className={({ isActive }) =>
                        `flex items-center py-3 pl-16 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
                      }
                    >
                      Faculty
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/manage-coordinators"
                      className="flex items-center py-3 pl-16 transition-colors hover:bg-indigo-800"
                    >
                      Coordinator
                    </NavLink>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li>
            <NavLink
              to="/research-monitoring/set-date"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <FaFile className="mr-2" />
              <span>Research Monitoring</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
              }
            >
              <FaChartPie className="mr-2" />
              <span>Reports</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin-settings/profile"
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

export default AdminSidebar;
