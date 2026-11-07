import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTER_BASENAME } from './lib/asset';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MarketingRedirect from './components/MarketingRedirect';
import BonexisPage from './pages/BonexisPage';
import BonEventsPage from './pages/BonEventsPage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectPage from './pages/ProjectPage';
import NewsPage from './pages/NewsPage';
import PostPage from './pages/PostPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

// BS: URL-ovi zadržavaju strukturu stare WordPress stranice (SEO): /nase-usluge/, /kontakt/, /<post-slug>/ ...
// EN: sve ispod /en/ (parovi putanja u lib/i18n.ts). Vijesti postoje samo na bosanskom.
export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="nase-usluge" element={<MarketingRedirect />} />
          <Route path="nase-suluge" element={<MarketingRedirect />} />
          <Route path="marketing" element={<MarketingRedirect />} />
          <Route path="bonexis" element={<BonexisPage />} />
          <Route path="bonevents" element={<BonEventsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="portfolio/:slug" element={<ProjectPage />} />
          <Route path="o-nama" element={<AboutPage />} />
          <Route path="vijesti" element={<NewsPage />} />
          <Route path="kontakt" element={<ContactPage />} />
          <Route path="politika-privatnosti" element={<PrivacyPage />} />

          <Route path="en">
            <Route index element={<HomePage />} />
            <Route path="marketing" element={<MarketingRedirect />} />
            <Route path="bonexis" element={<BonexisPage />} />
            <Route path="bonevents" element={<BonEventsPage />} />
            <Route path="work" element={<PortfolioPage />} />
            <Route path="work/:slug" element={<ProjectPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path=":slug" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
