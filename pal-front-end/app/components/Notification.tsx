// components/Notification.tsx
import React from 'react';

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const typeStyles = {
    success: "bg-green-500 text-white opacity-100",
    error: "bg-red-500 text-white opacity-100",
    info: "bg-blue-500 text-white opacity-100",
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md transition-opacity ease-in duration-250 ${message ? '' : 'opacity-0'} ${typeStyles[type]}`}>
      <p className="text-white">{message}</p>
    </div>
  );
};

export default Notification;