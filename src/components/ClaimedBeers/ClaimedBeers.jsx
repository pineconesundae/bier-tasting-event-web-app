import { STYLE } from '../../constants/beer.js';
import './styles.css';

export default function ClaimedBeers({ signups, loading, error, onRetry, isAdmin, onEdit, onDelete }) {
  return (
    <section className="claimed" aria-labelledby="claimed-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">The tasting table</p>
          <h2 id="claimed-title">Biers already claimed</h2>
        </div>
        <span className="count">{signups.length} bier{signups.length !== 1 && 's'}</span>
      </div>
      {loading && <p className="state" role="status">Checking the cellar…</p>}
      {error && (
        <div className="state error" role="alert">
          {error} <button type="button" onClick={onRetry}>Try again</button>
        </div>
      )}
      {!loading && !error && signups.length === 0 && (
        <p className="state empty">The tasting table is wide open. Be the first to claim a beer!</p>
      )}
      {!loading && !error && signups.length > 0 && (
        <div className="table-wrapper">
          <table className="beer-table">
            <thead>
              <tr>
                <th scope="col" className="col-num">#</th>
                <th scope="col">Bier Name</th>
                <th scope="col">Brewery</th>
                <th scope="col">Style</th>
                <th scope="col">Claimed by</th>
                {isAdmin && <th scope="col" className="col-actions">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {signups.map((beer, index) => (
                <tr key={beer.id}>
                  <td className="col-num">
                    <span className="number">{String(index + 1).padStart(2, '0')}</span>
                  </td>
                  <td className="beer-cell">
                    <strong className="beer-name">{beer.beer_name}</strong>
                  </td>
                  <td className="brewery-cell">{beer.brewery}</td>
                  <td>
                    <span className="style-pill">{STYLE[beer.style] || beer.style}</span>
                  </td>
                  <td className="attendee-cell">{beer.attendee_name}</td>
                  {isAdmin && (
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        onClick={() => onEdit(beer)}
                        title="Edit this entry"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-btn"
                        onClick={() => onDelete(beer)}
                        title="Delete this entry"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
