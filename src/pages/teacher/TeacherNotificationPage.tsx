import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../../hooks/useNotifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const TeacherNotificationPage = () => {
  const navigate = useNavigate();
  // We can add state for pagination if needed
  const { data: notificationData, isLoading } = useNotifications(
    0,
    50,
    "createdAt,desc",
  );
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = notificationData?.content || [];

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Thông báo hệ thống
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tất cả các thông báo và cảnh báo từ hệ thống
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              done_all
            </span>
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <span className="material-symbols-outlined animate-spin text-4xl color-primary">
              progress_activity
            </span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <FaBell className="text-6xl text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">
              Bạn chưa có thông báo nào.
            </h3>
            <p className="text-sm">
              Khi có thông báo hệ thống, chúng sẽ xuất hiện ở đây.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 flex gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${!notif.isRead ? "bg-blue-50/20" : ""}`}
                onClick={() => {
                  if (!notif.isRead) markRead.mutate(notif.id);
                  if (notif.link) navigate(notif.link);
                }}
              >
                <div className="shrink-0 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ring-4 ${getNotificationColor(notif.type)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${getNotificationTextColor(notif.type)}`}
                    >
                      {notif.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[14px]">
                        schedule
                      </span>
                      {dayjs(notif.createdAt).fromNow()}
                    </span>
                  </div>
                  <h4
                    className={`text-base font-semibold text-slate-900 mb-1 ${!notif.isRead ? "text-blue-900" : "text-slate-800"}`}
                  >
                    {notif.title || notif.message}
                  </h4>
                  {notif.title && notif.message && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {notif.message}
                    </p>
                  )}
                </div>
                {!notif.isRead && (
                  <div className="shrink-0 self-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1E90FF]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherNotificationPage;
