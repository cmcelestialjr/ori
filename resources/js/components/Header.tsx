import { useAuthContextProvider } from "../hooks/hooks";
import { useCallback, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import Notification from "./shared/components/Notifications/Notification";
import echo from "../broadcast/echo";
import { useNotifications } from "./shared/components/Notifications/useNotification";
import { useLocation } from "react-router-dom";

export interface NotificationType {
  id: string;
  message: string;
  name?: string;
  url: string;
  created_at: string | Date;
  image_path?: string;
  read_at: string | null;
}

interface HeaderProps {
  toggleMenu: () => void;
  openMenu: boolean;
}

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/150";


  if (path.startsWith("http://localhost/storage")) {
      return path.replace("http://localhost/", "http://localhost:8000/");
  }


  if (path.startsWith("http")) return path;

  return `http://localhost:8000/storage/${path}`;
};

const Header = ({ toggleMenu, openMenu }: HeaderProps) => {
  const { user } = useAuthContextProvider();
  const [profileColor, setProfileColor] = useState("bg-blue-500");
  const [openNotification, setOpenNotification] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const location = useLocation();

  const { notifications, setNotifications, deleteNotification, markAsRead } =
    useNotifications();

  const isUnreadNotif = notifications.some((notif) => notif.read_at == null);

  useEffect(() => {
    echo
      .private("App.Models.User." + user?.id)
      .notification((notification: NotificationType) => {
        setNotifications((prev) => prev && [notification, ...prev]);
      });

    return () => {
      echo.leave("App.Models.User." + user?.id);
    };
  }, [user?.id, setNotifications]);

  useEffect(() => {
    const main = document.querySelector("main");

    if (!main) {
      setPageTitle("");
      return;
    }

    const updateTitle = () => {
      const heading = main.querySelector("h1");
      if (!heading) {
        setPageTitle("");
        return;
      }

      const nextTitle = heading.textContent?.trim() ?? "";
      setPageTitle(nextTitle);
      if (!heading.classList.contains("md:hidden")) {
        heading.classList.add("md:hidden");
      }
    };

    updateTitle();

    const observer = new MutationObserver(() => {
      updateTitle();
    });

    observer.observe(main, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    const profileIconColors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-600",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-teal-500",
      "bg-orange-600",
      "bg-pink-500",
      "bg-lightBlue-500",
    ];
    const randomColor =
      profileIconColors[Math.floor(Math.random() * profileIconColors.length)];
    setProfileColor(randomColor);
  }, []);

  const onClose = useCallback(() => {
    setOpenNotification(false);
  }, []);

  return (
    // <header>
    //   <div className="flex items-center justify-end space-x-2 border-b border-[#dad9da] bg-white p-2 pr-8 shadow-custom">
    //     <div className="relative">
    //       <button
    //         disabled={openNotification}
    //         onClick={() => setOpenNotification(true)}
    //         className="disabled:cursor-default"
    //       >
    //         <IoMdNotificationsOutline
    //           size={35}
    //           className="relative hover:border-2 hover:border-white"
    //         />
    //         {isUnreadNotif && (
    //           <div className="absolute right-1 top-0 size-2.5 rounded-full bg-red-500" />
    //         )}
    //       </button>

    //       {openNotification && (
    //         <Notification
    //           deleteNotif={deleteNotification}
    //           markAsRead={markAsRead}
    //           setNotifications={setNotifications}
    //           notifications={notifications}
    //           onClose={onClose}
    //         />
    //       )}
    //     </div>
    <header className="sticky top-0 z-10">
      <div className="flex items-center justify-between bg-primary p-4 shadow-custom md:bg-secondary">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="grid place-content-center text-white lg:hidden"
            data-mobile-menu-toggle="true"
            aria-label={openMenu ? "Close menu" : "Open menu"}
          >
            <AiOutlineMenu size={36} />
          </button>

          {pageTitle && (
            <h2 className="hidden text-lg font-semibold text-primary md:block">
              {pageTitle}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <button
              disabled={openNotification}
              onClick={() => setOpenNotification(true)}
              className="disabled:cursor-default flex items-center justify-center"
            >
              {/* <IoMdNotificationsOutline
                size={35}
                className="relative hover:border-2 hover:border-white"
              /> */}
              <IoMdNotificationsOutline
                className="text-secondary md:text-black"
                size={36}
              />

              {isUnreadNotif && (
                <div className="absolute right-1 top-0 size-2.5 rounded-full bg-red-500" />
              )}
            </button>

            {openNotification && (
              <Notification
                deleteNotif={deleteNotification}
                markAsRead={markAsRead}
                setNotifications={setNotifications}
                notifications={notifications}
                onClose={onClose}
              />
            )}
          </div>

          {/* Profile Picture or Initials */}
          {user?.image_path ? (
            <img
              src={getImageUrl(user.image_path)}
              alt="Profile Icon"
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div
              className={`grid h-10 w-10 place-items-center rounded-full text-2xl font-semibold text-white ${profileColor}`}
            >
              {user?.fname?.charAt(0)}
            </div>
          )}

          {/* User Info */}
          <div className="hidden md:block">
            <h3 className="text-base font-semibold">
              {user && (
                <>
                  <span>{user.fname} </span>
                  {user.mi && <span>{user.mi.charAt(0)}. </span>}
                  <span>{user.lname} </span>
                  {user.suffix && <span>{user.suffix}</span>}
                </>
              )}
            </h3>
            <p className="h-[1.25rem] text-xs">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
