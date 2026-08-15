import { EVENT } from '../../constants/event.js';
import './styles.css';

export default function EventDetails() {
  return (
    <section className="event-section" aria-labelledby="details-title">
      <div>
        <p className="section-kicker">Save the date</p>
        <h2 id="details-title">The gathering</h2>
      </div>
      <div className="event-grid">
        <article>
          <span className="icon" aria-hidden="true">◷</span>
          <h3>When</h3>
          <p>{EVENT.eventDate.date}</p>
          <p>{EVENT.eventDate.time}</p>
        </article>
        <article>
          <span className="icon" aria-hidden="true">⌖</span>
          <h3>Where</h3>
          <p>{EVENT.location.street}</p>
          <p>{EVENT.location.city}</p>
        </article>
        <article>
          <span className="icon" aria-hidden="true">✦</span>
          <h3>Good to know</h3>
          <p>German snacks and treats from <a href="https://riekersmeats.com/" target="_blank">Rieker's Prime Meats</a> will be served.</p>
          <p>Families and kids are welcome!</p>
        </article>
      </div>
    </section>
  );
}
