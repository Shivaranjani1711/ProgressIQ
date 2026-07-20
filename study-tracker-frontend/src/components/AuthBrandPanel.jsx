export default function AuthBrandPanel() {
  return (
    <div className="auth-brand">
      <div className="auth-brand__logo">Study Tracker</div>

      <div className="auth-brand__copy">
        <h2>Every subject has a path. See yours.</h2>
        <p>
          Track topics across curated roadmaps, mark your progress, and test
          yourself along the way — one connected path at a time.
        </p>
      </div>

      <svg width="100%" height="160" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M10 130 C 80 130, 80 60, 150 60 S 220 130, 290 100 S 360 30, 390 30"
          stroke="#2f5a4f"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
        <circle cx="10" cy="130" r="6" fill="#0f7b6c" />
        <circle cx="150" cy="60" r="6" fill="#0f7b6c" />
        <circle cx="290" cy="100" r="6" fill="#e8a33d" />
        <circle cx="390" cy="30" r="6" fill="#3a4f49" stroke="#eef4f1" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
