// import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navList = [
  { id: 1, name: "Profile", url: "/admin-settings/profile" },
  { id: 2, name: "Password", url: "/admin-settings/update-password" },
  { id: 3, name: "SDG Mapping", url: "/admin-settings/sdg-mapping" },
  { id: 4, name: "Agenda Mapping", url: "/admin-settings/agenda-mapping" },
  { id: 5, name: "Points Management", url: "/admin-settings/points" },
  { id: 6, name: "Awards Management", url: "/admin-settings/awards" },
  { id: 7, name: "Backup and Restore", url: "/admin-settings/backup" },
];

export default function Settings() {
  return (
    <div className="mx-auto grid max-w-7xl auto-cols-[minmax(0,2fr)] gap-4">
      <div
        className="hide-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap"
        style={{ scrollbarWidth: "none" }}
      >
        {navList.map((nav) => (
          <NavLink
            className={({ isActive }) =>
              `group relative cursor-pointer font-semibold hover:text-blue-600 ${isActive ? "text-blue-600 underline decoration-[3px] underline-offset-[7px]" : ""}`
            }
            style={{ scrollbarWidth: "none" }}
            key={nav.id}
            to={nav.url}
          >
            {nav.name}
            <span className="absolute bottom-[-5px] left-0 h-[3.5px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
        ))}
      </div>

      <hr className="border-t-2 border-slate-400" />

      <Outlet />
    </div>
  );
}
