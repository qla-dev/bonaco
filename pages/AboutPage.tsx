import SEO from '../components/SEO';
import { BrandOrbit, EditorialIntro, ClientClouds, ContactBand } from '../components/ReferenceSections';
import { useLang } from '../lib/i18n';

export default function AboutPage() {
  const { t } = useLang();
  const approach = [
    { title: t('Prvo slušamo.', 'First, we listen.'), text: t('Upoznajemo vaš brend, publiku i ono što želite promijeniti. Dobra strategija počinje pravim pitanjima, jasnim ciljem i razumijevanjem ljudi kojima se obraćamo.', 'We get to know your brand, audience and what you want to change. A good strategy starts with the right questions, a clear goal and an understanding of the people we want to reach.') },
    { title: t('Zatim povezujemo.', 'Then, we connect.'), text: t('Dizajn, tekst, fotografija, video i oglašavanje rade zajedno. Od objave na telefonu do događaja uživo, tražimo isti prepoznatljiv karakter vašeg brenda.', 'Design, copy, photography, video and advertising work together. From a post on a phone to a live event, we bring the same recognisable brand character to every touchpoint.') },
    { title: t('I ostajemo uključeni.', 'And we stay involved.'), text: t('Razmjenjujemo ideje, pratimo reakcije publike i unapređujemo naredni korak. Saradnju gradimo kroz otvoren razgovor, pažnju prema detaljima i kontinuitet.', 'We share ideas, listen to your audience and refine the work as we go. Open communication, attention to detail and consistency shape every partnership.') },
  ];
  return (
    <div className="ref-page ref-about">
      <SEO title={t('O nama', 'About')} description={t('Bonaco Media, marketing, kreativa i produkcija iz Sarajeva.', 'Bonaco Media: marketing, creative and production from Sarajevo.')} />
      <BrandOrbit />
      <EditorialIntro secondary label={t('O nama', 'About us')} title={<>{t('Različite vještine.', 'Different expertise.')}<br /><span>{t('Zajednička ideja.', 'One shared vision.')}</span></>}>
        <p>{t('Bonaco Media je marketinška agencija iz Sarajeva. Za brendove u Bosni i Hercegovini i Evropi povezujemo strategiju, dizajn, sadržaj, produkciju i oglašavanje. Polazimo od onoga što vaš brend čini posebnim i pretvaramo to u komunikaciju koju ljudi mogu prepoznati i razumjeti.', 'Bonaco Media is a Sarajevo-based marketing agency working with brands across Bosnia and Herzegovina and Europe. We bring strategy, design, content, production and advertising together. Our starting point is what makes your brand distinctive; our job is to make that matter to the people you want to reach.')}</p>
        <p>{t('Naš rad obuhvata različite industrije i formate: bankarstvo, modu, turizam, proizvode i događaje. Svakom projektu pristupamo kroz njegovu publiku, kontekst i cilj, uz pažnju prema detaljima od prvog prijedloga do finalne izvedbe.', 'From banking and fashion to hospitality, consumer brands and events, our work takes many forms. Every project starts with its audience and purpose, with the same care carried through from the first idea to the finished work.')}</p>
      </EditorialIntro>
      <section className="ref-wrap about-approach" aria-label={t('Kako radimo', 'How we work')}>
        {approach.map((item, index) => <article key={item.title}><span className="about-step" aria-hidden="true">0{index + 1}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}
      </section>
      <section className="ref-wrap about-connection">
        <p>{t('Marketing je naš osnovni krug. Bonevent okuplja događaje i produkciju, Bonexis razvija poslovna AI rješenja, a Poslovni oglasi povezuju poslodavce i kandidate. Svaki smjer ima svoj fokus, uz zajednički pristup kreativnosti i saradnji.', 'Marketing is at the heart of Bonaco. Bonevent creates and produces events, Bonexis is developing AI solutions for business, and Poslovni oglasi connects employers with candidates. Each has a distinct focus, united by a collaborative, creative approach.')}</p>
      </section>
      <section className="ref-wrap about-story">
        <p className="ref-eyebrow">{t('Od prvog razgovora do izvedbe', 'From the first conversation to delivery')}</p>
        <h2>{t('Iza svakog kruga', 'Behind every circle')}<br /><span>{t('stoje ljudi i ideje.', 'are people and ideas.')}</span></h2>
        <p>{t('Najbolje saradnje za nas počinju znatiželjom. Želimo znati kako vaš posao funkcioniše, šta vaši kupci cijene i gdje postoji prostor da komunikacija bude jasnija, hrabrija ili jednostavno bliža ljudima. Iz tih razgovora nastaju ideje koje imaju smisla za vaš brend.', 'For us, the best collaborations begin with curiosity. We want to understand how your business works, what your customers value and where communication could be clearer, bolder or closer to people. Those conversations lead to ideas that make sense for your brand.')}</p>
        <p>{t('Jedna ideja može živjeti na mnogo mjesta: u vizuelnom identitetu, objavi, filmu, web stranici ili događaju. Naš posao je da ti dijelovi govore istim jezikom. Zato zajedno razmišljamo o sadržaju i izvedbi, o velikoj slici i detalju koji joj daje karakter.', 'One idea can live in many places: a visual identity, a post, a film, a website or an event. Our job is to make those pieces speak the same language. We think about content and execution together, about the bigger picture and the detail that gives it character.')}</p>
      </section>
      <ClientClouds />
      <ContactBand />
    </div>
  );
}
