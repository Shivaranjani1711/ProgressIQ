import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/roadmaps')
      .then((res) => setRoadmaps(res.data))
      .catch(() => setError('Could not load roadmaps. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Hi {user?.name?.split(' ')[0]}, pick a path</h1>
          <p>Each roadmap is an ordered set of topics — click one to start tracking progress.</p>
        </div>

        {loading && <div className="loading">Loading roadmaps...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && (
          <div className="roadmap-grid">
            {roadmaps.map((r) => (
              <button key={r._id} className="roadmap-card" onClick={() => navigate(`/roadmaps/${r._id}`)}>
                <span className="roadmap-card__goal">{r.goal}</span>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <span className="roadmap-card__count">{r.topicCount} topics</span>
              </button>
            ))}
          </div>
        )}

        {!loading && !error && roadmaps.length === 0 && (
          <div className="empty">
            No roadmaps yet. Run <code>npm run seed</code> in the backend to load the dataset.
          </div>
        )}
      </div>
    </>
  );
}
