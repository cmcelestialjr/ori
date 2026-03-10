import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { lnuOri } from "../../assets/images";
import { MouseEvent, useEffect } from "react";
import { useAuthContextProvider } from "../../hooks/hooks";
import { redirectLink } from "../../constant/redirectLinks";

const Navbar = () => {
  const { user } = useAuthContextProvider();
  const location = useLocation();
  const roleName = user?.roles?.[0]?.name;
  const redirectUser = roleName ? redirectLink[roleName] ?? "/" : "/";
  const homeLink = location.pathname === "/" ? "#home" : "/#home";
  const aboutLink = location.pathname === "/" ? "#about" : "/#about";

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    if (location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-lg font-medium scrollbar-thin scrollbar-track-[#f1f1f1] scrollbar-thumb-[#c1c1c1]">
      <div className="flex min-h-0 flex-1 flex-col">
        <nav className="sticky left-0 right-0 top-0 z-30 flex flex-wrap items-center justify-between gap-3 bg-primary p-2 px-4 shadow-custom">
          <Link to="/" className="flex items-center">
            {/* Logo */}
            <img
              src={lnuOri}
              alt="LNU ORI LOGO"
              className="h-[55px] w-[62px]"
              loading="lazy"
            />
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <ul className="flex flex-wrap items-center gap-2 pr-0 text-white sm:gap-4 md:gap-6 lg:gap-10">
              <li>
                <Link
                  to={homeLink}
                  className="rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                  onClick={(event) => handleSectionClick(event, "home")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={aboutLink}
                  className="rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                  onClick={(event) => handleSectionClick(event, "about")}
                >
                  About
                </Link>
              </li>
              <li>
                {!user ? (
                  <NavLink
                    to="/login"
                    className={() =>
                      "rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                    }
                  >
                    Login
                  </NavLink>
                ) : (
                  <NavLink
                    to={redirectUser}
                    className={() =>
                      "rounded-md border-b-2 border-transparent px-2 py-1 text-xs text-white hover:border-b-amber-300 sm:px-3 sm:text-sm md:text-base"
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Navbar;
