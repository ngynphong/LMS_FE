# Routes Organization Guide

## Cấu Trúc Hiện Tại

```
src/routes/
├── index.tsx      # Main router - combines all route modules
├── auth.tsx       # Authentication routes (no layout)
└── public.tsx     # Public routes (with header/footer)
```

## File Breakdown

### 1. `routes/index.tsx` - Main Router

Combine tất cả route modules lại thành một mảng routes duy nhất.

**Exports:**

- `routes` (default): Mảng RouteObject[] chứa tất cả routes
- `isAuthPath()`: Helper function để check if path là auth page

### 2. `routes/auth.tsx` - Authentication Routes

Routes không có header/footer (login, register, forgot-password).

**Pages:**

- `/login` → LoginPage
- `/register` → Register Page (coming soon)
- `/forgot-password` → Forgot Password (coming soon)

### 3. `routes/public.tsx` - Public Routes

Routes có header/footer (home, courses, forum, shop).

**Pages:**

- `/` → Home
- `/courses` → CoursesPage
- `/forum` → Forum (coming soon)
- `/shop` → Shop (coming soon)

## Mở Rộng Cho Nhiều Roles

### Example: Thêm Admin Routes

**Step 1:** Tạo `routes/admin.tsx`

```tsx
import type { RouteObject } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />, // Admin có layout riêng
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
    ],
  },
];

export default adminRoutes;
```

**Step 2:** Import vào `routes/index.tsx`

```tsx
import adminRoutes from "./admin";

const routes: RouteObject[] = [
  ...authRoutes,
  ...publicRoutes,
  ...adminRoutes, // ✅ Thêm admin routes
];
```

### Example: Thêm Teacher Routes

**Tạo `routes/teacher.tsx`**

```tsx
import type { RouteObject } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import MyCourses from "../pages/teacher/MyCourses";

const teacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
      {
        path: "dashboard",
        element: <TeacherDashboard />,
      },
      {
        path: "courses",
        element: <MyCourses />,
      },
    ],
  },
];

export default teacherRoutes;
```

### Example: Thêm Student Routes

**Tạo `routes/student.tsx`**

```tsx
import type { RouteObject } from "react-router-dom";
import StudentDashboard from "../pages/student/StudentDashboard";
import MyCourses from "../pages/student/MyCourses";

const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "my-courses",
        element: <MyCourses />,
      },
    ],
  },
];

export default studentRoutes;
```

## Protected Routes Pattern

Để protect routes cho authenticated users hoặc specific roles:

**Tạo `components/ProtectedRoute.tsx`**

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

**Sử dụng trong routes:**

```tsx
const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [...]
  }
];
```

## Ưu Điểm Của Cấu Trúc Này

✅ **Modular**: Mỗi nhóm routes ở file riêng
✅ **Scalable**: Dễ thêm routes mới cho roles khác
✅ **Maintainable**: Dễ tìm và sửa routes
✅ **Type-safe**: TypeScript support đầy đủ
✅ **Clear separation**: Auth pages vs Public vs Dashboard pages

## Best Practices

1. **Nhóm theo chức năng/role**: auth, public, admin, teacher, student
2. **Sử dụng nested routes** cho layouts: Admin dashboard có layout riêng
3. **Lazy loading** cho performance:
   ```tsx
   const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
   ```
4. **Route guards** cho protected routes
5. **Clear naming**: Tên file = tên group routes
