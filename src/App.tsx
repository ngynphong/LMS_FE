import { BrowserRouter, useRoutes, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';
import routes, { isAuthPath } from './routes';
import './App.css';

function AppRoutes() {
  const element = useRoutes(routes);
  const location = useLocation();
  
  // Check if current page should NOT have header/footer
  if (isAuthPath(location.pathname)) {
    return element;
  }
  
  // Wrap with MainLayout for other pages
  return <MainLayout>{element}</MainLayout>;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen font-['Lexend'] text-[#111418]">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
