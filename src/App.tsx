import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import routes from "./routes";
import "./App.css";

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
            <div className="flex h-screen items-center justify-center">
              Đang tải...
            </div>
          }
        >
          <AppRoutes />
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
