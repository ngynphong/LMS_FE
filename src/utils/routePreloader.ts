/**
 * Route Preloader — preload page chunks khi user hover vào sidebar link.
 * Giúp trang tải gần như tức thì khi user click.
 */

type LazyImportFn = () => Promise<unknown>;

const preloadCache = new Set<string>();

/** Map đường dẫn → dynamic import function */
const teacherRouteMap: Record<string, LazyImportFn> = {
  "/teacher/dashboard": () => import("@/pages/teacher/TeacherDashboardPage"),
  "/teacher/courses": () => import("@/pages/teacher/CourseListPage"),
  "/teacher/students": () => import("@/pages/teacher/StudentListPage"),
  "/teacher/questions": () => import("@/pages/teacher/QuestionBankPage"),
  "/teacher/quizzes": () => import("@/pages/teacher/ExamListPage"),
  "/teacher/reports": () => import("@/pages/teacher/ReportsListPage"),
  "/teacher/settings": () => import("@/pages/teacher/TeacherSettingsPage"),
  "/teacher/notifications": () =>
    import("@/pages/teacher/TeacherNotificationPage"),
  "/teacher/referrals": () => import("@/pages/teacher/ReferralRequestPage"),
};

const studentRouteMap: Record<string, LazyImportFn> = {
  "/student/dashboard": () => import("@/pages/student/StudentDashboardPage"),
  "/student/my-courses": () => import("@/pages/student/StudentMyCoursesPage"),
  "/student/quizzes": () =>
    import("@/pages/student/StudentAvailableQuizzesPage"),
  "/student/profile": () => import("@/pages/student/StudentProfilePage"),
  "/student/notifications": () =>
    import("@/pages/student/StudentNotificationPage"),
};

const adminRouteMap: Record<string, LazyImportFn> = {
  "/admin/dashboard": () => import("@/pages/admin/AdminDashboardPage"),
  "/admin/users": () => import("@/pages/admin/AdminUserManagementPage"),
  "/admin/courses": () => import("@/pages/admin/AdminCourseListPage"),
  "/admin/settings": () => import("@/pages/admin/AdminSettingsPage"),
  "/admin/password-requests": () =>
    import("@/pages/admin/AdminPasswordRequestsPage"),
  "/admin/banners": () => import("@/pages/admin/banners/BannerListPage"),
  "/admin/blogs": () => import("@/pages/admin/blog/AdminBlogPage"),
};

const allRouteMaps: Record<string, LazyImportFn> = {
  ...teacherRouteMap,
  ...studentRouteMap,
  ...adminRouteMap,
};

/**
 * Preload một route cụ thể. Chỉ gọi import lần đầu, lần sau bỏ qua.
 */
export const preloadRoute = (path: string): void => {
  if (preloadCache.has(path)) return;

  const importFn = allRouteMaps[path];
  if (importFn) {
    preloadCache.add(path);
    importFn();
  }
};

/**
 * Tạo onMouseEnter handler cho NavLink/Link.
 * Dùng: `onMouseEnter={createPreloadHandler("/teacher/courses")}`
 */
export const createPreloadHandler = (path: string) => {
  return () => preloadRoute(path);
};
