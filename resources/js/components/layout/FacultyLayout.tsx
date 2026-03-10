import Header from "../Header";
import { Outlet } from "react-router-dom";
import FacultySidebar from "../sidebar/FacultySidebar";
import { useState } from "react";
import MobileMenu from "../navbar/MobileMenu";

const FacultyLayout = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };
  return (
    <div className="flex h-screen select-none overflow-hidden">
      <MobileMenu toggleMenu={toggleMenu} openMenu={openMenu} />
      <FacultySidebar />

      <div className="flex min-h-0 flex-grow flex-col md:ml-[15rem]">
        <Header toggleMenu={toggleMenu} openMenu={openMenu} />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin scrollbar-track-[#f1f1f1] scrollbar-thumb-[#c1c1c1]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
