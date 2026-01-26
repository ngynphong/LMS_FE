import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col w-full">
      <Header />
      <main className="flex-1 w-full">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
