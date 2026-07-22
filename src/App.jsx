import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MemberDetail from './pages/MemberDetail.jsx';
import Proceso from './pages/Proceso.jsx';
import Pitch from './pages/Pitch.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DeepLearning from './pages/DeepLearning.jsx';
import NotFound from './pages/NotFound.jsx';
import Parallax from './components/Parallax.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true">
        <Parallax speed={0.18} className="app-bg__parallax">
          <div className="app-bg__img" />
        </Parallax>
        <div className="app-bg__overlay" />
      </div>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member/:slug" element={<MemberDetail />} />
          <Route path="/pitch" element={<Pitch />} />
          <Route path="/proceso" element={<Proceso />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deep-learning" element={<DeepLearning />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
