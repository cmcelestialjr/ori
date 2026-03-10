import api from "../../../api/axios";
import { NotificationType } from "../../../Header";
import { useEffect, useState } from "react";

type NotificationSchema = {
  id: string;
  data: {
    name?: string;
    url: string;
    image_path?: string;
    message: string;
  };
  read_at: Date | string;
  created_at: Date | string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const markAsRead = async (notificationId: string) => {
    await api.post("/api/notifications/mark-as-read", {
      notificationId: notificationId,
    });
  };

  const deleteNotification = async () => {
    await api.delete(`/api/notifications/clear-all`);
  };
  useEffect(() => {
    const controller = new AbortController();

    const fetchNotifications = async () => {
      const response = await api.get("/api/notifications", {
        signal: controller.signal,
      });

      const notifs = response.data.data.map((notif: NotificationSchema) => ({
        id: notif.id,
        message: notif.data.message,
        read_at: notif.read_at,
        created_at: notif.created_at,
        name: notif.data.name,
        url: notif.data.url,
        image_path: notif.data.image_path,
      }));

      setNotifications(notifs);
    };

    fetchNotifications();

    return () => controller.abort();
  }, []);

  return {
    notifications,
    setNotifications,
    markAsRead,
    deleteNotification,
  };
};
