import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LuMenu, LuX } from 'react-icons/lu';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <LuX size={24} /> : <LuMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
