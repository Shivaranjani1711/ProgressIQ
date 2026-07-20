import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Saved() {
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/progress?bookmarked=true'), api.get('/notes')])
      .then(([bookmarksRes, notesRes]) => {
        setBookmarks(bookmarksRes.data);
        setNotes(notesRes.data);
      })
      .catch(() => setError('Could not load your saved items.'))
      .finally(() => setLoading(false));
  }, []);

  // Union of bookmarked topics and topics with a note, keyed by topic id,
  // so a note without a bookmark (or vice versa) still shows up once.
  const byTopicId = new Map();
  bookmarks.forEach((b) => {
    if (!b.topic) return;
    byTopicId.set(b.topic._id, { topic: b.topic, bookmarked: true, note: null });
  });
  notes.forEach((n) => {
    if (!n.topic) return;
    const existing = byTopicId.get(n.topic._id);
    if (existing) existing.note = n.content;
    else byTopicId.set(n.topic._id, { topic: n.topic, bookmarked: false, note: n.content });
  });
  const items = Array.from(byTopicId.values());

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Saved</h1>
          <p>Bookmarked topics and notes, all in one place.</p>
        </div>

        {loading && <div className="loading">Loading saved items...</div>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="empty">
            Nothing saved yet. Bookmark a topic or add a note from any roadmap page.
          </div>
        )}

        {items.map((item) => (
          <div className="saved-item" key={item.topic._id}>
            <div className="saved-item__title">
              {item.bookmarked && '★ '}
              {item.topic.title}
              {item.topic.category && ` · ${item.topic.category}`}
            </div>
            {item.note && <div className="saved-item__note">{item.note}</div>}
          </div>
        ))}
      </div>
    </>
  );
}
