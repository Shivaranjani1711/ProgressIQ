import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function QuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/attempts')
      .then((res) => setAttempts(res.data))
      .catch(() => setError('Could not load your quiz history.'))
      .finally(() => setLoading(false));
  }, []);

  // Average accuracy per category, computed client-side from the attempt list
  const categoryTrend = useMemo(() => {
    const totals = {}; // category -> { score, total }
    attempts.forEach((a) => {
      const category = a.quiz?.topic?.category;
      if (!category) return;
      totals[category] = totals[category] || { score: 0, total: 0 };
      totals[category].score += a.score;
      totals[category].total += a.total;
    });
    return Object.entries(totals)
      .map(([category, v]) => ({ category, percent: v.total > 0 ? Math.round((v.score / v.total) * 100) : 0 }))
      .sort((a, b) => b.percent - a.percent);
  }, [attempts]);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Quiz history</h1>
          <p>Every self-check quiz you've taken, plus your average accuracy by category.</p>
        </div>

        {loading && <div className="loading">Loading quiz history...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && attempts.length === 0 && (
          <div className="empty">
            No quiz attempts yet. Mark a topic completed on a roadmap to trigger a self-check quiz.
          </div>
        )}

        {categoryTrend.length > 0 && (
          <>
            <div className="section-title">Average accuracy by category</div>
            <div className="bar-list">
              {categoryTrend.map((c) => (
                <div className="bar-row" key={c.category}>
                  <div className="bar-row__head">
                    <span className="bar-row__label">{c.category}</span>
                    <span className="bar-row__count">{c.percent}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${c.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {attempts.length > 0 && (
          <>
            <div className="section-title">Recent attempts</div>
            <div className="attempt-list">
              {attempts.map((a) => {
                const percent = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
                return (
                  <div className="attempt-row" key={a._id}>
                    <div>
                      <div className="attempt-row__topic">{a.quiz?.topic?.title || a.quiz?.title}</div>
                      <div className="attempt-row__meta">
                        {new Date(a.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className={`attempt-row__score ${percent >= 70 ? 'high' : percent < 50 ? 'low' : ''}`}>
                      {a.score}/{a.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
