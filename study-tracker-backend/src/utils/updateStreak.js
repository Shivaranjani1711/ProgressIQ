/**
 * Updates a user's streak based on today's activity (marking progress or
 * submitting a quiz both count). Stores dates as YYYY-MM-DD strings so
 * comparisons don't have to deal with time-of-day or timezones.
 */
const todayKey = () => new Date().toISOString().slice(0, 10);

const daysBetween = (a, b) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
};

const updateStreak = async (user) => {
  const today = todayKey();

  if (!user.lastActiveDate) {
    user.currentStreak = 1;
  } else {
    const gap = daysBetween(user.lastActiveDate, today);
    if (gap === 0) {
      // already active today - streak unchanged
    } else if (gap === 1) {
      user.currentStreak += 1;
    } else if (gap > 1) {
      user.currentStreak = 1; // streak broken, restart
    }
    // gap < 0 (clock skew) is ignored - leave streak as-is
  }

  user.lastActiveDate = today;
  user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  await user.save();

  return { currentStreak: user.currentStreak, longestStreak: user.longestStreak };
};

module.exports = updateStreak;
