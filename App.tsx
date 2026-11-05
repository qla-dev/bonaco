import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTER_BASENAME } from './lib/asset';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BonexisPage from './pages/BonexisPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectPage from './pages/ProjectPage';
import NewsPage from './pages/NewsPage';
import PostPage from './pages/PostPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

// URL-ovi zadržavaju strukturu stare WordPress stranice (SEO): /nase-usluge/, /kontakt/, /<post-slug>/ ...
export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="nase-usluge" element={<ServicesPage />} />
          <Route path="nase-suluge" element={<Navigate to="/nase-usluge/" replace />} />
          <Route path="bonexis" element={<BonexisPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="portfolio/:slug" element={<ProjectPage />} />
          <Route path="vijesti" element={<NewsPage />} />
          <Route path="kontakt" element={<ContactPage />} />
          <Route path="politika-privatnosti" element={<PrivacyPage />} />
          <Route path="o-nama" element={<Navigate to="/#o-nama" replace />} />
          <Route path=":slug" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
