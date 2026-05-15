import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MemberDetail from './pages/MemberDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import Parallax from './components/Parallax.jsx';

export default function App() {
  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true">
        <Parallax speed={0.18} className="app-bg__parallax">
          <div className="app-bg__img" />
        </Parallax>
        <div className="app-bg__overlay" />
      </div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/member/:slug" element={<MemberDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
