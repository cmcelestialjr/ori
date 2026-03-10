import Logout from "../util/Logout";
import { NavLink } from "react-router-dom";
import { FaChevronDown, FaCog, FaFile } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuthContextProvider } from "../../hooks/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LuFileCheck, LuFileClock } from "react-icons/lu";
import RoleSwitcher from "../ui/RoleSwitcher";

// react icon

const CoordinatorSidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const { user } = useAuthContextProvider();

  return (
    <aside className="left-0 top-0 z-20 hidden h-full w-60 bg-primary text-white shadow-lg md:fixed md:block">
        <div className="relative flex h-[3.8rem] items-center justify-center">
            <div className="absolute left-8 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ">
              <img
                src="/favicon.ico"
                alt="Profile"
                loading="lazy"
                className="absolute object-contain"
              />
            </div>
            <h1 className="text-xl">Coordinator</h1>
            <div className="absolute bottom-0 left-1/2 h-[1px] w-11/12 -translate-x-1/2 bg-white"></div>
        </div>

      <nav>
        <ul className="mt-4">
          <li>
            <NavLink
              to="/coordinator-dashboard"
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
              className="flex items-center px-6 py-3 hover:bg-indigo-800 transition-colors"
            >
              <FaFile className="mr-2" />
              <span>Monitoring Forms</span>
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
                      to="/pending"
                      className={({ isActive }) =>
                        `flex items-center pl-16 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
                      }
                    >
                      <div className="flex items-center justify-start space-x-1">
                        <LuFileClock className="mt-1" />
                        <span>Pending</span>
                      </div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/approved"
                      className={({ isActive }) =>
                        `flex items-center pl-16 py-3 transition-colors ${isActive ? "bg-indigo-800" : "hover:bg-indigo-800"}`
                      }
                    >
                      <div className="flex items-center justify-start space-x-1">
                        <LuFileCheck className="mt-1" />
                        <span>Approved</span>
                      </div>
                    </NavLink>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li>
            <NavLink
              to="/coordinator-settings"
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

export default CoordinatorSidebar;
