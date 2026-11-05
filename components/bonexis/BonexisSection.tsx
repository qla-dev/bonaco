import { asset } from '../../lib/asset';
// Bonexis blok: chat na vrhu, ispod centriran naslov i 3D kancelarija.
// Chat može otvoriti agenta u kancelariji ("Pogledajte agenta u kancelariji").
import { useRef, useState } from 'react';
import BonexisChat from './BonexisChat';
import BonexisOffice from './BonexisOffice';

interface Props { headingLevel?: 'h1' | 'h2'; officeHeight?: string }

export default function BonexisSection({ headingLevel = 'h2', officeHeight }: Props) {
  const [selected, setSelected] = useState(-1);
  const officeRef = useRef<HTMLDivElement>(null);
  const Heading = headingLevel;

  const showTeam = () => officeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const showAgent = (i: number) => { setSelected(i); showTeam(); };

  return (
    <>
      <div className="bx-chat-section">
        <div className="container bx-head">
          <img src={asset('/img/logo/bonaco-b.webp')} alt="" width="56" height="43" className="bx-mark" />
          <Heading className="bx-title">Bonexis</Heading>
          <p className="bx-sub">AI agenti koje smo razvili u Bonaco Media. Opišite problem, a Bonexis predlaže agenta koji ga rješava.</p>
        </div>
        <div className="container"><BonexisChat onShowAgent={showAgent} onShowTeam={showTeam} /></div>
      </div>
      <div className="bx-team" id="ai-tim">
        <div className="container bx-team-head">
          <h2>Upoznajte AI tim</h2>
          <p>Šest agenata radi 0–24. Prevucite da okrenete kancelariju i kliknite radno mjesto da vidite šta koji agent radi.</p>
        </div>
        <BonexisOffice ref={officeRef} selected={selected} onSelectedChange={setSelected} height={officeHeight} />
      </div>
    </>
  );
}
