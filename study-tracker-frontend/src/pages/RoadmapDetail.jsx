import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuizModal from '../components/QuizModal';
import PathNode from '../components/PathNode';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../quiz.css';

export default function RoadmapDetail() {
  const { id } = useParams();
  const { refreshUser } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [progressMap, setProgressMap] = useState({}); // topicId -> status
  const [bookmarkMap, setBookmarkMap] = useState({}); // topicId -> boolean
  const [noteMap, setNoteMap] = useState({}); // topicId -> content
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeQuiz, setActiveQuiz] = useState(null); // { quiz, topicTitle } | null

  useEffect(() => {
    Promise.all([api.get(`/roadmaps/${id}`), api.get('/progress'), api.get('/notes')])
      .then(([roadmapRes, progressRes, notesRes]) => {
        setRoadmap(roadmapRes.data);

        const pMap = {};
        const bMap = {};
        progressRes.data.forEach((p) => {
          const topicId = p.topic?._id || p.topic;
          pMap[topicId] = p.status;
          bMap[topicId] = !!p.bookmarked;
        });
        setProgressMap(pMap);
        setBookmarkMap(bMap);

        const nMap = {};
        notesRes.data.forEach((n) => {
          nMap[n.topic?._id || n.topic] = n.content;
        });
        setNoteMap(nMap);
      })
      .catch(() => setError('Could not load this roadmap.'))
      .finally(() => setLoading(false));
  }, [id]);

  const setStatus = async (topicId, status, topicTitle) => {
    setProgressMap((prev) => ({ ...prev, [topicId]: status }));
    try {
      await api.post(`/progress/${topicId}`, { status });
      refreshUser(); // pick up any streak change for the navbar badge
    } catch {
      setError('Could not save progress. Try again.');
      return;
    }

    if (status === 'completed') {
      try {
        const { data } = await api.get(`/quizzes/topic/${topicId}`);
        setActiveQuiz({ quiz: data, topicTitle });
      } catch (err) {
        if (err.response?.status !== 404) {
          setError('Could not load the quiz for this topic.');
        }
      }
    }
  };

  const toggleBookmark = async (topicId, bookmarked) => {
    setBookmarkMap((prev) => ({ ...prev, [topicId]: bookmarked }));
    try {
      await api.patch(`/progress/${topicId}/bookmark`, { bookmarked });
    } catch {
      setError('Could not update bookmark.');
    }
  };

  const saveNote = async (topicId, content) => {
    setNoteMap((prev) => ({ ...prev, [topicId]: content }));
    try {
      await api.post(`/notes/${topicId}`, { content });
    } catch {
      setError('Could not save note.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page">
          <div className="loading">Loading roadmap...</div>
        </div>
      </>
    );
  }

  if (error && !roadmap) {
    return (
      <>
        <Navbar />
        <div className="page">
          <div className="error-banner">{error}</div>
        </div>
      </>
    );
  }

  const completedCount = roadmap.topics.filter((t) => progressMap[t._id] === 'completed').length;

  return (
    <>
      <Navbar />
      <div className="page">
        <Link to="/" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← All roadmaps
        </Link>

        <div className="page-header" style={{ marginTop: 12 }}>
          <h1>{roadmap.title}</h1>
          <p>
            {roadmap.description} · {completedCount} / {roadmap.topics.length} completed
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="path">
          {roadmap.topics.map((topic, i) => (
            <PathNode
              key={topic._id}
              topic={topic}
              index={i}
              status={progressMap[topic._id] || 'not_started'}
              bookmarked={!!bookmarkMap[topic._id]}
              note={noteMap[topic._id]}
              onStatusChange={setStatus}
              onToggleBookmark={toggleBookmark}
              onSaveNote={saveNote}
            />
          ))}
        </div>
      </div>

      {activeQuiz && (
        <QuizModal
          topicTitle={activeQuiz.topicTitle}
          quiz={activeQuiz.quiz}
          onClose={() => {
            setActiveQuiz(null);
            refreshUser();
          }}
        />
      )}
    </>
  );
}
