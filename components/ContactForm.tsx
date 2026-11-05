import { asset } from '../lib/asset';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../data/services';
import { SITE } from '../data/site';
import { tr, useLang } from '../lib/i18n';

const AREAS = [
  { id: 'Marketing', bs: 'Marketing', en: 'Marketing' },
  { id: 'BonEvents', bs: 'BonEvents (događaji)', en: 'BonEvents (events)' },
  { id: 'Bonexis', bs: 'Bonexis (AI rješenja)', en: 'Bonexis (AI solutions)' },
] as const;
const BUDGETS = [
  ['Do 500 KM', 'Up to 500 KM'], ['500 – 1.500 KM', '500 – 1,500 KM'], ['1.500 – 5.000 KM', '1,500 – 5,000 KM'],
  ['Više od 5.000 KM', 'Over 5,000 KM'], ['Nisam siguran', 'Not sure'],
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [params] = useSearchParams();
  const { lang, t, to } = useLang();
  const pre = params.get('usluga') ?? '';
  const preService = SERVICES.find(s => s.title === pre);
  const [area, setArea] = useState<string>(AREAS.some(a => a.id === pre) ? pre : preService ? 'Marketing' : '');
  const [services, setServices] = useState<string[]>(preService ? [preService.title] : []);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const toggle = (s: string) => setServices(cur => (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!area) { setError(t('Odaberite oblast upita.', 'Choose what your inquiry is about.')); return; }
    setError(''); setStatus('sending');
    try {
      const res = await fetch(asset('/contact.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, services: [area, ...(area === 'Marketing' ? services : [])], lang }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || t('Slanje nije uspjelo.', 'Sending failed.'));
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('Slanje nije uspjelo.', 'Sending failed.'));
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={48} />
        <h3>{t('Hvala, upit je poslan!', 'Thank you, your inquiry has been sent!')}</h3>
        <p>{t('Javit ćemo vam se u najkraćem roku, najčešće isti ili sljedeći radni dan. Kopiju upita smo poslali i na vaš email.', 'We will get back to you shortly, usually the same or the next working day. A copy of your inquiry has been sent to your email.')}</p>
        <button className="btn btn-secondary" onClick={() => setStatus('idle')}>{t('Pošalji novi upit', 'Send another inquiry')}</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <fieldset className="field">
        <legend>{t('Upit se odnosi na', 'Your inquiry is about')} <span aria-hidden="true">*</span></legend>
        <div className="chips">
          {AREAS.map(a => (
            <label key={a.id} className={`chip ${area === a.id ? 'is-on' : ''}`}>
              <input type="radio" name="area" value={a.id} checked={area === a.id} onChange={() => setArea(a.id)} required />
              {a[lang]}
            </label>
          ))}
        </div>
      </fieldset>

      {area === 'Marketing' && (
        <fieldset className="field">
          <legend>{t('Koje usluge?', 'Which services?')} <small>{t('(opcionalno)', '(optional)')}</small></legend>
          <div className="chips">
            {SERVICES.map(s => (
              <label key={s.slug} className={`chip ${services.includes(s.title) ? 'is-on' : ''}`}>
                <input type="checkbox" checked={services.includes(s.title)} onChange={() => toggle(s.title)} />
                {tr(s, lang).title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="field-row">
        <label className="field">
          <span>{t('Ime i prezime', 'Full name')} <span aria-hidden="true">*</span></span>
          <input name="name" required autoComplete="name" maxLength={120} />
        </label>
        <label className="field">
          <span>{t('Firma', 'Company')}</span>
          <input name="company" autoComplete="organization" maxLength={120} />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Email <span aria-hidden="true">*</span></span>
          <input name="email" type="email" required autoComplete="email" maxLength={160} />
        </label>
        <label className="field">
          <span>{t('Telefon', 'Phone')} <small>{t('(opcionalno)', '(optional)')}</small></span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label className="field">
        <span>{t('Okvirni budžet', 'Approximate budget')} <small>{t('(opcionalno)', '(optional)')}</small></span>
        <select name="budget" defaultValue="">
          <option value="">{t('Odaberite…', 'Choose…')}</option>
          {BUDGETS.map(b => <option key={b[0]} value={b[0]}>{lang === 'en' ? b[1] : b[0]}</option>)}
        </select>
      </label>
      <label className="field">
        <span>{t('Poruka', 'Message')} <span aria-hidden="true">*</span></span>
        <textarea name="message" required rows={5} maxLength={5000} placeholder={t('Ukratko opišite projekat, rok i ciljeve.', 'Briefly describe the project, timeline and goals.')} />
      </label>

      {/* Zamka za botove: skriveno od ljudi i čitača ekrana */}
      <div className="hp" aria-hidden="true">
        <label>Ne popunjavajte <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>{t('Slažem se da Bonaco Media koristi moje podatke kako bi odgovorila na upit.', 'I agree that Bonaco Media may use my details to respond to my inquiry.')} <Link to={to('/politika-privatnosti/')}>{t('Politika privatnosti', 'Privacy policy')}</Link></span>
      </label>

      {error && <p className="form-error" role="alert">{error}{status === 'error' && <> {t('Možete nam pisati i direktno na', 'You can also email us directly at')} <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</>}</p>}

      <button className="btn btn-primary btn-lg" disabled={status === 'sending'}>
        {status === 'sending' ? t('Šaljem…', 'Sending…') : t('Pošaljite upit', 'Send inquiry')}
      </button>
    </form>
  );
}
