// Poslovni Oglasi: platforma za oglašavanje poslova i traženje radnika u BiH.
// Partnerski projekat Bonaco Media × Poslovni Oglasi (poslovnioglasi.ba).

export type POServiceIcon = 'briefcase' | 'users' | 'megaphone' | 'chart' | 'lightbulb' | 'rocket';

export const PO_SERVICES: { id: string; icon: POServiceIcon; bs: { title: string; text: string }; en: { title: string; text: string } }[] = [
  {
    id: 'oglasi', icon: 'briefcase',
    bs: { title: 'Oglasi za posao', text: 'Objavite oglas i pronađite kvalifikovane kandidate iz cijele Bosne i Hercegovine.' },
    en: { title: 'Job listings', text: 'Post an ad and find qualified candidates from all over Bosnia and Herzegovina.' },
  },
  {
    id: 'kandidati', icon: 'users',
    bs: { title: 'Baza kandidata', text: 'Pristupite bazi aktivnih kandidata koji traže zaposlenje u raznim industrijama.' },
    en: { title: 'Candidate pool', text: 'Access a pool of active candidates seeking employment across various industries.' },
  },
  {
    id: 'promocija', icon: 'megaphone',
    bs: { title: 'Promocija oglasa', text: 'Istaknite svoj oglas i dođite do više kandidata kroz ciljanu promociju.' },
    en: { title: 'Ad promotion', text: 'Highlight your listing and reach more candidates through targeted promotion.' },
  },
  {
    id: 'analitika', icon: 'chart',
    bs: { title: 'Analitika i praćenje', text: 'Pratite učinak vaših oglasa i optimizujte rezultate u realnom vremenu.' },
    en: { title: 'Analytics and tracking', text: 'Monitor the performance of your listings and optimise results in real time.' },
  },
];
