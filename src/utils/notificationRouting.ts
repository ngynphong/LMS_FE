import type { NotificationItem } from "@/types/notification";

/** Course notification titles mapped to referral routes */
const REFERRAL_TITLES = [
  "Yêu cầu gửi gắm học sinh",
  "Yêu cầu gửi gắm đã được duyệt",
  "Yêu cầu gửi gắm bị từ chối",
  "Một số học sinh bị từ chối gửi gắm",
];

interface NotificationRouteResult {
  /** Route to navigate to, null means no navigation */
  route: string | null;
  /** If true, should open ImportJobDetailModal instead of navigating */
  openImportModal: boolean;
  /** JobId for import modal */
  jobId: string | null;
}

/**
 * Determines the frontend route to navigate to when clicking a notification.
 * Logic based on category + title mapping.
 *
 * @param notification - The notification item
 * @param userRole - Current user role ("TEACHER" | "STUDENT" | "ADMIN")
 * @returns Route result with navigation info
 */
export const getNotificationRoute = (
  notification: NotificationItem,
  userRole: string,
): NotificationRouteResult => {
  const { category, referenceId, title, jobId } = notification;
  const rolePrefix = `/${userRole.toLowerCase()}`;

  switch (category) {
    case "QUIZ": {
      if (!referenceId) return { route: null, openImportModal: false, jobId: null };
      return {
        route: `${rolePrefix}/quiz/attempts/${referenceId}`,
        openImportModal: false,
        jobId: null,
      };
    }

    case "COURSE": {
      if (!referenceId) return { route: null, openImportModal: false, jobId: null };

      // Check if title matches referral-related notifications
      const isReferral = REFERRAL_TITLES.some((t) => title?.includes(t));

      if (isReferral) {
        return {
          route: `${rolePrefix}/referrals`,
          openImportModal: false,
          jobId: null,
        };
      }

      // Default: navigate to course detail
      return {
        route: `${rolePrefix}/courses/${referenceId}`,
        openImportModal: false,
        jobId: null,
      };
    }

    case "IMPORT": {
      const importJobId = referenceId || jobId;
      if (!importJobId) return { route: null, openImportModal: false, jobId: null };
      return {
        route: null,
        openImportModal: true,
        jobId: importJobId,
      };
    }

    case "AUTH":
    case "SYSTEM":
    default:
      return { route: null, openImportModal: false, jobId: null };
  }
};
