import type { RouteObject } from "react-router-dom";
import authRoutes from "./auth";
import publicRoutes from "./public";
import studentRoutes from "./student";
import teacherRoutes from "./teacher";
import adminRoutes from "./admin";

const routes: RouteObject[] = [
  ...authRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...adminRoutes,
  ...publicRoutes,
];

export default routes;
