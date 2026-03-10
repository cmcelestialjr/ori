import { SetStateAction, useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoMdClose, IoMdInformationCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { NotificationType } from "../../../Header";

interface Notification {
  notifications: NotificationType[];
  onClose: () => void;
  deleteNotif: () => void;
  markAsRead: (id: string) => void;
  setNotifications: React.Dispatch<SetStateAction<NotificationType[]>>;
}

dayjs.extend(relativeTime);

const getImageUrl = (path: string | null | undefined): string => {
  if (!path || typeof path !== "string") return "";
  try {
    let cleanPath = path.replace(/\\/g, "/");
    // If full URL (localhost, 127.0.0.1, or any domain), extract pathname for relative URL
    if (cleanPath.startsWith("http")) {
      const url = new URL(cleanPath);
      return url.pathname + (url.search || "");
    }
    if (cleanPath.includes("/storage/")) {
      cleanPath = cleanPath.substring(cleanPath.indexOf("/storage/"));
    } else {
      cleanPath = cleanPath.replace(/^public\//, "").replace(/^\//, "");
      cleanPath = `/storage/${cleanPath}`;
    }
    return cleanPath;
  } catch {
    return "";
  }
};

const Notification = ({
  deleteNotif,
  markAsRead,
  notifications,
  setNotifications,
  onClose,
}: Notification) => {
  const notifRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleCloseNotification = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleCloseNotification);

    return () => {
      document.removeEventListener("mousedown", handleCloseNotification);
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [onClose]);

  const handleClearAll = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    if (notifications.length > 0) {
      setNotifications([]);
      deleteNotif();
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleMarkAsRead = (id: string) => {
    const currentDate = dayjs();

    const markedNotif = notifications.map((notif) =>
      notif.id === id
        ? { ...notif, read_at: currentDate.format("YYYY-MM-DD") }
        : notif,
    );

    setNotifications(markedNotif);

    onClose();

    markAsRead(id);
  };
  return (
    <>
      <div ref={notifRef} className="relative z-50">
        <div className="fixed left-1/2 top-16 z-50 w-[94vw] max-w-[30rem] -translate-x-1/2 overflow-hidden rounded border bg-white shadow-md transition-all duration-200 ease-out sm:w-[26rem] md:w-[28rem] lg:absolute lg:left-auto lg:right-0 lg:top-full lg:mt-2 lg:w-[30rem] lg:translate-x-0">
          <div className="flex items-center justify-between border-b-2 p-3 text-sm sm:p-4">
            <p className="font-bold sm:text-base">Your notifications</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Close notifications"
            >
              <IoMdClose className="h-5 w-5" />
            </button>
          </div>
          {/* <p className="p-3 text-g   ray-500">No notifications</p> When no notification it must input null in the notification */}

          <div className="max-h-[70vh] overflow-y-auto sm:max-h-96">
            {notifications && notifications.length === 0 ? (
              <p className="mb-1 p-3 text-sm text-gray-600 sm:p-4">
                No notifications
              </p>
            ) : (
              notifications?.map((notif) => (
                <Link key={notif.id} to={notif.url}>
                  <div
                    className="grid cursor-pointer grid-cols-6 border-b px-3 py-3 hover:bg-gray-200 sm:px-5 sm:py-4"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-green-500">
                      {notif.image_path && getImageUrl(notif.image_path) && (
                        <img
                          src={getImageUrl(notif.image_path)}
                          alt=""
                          className="absolute inset-0 size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex size-full items-center justify-center">
                        {notif.name ? (
                          <span className="text-sm font-bold text-white">
                            {notif.name?.[0]?.toUpperCase() ?? "?"}
                          </span>
                        ) : (
                          <IoMdInformationCircle className="size-6 text-white" />
                        )}
                      </div>
                    </div>

                    <div className="col-span-4">
                      <p
                        className={`line-clamp-3 break-normal text-sm sm:text-base ${
                          notif.read_at == null && "font-bold"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p className="mt-2 text-xs sm:text-sm">
                        {dayjs(notif.created_at).fromNow()}
                      </p>
                    </div>

                    <div
                      className={`ml-3 h-3 w-3 self-center rounded-full sm:ml-4 ${
                        notif.read_at == null && "bg-blue-500"
                      }`}
                    ></div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="flex items-center justify-end border-t p-3 text-sm sm:p-4">
            <button
              onClick={handleClearAll}
              className={`rounded-md px-3 py-1 ${
                notifications.length > 0
                  ? "text-primary hover:bg-primary/10"
                  : "text-gray-500 hover:bg-transparent"
              }`}
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
