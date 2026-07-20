import { useState } from 'react';
import api from '../api/axios';

/**
 * Shown after a user marks a topic completed. Fetches the quiz for that
 * topic (if one exists), lets them answer, then submits and shows a
 * scored breakdown with explanations.
 */
export default function QuizModal({ topicTitle, quiz, onClose }) {
  const [selected, setSelected] = useState({}); // questionId -> selectedIndex
  const [result, setResult] = useState(null); // response from submit
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const allAnswered = quiz.questions.every((q) => selected[q._id] !== undefined);

  const handleSelect = (questionId, index) => {
    if (result) return; // lock answers after submitting
    setSelected((prev) => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const answers = Object.entries(selected).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      }));
      const { data } = await api.post(`/quizzes/${quiz._id}/submit`, { answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit quiz. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resultFor = (questionId) => result?.results.find((r) => r.questionId === questionId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-modal__header">
          <h2>{quiz.title}</h2>
          <button className="quiz-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="quiz-modal__sub">
          Quick self-check on {topicTitle} — {quiz.questions.length} questions.
        </div>

        {error && <div className="error-banner">{error}</div>}

        {result && (
          <div className="quiz-score">
            <div className="quiz-score__number">
              {result.score}/{result.total}
            </div>
            <div className="quiz-score__label">
              {result.score === result.total
                ? "Perfect score — you've got this topic down."
                : 'Review the explanations below for what to revisit.'}
            </div>
          </div>
        )}

        {quiz.questions.map((q, i) => {
          const r = resultFor(q._id);
          return (
            <div className="quiz-question" key={q._id}>
              <div className="quiz-question__text">
                {i + 1}. {q.questionText}
              </div>
              {q.options.map((option, idx) => {
                const isSelected = selected[q._id] === idx;
                let className = 'quiz-option';
                if (isSelected && !result) className += ' selected';
                if (result) {
                  if (idx === r.correctIndex) className += ' correct';
                  else if (isSelected && idx !== r.correctIndex) className += ' incorrect';
                }
                return (
                  <label className={className} key={idx}>
                    <input
                      type="radio"
                      name={q._id}
                      checked={isSelected}
                      onChange={() => handleSelect(q._id, idx)}
                      disabled={!!result}
                    />
                    {option}
                  </label>
                );
              })}
              {result && <div className="quiz-explanation">{r.explanation}</div>}
            </div>
          );
        })}

        <div className="quiz-modal__footer">
          {!result ? (
            <>
              <button className="btn-ghost" onClick={onClose}>
                Skip for now
              </button>
              <button className="btn btn-primary" style={{ width: 'auto' }} disabled={!allAnswered || submitting} onClick={handleSubmit}>
                {submitting ? 'Submitting...' : 'Submit answers'}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
