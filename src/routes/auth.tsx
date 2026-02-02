import React from "react";
import type { RouteObject } from "react-router-dom";

const LoginPage = React.lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = React.lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = React.lazy(
  () => import("../pages/auth/ResetPasswordPage"),
);
const GoogleCallbackPage = React.lazy(
  () => import("../pages/auth/GoogleCallbackPage"),
);
const VerifyEmailPage = React.lazy(
  () => import("../pages/auth/VerifyEmailPage"),
);

/**
 * Authentication Routes
 * These routes do NOT use MainLayout (no header/footer)
 */
const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/google/callback",
    element: <GoogleCallbackPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
];

export default authRoutes;
