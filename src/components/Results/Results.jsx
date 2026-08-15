import './styles.css';

export default function Results() {
  return (
    <section className="results" id="results" aria-labelledby="results-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">The leaderboard</p>
          <h2 id="results-title">Tasting Results &amp; Rankings</h2>
        </div>
        <span className="status-badge">Tasting Pending</span>
      </div>

      <div className="winner-card">
        <div className="trophy-badge" aria-hidden="true">🏆</div>
        <div className="winner-info">
          <p className="winner-label">2026 Oktoberfest Champion</p>
          <h3 className="winner-name">To Be Announced</h3>
          <p className="winner-desc">
            The undisputed Oktoberfest bier champion will be crowned right here once blind tasting scores are tallied on September 19, 2026.
          </p>
        </div>
      </div>

      <div className="rankings-placeholder">
        <div className="rankings-header">
          <h3>Full Lineup Rankings</h3>
          <span className="tbd-pill">Results posted after tasting</span>
        </div>
        <p className="rankings-note">
          Every registered attendee will sample and score anonymized entries. Full rankings, scores, and tasting notes will be published here following the event.
        </p>
        <div className="podium-preview" aria-hidden="true">
          <div className="podium-item second">
            <span className="medal">🥈</span>
            <span className="place">2nd Place</span>
            <span className="tbd">TBD</span>
          </div>
          <div className="podium-item first">
            <span className="medal">🥇</span>
            <span className="place">1st Place</span>
            <span className="tbd">TBD</span>
          </div>
          <div className="podium-item third">
            <span className="medal">🥉</span>
            <span className="place">3rd Place</span>
            <span className="tbd">TBD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
