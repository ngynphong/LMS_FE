import { useState, useRef, useEffect } from "react";
import { FaBell, FaCircleNotch } from "react-icons/fa";
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../../hooks/useNotifications";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: notificationData, isLoading } = useNotifications(
    0,
    50,
    "createdAt,desc",
  );
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();

  const notifications = Array.isArray(notificationData)
    ? notificationData
    : notificationData?.content ||
      notificationData?.data ||
      notificationData?.items ||
      [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleNotificationClick = (notif: any) => {
    if (!notif.read) {
      markRead.mutate(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "DEADLINE":
        return "bg-red-500 ring-red-50";
      case "INTERACTION":
        return "color-primary-bg ring-blue-50";
      case "SYSTEM":
        return "bg-green-500 ring-green-50";
      case "SCHEDULE":
        return "bg-yellow-500 ring-yellow-50";
      default:
        return "color-primary-bg ring-blue-50";
    }
  };

  const getNotificationTextColor = (type: string) => {
    switch (type) {
      case "DEADLINE":
        return "text-red-500";
      case "INTERACTION":
        return "color-primary";
      case "SYSTEM":
        return "text-green-500";
      case "SCHEDULE":
        return "text-yellow-500";
      default:
        return "color-primary";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                className="text-xs font-semibold color-primary hover:underline hover:text-blue-700 disabled:opacity-50"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[400px]">
            {isLoading ? (
              <div className="p-8 flex justify-center items-center">
                <span className="animate-spin text-2xl color-primary">
                  <FaCircleNotch />
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
                <p>Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notif.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="shrink-0 mt-1">
                      <div
                        className={`size-2.5 rounded-full ring-4 ${getNotificationColor(notif.type)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${getNotificationTextColor(notif.type)}`}
                      >
                        {notif.type}
                      </p>
                      <p
                        className={`text-sm text-gray-900 line-clamp-2 ${!notif.read ? "font-semibold" : "font-normal"}`}
                      >
                        {notif.content || notif.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] opacity-70">
                          schedule
                        </span>
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="shrink-0 size-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 text-center border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <Link
              to="/student/notifications" // Default fallback
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold color-primary w-full block"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
