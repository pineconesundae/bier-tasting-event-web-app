import './styles.css';

export default function Rules() {
  return (
    <section className="rules" aria-labelledby="rules-title">
      <div className="rules-copy">
        <p className="section-kicker">What to bring</p>
        <h2 id="rules-title">Your bier is your tasting ticket.</h2>
        <p>Each signup brings one unique, authentic <strong>Märzen</strong> or <strong>Festbier</strong>. "Oktoberfest-style" beers that are neither style aren't part of this tasting. Pumpkin beers are grounds for ejection.</p>
        <p>When you arrive, exchange your bier for a tasting ticket. Keep this safe so you can trade it for a set of anonymized tasting samples later.</p>
      </div>
      <div className="package-card">
        <p className="label">Choose one</p>
        <div>
          <strong>6</strong>
          <span>12 oz bottles</span>
        </div>
        <em>or</em>
        <div>
          <strong>4</strong>
          <span>16 oz "pounder" cans</span>
        </div>
      </div>
    </section>
  );
}
