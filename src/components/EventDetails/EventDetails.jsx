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
          <span className="icon" aria-hidden="true">🕰️</span>
          <h3>When</h3>
          <p>{EVENT.eventDate.date}</p>
          <p>{EVENT.eventDate.time}</p>
        </article>
        <article>
          <span className="icon" aria-hidden="true">🗺️</span>
          <h3>Where</h3>
          <p><a href="https://maps.app.goo.gl/mFN1ebh66kPyQ4QN8" target="_blank" rel="noreferrer">{EVENT.location.street}</a></p>
          <p>{EVENT.location.city}</p>
        </article>
        <article>
          <span className="icon" aria-hidden="true">💭</span>
          <h3>Good to know</h3>
          <p>German snacks and treats from <a href="https://riekersmeats.com/" target="_blank" rel="noreferrer">Rieker's Prime Meats</a> will be served.</p>
          <p>Families and kids are welcome!</p>
        </article>
        <article>
          <span className="icon" aria-hidden="true">📧</span>
          <h3>Questions?</h3>
          <p>Host: {EVENT.contact.name}</p>
          <p>
            <a href={`mailto:${EVENT.contact.email}`} className="contact-link">
              {EVENT.contact.email}
            </a>
          </p>
        </article>
      </div>
    </section>
  );
}
