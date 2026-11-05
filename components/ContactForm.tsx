import { asset } from '../lib/asset';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../data/services';
import { SITE } from '../data/site';

const SERVICE_OPTIONS = [...SERVICES.map(s => s.title), 'Bonexis', 'Nešto drugo'];
const BUDGETS = ['Do 500 KM', '500 – 1.500 KM', '1.500 – 5.000 KM', 'Više od 5.000 KM', 'Nisam siguran'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [params] = useSearchParams();
  const pre = params.get('usluga');
  const [services, setServices] = useState<string[]>(pre && SERVICE_OPTIONS.includes(pre) ? [pre] : []);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const toggle = (s: string) => setServices(cur => (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!services.length) { setError('Odaberite barem jednu uslugu.'); return; }
    setError(''); setStatus('sending');
    try {
      const res = await fetch(asset('/contact.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, services }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Slanje nije uspjelo.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Slanje nije uspjelo.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={48} />
        <h3>Hvala, upit je poslan!</h3>
        <p>Javit ćemo vam se u najkraćem roku, najčešće isti ili sljedeći radni dan. Kopiju upita smo poslali i na vaš email.</p>
        <button className="btn btn-secondary" onClick={() => setStatus('idle')}>Pošalji novi upit</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <fieldset className="field">
        <legend>Šta vam treba? <span aria-hidden="true">*</span></legend>
        <div className="chips">
          {SERVICE_OPTIONS.map(s => (
            <label key={s} className={`chip ${services.includes(s) ? 'is-on' : ''}`}>
              <input type="checkbox" checked={services.includes(s)} onChange={() => toggle(s)} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field-row">
        <label className="field">
          <span>Ime i prezime <span aria-hidden="true">*</span></span>
          <input name="name" required autoComplete="name" maxLength={120} />
        </label>
        <label className="field">
          <span>Firma</span>
          <input name="company" autoComplete="organization" maxLength={120} />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Email <span aria-hidden="true">*</span></span>
          <input name="email" type="email" required autoComplete="email" maxLength={160} />
        </label>
        <label className="field">
          <span>Telefon <small>(opcionalno)</small></span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label className="field">
        <span>Okvirni budžet <small>(opcionalno)</small></span>
        <select name="budget" defaultValue="">
          <option value="">Odaberite…</option>
          {BUDGETS.map(b => <option key={b}>{b}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Poruka <span aria-hidden="true">*</span></span>
        <textarea name="message" required rows={5} maxLength={5000} placeholder="Ukratko opišite projekat, rok i ciljeve." />
      </label>

      {/* Zamka za botove: skriveno od ljudi i čitača ekrana */}
      <div className="hp" aria-hidden="true">
        <label>Ne popunjavajte <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>Slažem se da Bonaco Media koristi moje podatke kako bi odgovorila na upit. <Link to="/politika-privatnosti/">Politika privatnosti</Link></span>
      </label>

      {error && <p className="form-error" role="alert">{error}{status === 'error' && <> Možete nam pisati i direktno na <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</>}</p>}

      <button className="btn btn-primary btn-lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Šaljem…' : 'Pošaljite upit'}
      </button>
    </form>
  );
}
