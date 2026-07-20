import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/progress/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Could not load your analytics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Your progress analytics</h1>
          <p>A breakdown of what you've covered so far, by category and by roadmap.</p>
        </div>

        {loading && <div className="loading">Loading analytics...</div>}
        {error && <div className="error-banner">{error}</div>}

        {summary && (
          <>
            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-card__number">{summary.completedTopics}</div>
                <div className="stat-card__label">Topics completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__number">{summary.inProgressTopics}</div>
                <div className="stat-card__label">In progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__number">{summary.totalTopics}</div>
                <div className="stat-card__label">Total topics available</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__number">{summary.streak.current}</div>
                <div className="stat-card__label">Day streak (best: {summary.streak.longest})</div>
              </div>
            </div>

            <div className="section-title">By category</div>
            <div className="bar-list">
              {summary.categoryBreakdown
                .sort((a, b) => b.total - a.total)
                .map((c) => (
                  <div className="bar-row" key={c.category}>
                    <div className="bar-row__head">
                      <span className="bar-row__label">{c.category}</span>
                      <span className="bar-row__count">
                        {c.completed} / {c.total}
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${c.total > 0 ? (c.completed / c.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="section-title">By roadmap</div>
            <div className="bar-list">
              {summary.roadmapBreakdown
                .filter((r) => r.total > 0)
                .sort((a, b) => b.percent - a.percent)
                .map((r) => (
                  <div className="bar-row" key={r.roadmapId}>
                    <div className="bar-row__head">
                      <span className="bar-row__label" style={{ textTransform: 'none' }}>
                        {r.title}
                      </span>
                      <span className="bar-row__count">
                        {r.completed} / {r.total} ({r.percent}%)
                      </span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${r.percent}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
