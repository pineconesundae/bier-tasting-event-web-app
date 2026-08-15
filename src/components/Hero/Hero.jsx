import { EVENT } from '../../constants/event.js';
import './styles.css';

export default function Hero() {
  return (
    <header className="hero">
      <nav aria-label="Primary">
        <a className="brand" href="#top">🍺 OKTOBERFEST</a>
        <a href="#signup">Claim a bier</a>
      </nav>
      <div className="hero-inner" id="top">
        <p className="eyebrow">{EVENT.eyebrow}</p>
        <h1>{EVENT.title}<span>{EVENT.subtitle}</span></h1>
        <p className="intro">Bring bier. Drink bier. Help determine what is the undisputed Oktoberfest bier champion of the season.</p>
        <a className="button gold" href="#signup">Choose your bier <span aria-hidden="true">↓</span></a>
      </div>
      <div className="scallop" aria-hidden="true" />
    </header>
  );
}
