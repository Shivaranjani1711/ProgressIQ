import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          Study Tracker
        </Link>
        {user && (
          <div className="navbar__links">
            <Link to="/">Dashboard</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/quiz-history">Quiz History</Link>
            <Link to="/saved">Saved</Link>
          </div>
        )}
      </div>
      {user && (
        <div className="navbar__right">
          {user.currentStreak > 0 && (
            <span className="streak-badge" title={`Longest streak: ${user.longestStreak} days`}>
              {user.currentStreak} day{user.currentStreak === 1 ? '' : 's'}
            </span>
          )}
          <span className="navbar__user">{user.name}</span>
          <button className="btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
