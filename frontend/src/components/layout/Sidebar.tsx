import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, LuLogOut, LuLayoutGrid 
} from 'react-icons/lu';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <LuLayoutGrid size={24} />
        </div>
        <span className="brand-name">TaskFlow</span>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LuLayoutDashboard size={18} />
            <span>Admin Panel</span>
          </NavLink>
        ) : (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LuLayoutDashboard size={18} />
            <span>My Tasks</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className={`role-badge ${user?.role.toLowerCase()}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button className="btn-logout" onClick={logout} title="Logout">
          <LuLogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
