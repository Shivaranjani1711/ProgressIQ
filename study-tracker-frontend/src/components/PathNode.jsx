import { useState } from 'react';

const STATUSES = [
  { key: 'not_started', label: 'Not started' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
];

export default function PathNode({
  topic,
  index,
  status,
  bookmarked,
  note,
  onStatusChange,
  onToggleBookmark,
  onSaveNote,
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState(note || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSaveNote(topic._id, draft);
    setSaving(false);
    setNoteOpen(false);
  };

  return (
    <div className={`path-node ${status}`}>
      <div className="path-node__dot">{status === 'completed' ? '✓' : index + 1}</div>
      <div className="path-node__title">{topic.title}</div>
      <div className="path-node__meta">
        {topic.difficulty} · ~{topic.estimatedHours}h
        {topic.resources?.[0] && (
          <>
            {' · '}
            <a href={topic.resources[0].url} target="_blank" rel="noreferrer">
              {topic.resources[0].title}
            </a>
          </>
        )}
      </div>

      <div className="path-node__actions">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            className={`chip ${status === s.key ? 'active' : ''}`}
            onClick={() => onStatusChange(topic._id, s.key, topic.title)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="path-node__toolbar">
        <button
          className={`icon-btn ${bookmarked ? 'active' : ''}`}
          onClick={() => onToggleBookmark(topic._id, !bookmarked)}
        >
          {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
        </button>
        <button className="icon-btn" onClick={() => setNoteOpen((v) => !v)}>
          {note ? 'Edit note' : '+ Add note'}
        </button>
      </div>

      {noteOpen && (
        <div className="note-box">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Jot down a quick note or a resource link for this topic..."
          />
          <div className="note-box__actions">
            <button className="btn-sm" onClick={() => setNoteOpen(false)}>
              Cancel
            </button>
            <button className="btn-sm primary" onClick={handleSave} disabled={saving || !draft.trim()}>
              {saving ? 'Saving...' : 'Save note'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
