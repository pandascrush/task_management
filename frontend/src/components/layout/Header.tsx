import { useAuth } from '../../hooks/useAuth';

const Header = ({ title }: { title: string }) => {
  const { user } = useAuth();
  
  return (
    <header className="main-header animate-in">
      <h1 className="page-title">{title}</h1>
      <div className="header-greeting">
        Welcome, <strong>{user?.name}</strong>
      </div>
    </header>
  );
};

export default Header;
