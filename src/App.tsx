import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import routes from "./routes";
import "./App.css";
import LoadingOverlay from "./components/common/LoadingOverlay";

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen font-['Lexend'] text-[#111418]">
        <React.Suspense
          fallback={
            <LoadingOverlay isLoading={true} message="Đang tải trang" />
          }
        >
          <AppRoutes />
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
