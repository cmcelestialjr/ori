type NotificationsProps = {
  notifications: Array<{
    message: string;
    date: string | Date;
    isRead: boolean;
  }>;
};

const NotificationLayout = ({ notifications }: NotificationsProps) => {
  return <div>NotificationLayout</div>;
};

export default NotificationLayout;
