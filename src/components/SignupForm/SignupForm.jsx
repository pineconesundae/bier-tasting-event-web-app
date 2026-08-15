import { useState } from 'react';
import { STYLE } from '../../constants/beer.js';
import './styles.css';

const EMPTY_FORM = { attendeeName: '', brewery: '', beerName: '', style: '', packageType: '' };

export default function SignupForm({ onSignupSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setNotice({ type: '', text: '' });
    try {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'We could not save your signup.');
      setForm(EMPTY_FORM);
      setNotice({ type: 'success', text: 'Prost! Your bier is officially on the tasting table.' });
      if (onSignupSuccess) {
        await onSignupSuccess();
      }
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="signup" id="signup" aria-labelledby="signup-title">
      <div className="signup-intro">
        <p className="section-kicker">Add to the lineup</p>
        <h2 id="signup-title">Claim your bier</h2>
        <p>Picked up a good one? Put your name on it before someone else does. No duplicates allowed!</p>
        <p className="privacy">Your signup will be visible to everyone with this private event link.</p>
      </div>
      <form onSubmit={submit}>
        {notice.text && (
          <div className={`notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
            {notice.text}
          </div>
        )}
        <label>
          Your name
          <input
            name="attendeeName"
            value={form.attendeeName}
            onChange={update}
            maxLength="80"
            autoComplete="name"
            required
            placeholder="e.g. Anna Schmidt"
          />
        </label>
        <div className="form-row">
          <label>
            Brewery
            <input
              name="brewery"
              value={form.brewery}
              onChange={update}
              maxLength="100"
              required
              placeholder="e.g. Ayinger"
            />
          </label>
          <label>
            Bier name
            <input
              name="beerName"
              value={form.beerName}
              onChange={update}
              maxLength="120"
              required
              placeholder="e.g. Oktober Fest-Märzen"
            />
          </label>
        </div>
        <fieldset>
          <legend>Bier style</legend>
          <div className="choice-row">
            <label className="choice">
              <input
                type="radio"
                name="style"
                value="marzen"
                checked={form.style === 'marzen'}
                onChange={update}
                required
              />
              <span>
                <strong>{STYLE.marzen}</strong>
                <small>Amber, toasty &amp; rich</small>
              </span>
            </label>
            <label className="choice">
              <input
                type="radio"
                name="style"
                value="festbier"
                checked={form.style === 'festbier'}
                onChange={update}
              />
              <span>
                <strong>{STYLE.festbier}</strong>
                <small>Golden, crisp &amp; smooth</small>
              </span>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Package</legend>
          <div className="choice-row">
            <label className="choice">
              <input
                type="radio"
                name="packageType"
                value="six_pack_bottles"
                checked={form.packageType === 'six_pack_bottles'}
                onChange={update}
                required
              />
              <span>
                <strong>6 × 12 oz</strong>
                <small>Bottles</small>
              </span>
            </label>
            <label className="choice">
              <input
                type="radio"
                name="packageType"
                value="four_pack_cans"
                checked={form.packageType === 'four_pack_cans'}
                onChange={update}
              />
              <span>
                <strong>4 × 16 oz</strong>
                <small>Pounder cans</small>
              </span>
            </label>
          </div>
        </fieldset>
        <button className="button submit" disabled={submitting}>
          {submitting ? 'Claiming…' : 'Claim this bier'} <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}
