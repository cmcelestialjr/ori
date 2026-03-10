import { NavLink, Outlet } from "react-router-dom";

export default function ResearchMonitoring() {
  const navList = [
    {
      id: 1,
      name: "Set Date to Accept Research",
      url: "/research-monitoring/set-date",
    },
    { id: 3, name: "Submissions", url: "/research-monitoring/submissions" },
    {
      id: 5,
      name: "Archived",
      url: "/research-monitoring/archived",
    },
  ];
  return (
    <div className="grid gap-4">
      <nav
        className="hide-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap"
        style={{ scrollbarWidth: "none" }}
      >
        {navList.map((nav) => (
          <NavLink
            className={({ isActive }) =>
              `group relative cursor-pointer font-semibold hover:text-blue-600 ${isActive ? "text-blue-600 underline decoration-[3px] underline-offset-[7px]" : ""}`
            }
            key={nav.id}
            to={nav.url}
          >
            {nav.name}
            <span className="absolute bottom-[-5px] left-0 h-[3.5px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </NavLink>
        ))}
      </nav>

      <hr className="border-t-2 border-slate-400" />

      <Outlet />
    </div>
  );
}
