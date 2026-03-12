import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaClipboardList, FaCog, FaChevronDown } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import Logout from './util/Logout';
import RoleSwitcher from './ui/RoleSwitcher';

// react icon

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 h-full  bg-blue-700 text-white shadow-custom p-6 ">
      <div className="flex flex-col items-center">
        <h1 className="text-xl">Administrator</h1>
        <div className="w-11/12 h-[1px] bg-white mt-5"></div>
      </div>
      <nav>
        <ul className="mt-4 space-y-2">
          <li>
            <NavLink 
              to="/admin-dashboard" 
              className={({ isActive }) => `flex items-center px-4 py-2 rounded-md transition ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}`}
            >
              <MdDashboard className="mr-2" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <div 
              onClick={() => toggleMenu('users')} 
              className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <FaUsers className="mr-2" />
              <span>Users</span>
              <FaChevronDown
                size={15}
                className={`ml-auto transition-transform duration-300 ${
                  openMenu === "users" ? "rotate-180" : ""
                }`}
              />
            </div>
            <AnimatePresence>
              {openMenu === "users" && (
                <motion.ul
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-1 overflow-hidden  mt-1"
                >
                  <li>
                    <NavLink 
                      to="/manage-coordinators" 
                      className={'block rounded-md px-10 py-2 transition hover:bg-blue-600 '}
                    >
                      Coordinator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/manage-faculty"
                      className={({ isActive }) => `block rounded-md px-10 py-2 hover:bg-blue-600 transition ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}`}
                    >
                      Faculty
                    </NavLink>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li>
            <div 
              onClick={() => toggleMenu('monitoring')} 
              className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <FaClipboardList className="mr-2" />
              <span>Monitoring Form</span>
              <FaChevronDown
                size={15}
                className={`ml-auto transition-transform duration-300 ${
                  openMenu === "monitoring" ? "rotate-180" : ""
                }`}
              />
            </div>

            <AnimatePresence>
              {openMenu === "monitoring" && (
                <motion.ul
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-1 overflow-hidden mt-1"
                >
                  <li className='w-full'>
                    <NavLink 
                      to="/monitoring/attendance" 
                      className={({ isActive }) => `flex items-center px-10 py-2 rounded-md transition ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}`}
                    >
                      Attendance
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/monitoring/activities" 
                      className={({ isActive }) => `flex items-center px-10 py-2 rounded-md transition ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}`}
                    >
                      Activities
                    </NavLink>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `flex items-center px-4 py-2 rounded-md transition ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}`}
            >
              <FaCog className="mr-2" />
              <span>Settings</span>
            </NavLink>
          </li>

          <li>
            <RoleSwitcher />
          </li>

          <li>
            <Logout style={''}  />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
