import { NavLink } from "react-router-dom";
import { FaChevronDown, FaUsers } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logout from "../util/Logout";
import { useAuthContextProvider } from "../../hooks/hooks";
import { RoleEnum } from "../shared/types/types";

interface MobileMenuProps {
  openMenu: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ openMenu, toggleMenu }: MobileMenuProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { user } = useAuthContextProvider();
  const roleName = user?.roles?.[0]?.name;
  const isAdmin = roleName === RoleEnum.ADMIN;
  const isCoordinator = roleName === RoleEnum.RESEARCH_COORDINATOR;
  const isFaculty = roleName === RoleEnum.FACULTY;
  const roleTitle = isAdmin
    ? "Administrator"
    : isCoordinator
      ? "Coordinator"
      : isFaculty
        ? "Faculty"
        : "User";
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenu) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-mobile-menu-toggle="true"]')) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        toggleMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [openMenu, toggleMenu]);

  const toggleMenus = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const menuItemClass =
    "flex items-center px-6 py-3 text-primary transition-colors hover:bg-primary/10";
  const menuItemActiveClass = "bg-primary/10 font-bold";
  const submenuItemClass =
    "flex items-center py-3 pl-16 text-primary transition-colors hover:bg-primary/10";
  const submenuItemActiveClass = "bg-primary/10 font-bold";

  return (
    <div
      ref={menuRef}
      onMouseLeave={() => {
        if (openMenu) {
          toggleMenu();
        }
      }}
      className={`fixed inset-y-0 left-0 z-50 h-full w-72 bg-secondary shadow-lg transition-transform duration-300 lg:hidden ${
        openMenu ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative h-full">
        <div className="relative flex h-[3.8rem] items-center justify-center">
          <h1 className="text-xl font-semibold text-primary">{roleTitle}</h1>
          <div className="absolute bottom-0 left-1/2 h-[1px] w-11/12 -translate-x-1/2 bg-primary/20"></div>
        </div>

        <nav>
          <ul className="mt-4">
            {isAdmin && (
              <>
                <li>
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <div
                    onClick={() => toggleMenus("users")}
                    className={`${menuItemClass} cursor-pointer`}
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
                        className="mt-1 flex flex-col overflow-hidden"
                      >
                        <li>
                          <NavLink
                            to="/manage-faculty"
                            className={({ isActive }) =>
                              `${submenuItemClass} ${
                                isActive ? submenuItemActiveClass : ""
                              }`
                            }
                            onClick={() => {
                              toggleMenu();
                            }}
                          >
                            Faculty
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/manage-coordinators"
                            className={({ isActive }) =>
                              `${submenuItemClass} ${
                                isActive ? submenuItemActiveClass : ""
                              }`
                            }
                            onClick={() => {
                              toggleMenu();
                            }}
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
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Research Monitoring
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Reports
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin-settings/profile"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Settings
                  </NavLink>
                </li>

                <li>
                  <Logout style={`${menuItemClass} w-full`} />
                </li>
              </>
            )}

            {isCoordinator && (
              <>
                <li>
                  <NavLink
                    to="/coordinator-dashboard"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <div
                    onClick={() => toggleMenus("monitoring-forms")}
                    className={`${menuItemClass} cursor-pointer`}
                  >
                    <span>Monitoring Forms</span>
                    <FaChevronDown
                      size={15}
                      className={`ml-auto transition-transform duration-300 ${
                        activeMenu === "monitoring-forms" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {activeMenu === "monitoring-forms" && (
                      <motion.ul
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1 flex flex-col overflow-hidden"
                      >
                        <li>
                          <NavLink
                            to="/pending"
                            className={({ isActive }) =>
                              `${submenuItemClass} ${
                                isActive ? submenuItemActiveClass : ""
                              }`
                            }
                            onClick={() => {
                              toggleMenu();
                            }}
                          >
                            Pending
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/approved"
                            className={({ isActive }) =>
                              `${submenuItemClass} ${
                                isActive ? submenuItemActiveClass : ""
                              }`
                            }
                            onClick={() => {
                              toggleMenu();
                            }}
                          >
                            Approved
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
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Settings
                  </NavLink>
                </li>

                <li>
                  <Logout style={`${menuItemClass} w-full`} />
                </li>
              </>
            )}

            {isFaculty && (
              <>
                <li>
                  <NavLink
                    to="/faculty-dashboard"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/research-monitoring-form"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Monitoring Form
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/faculty/archived"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Archived Submission
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/faculty-settings"
                    className={({ isActive }) =>
                      `${menuItemClass} ${isActive ? menuItemActiveClass : ""}`
                    }
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    Settings
                  </NavLink>
                </li>

                <li>
                  <Logout style={`${menuItemClass} w-full`} />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
