// Bonexis blok: Ben AI chat, scenariji agenata (zasebne sekcije), pa 3D kancelarija.
// Odabrani agent se otvara u desnom sidebaru (AgentSidebar unutar BonexisOffice).
import { useRef, useState } from 'react';
import { BEN, BONEXIS_AGENTS } from '../../data/bonexis';
import BonexisChat from './BonexisChat';
import BonexisLogo from './BonexisLogo';
import BonexisOffice from './BonexisOffice';
import ScenarioSections from './BonexisScenarios';

interface Props { headingLevel?: 'h1' | 'h2'; officeHeight?: string; /** na /bonexis/ stranici: logo je u headeru, naslov lijevo */ page?: boolean }

export default function BonexisSection({ headingLevel = 'h2', officeHeight, page = false }: Props) {
  const [selected, setSelected] = useState(-1);
  const officeRef = useRef<HTMLDivElement>(null);
  const Heading = headingLevel;

  const showTeam = () => officeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const showAgent = (i: number) => { setSelected(i); showTeam(); };
  const showScenario = (i: number) => {
    setSelected(-1);
    document.getElementById(`scenarij-${BONEXIS_AGENTS[i].persona.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {page && (
        <div className={`bx-chat-section ${page ? 'is-page' : ''}`} id="bonexis">
          {page ? (
            <Heading className="sr-only">Bonexis – marketing CRM s AI agentima</Heading>
          ) : (
            <div className="container bx-head">
              <Heading className="bx-title"><BonexisLogo /></Heading>
              <p className="bx-sub">Marketing CRM u kojem klijente, kampanje, sadržaj i rokove vode AI agenti. {BEN.name} je vaš ulaz: opišite problem, a on vas spoji s agentom koji ga rješava.</p>
            </div>
          )}
          <div className="container">
            <BonexisChat onShowAgent={showAgent} onShowScenario={showScenario} />
          </div>
        </div>
      )}
      <ScenarioSections onShowAgent={showAgent} />
      <div className="bx-team" id="ai-tim">
        <div className="container bx-team-head">
          <h2>Upoznajte <em className="shimmer hl">AI tim</em></h2>
          <p>U sredini je Ben, koji posao šalje owner agentima sedam kapsula: Lani, Selmi, Edinu, Lejli (uz Saru), Kenanu, Dini i Adi. Prevucite da okrenete kancelariju i kliknite radno mjesto da otvorite agenta.</p>
        </div>
        <BonexisOffice ref={officeRef} selected={selected} onSelectedChange={setSelected} onShowScenario={showScenario} height={officeHeight} />
      </div>
    </>
  );
}
