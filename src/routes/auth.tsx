import type { RouteObject } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

/**
 * Authentication Routes
 * These routes do NOT use MainLayout (no header/footer)
 */
const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: '/google/callback',
    element: <GoogleCallbackPage />
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />
  }
];

export default authRoutes;