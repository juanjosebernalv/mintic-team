import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== '/') { setActiveSection(null); return; }
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.4 }
    );
    ['team', 'codigo'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NAV_LINKS = (
    <>
      <a href="/#team"   onClick={scrollTo('team')}   className={activeSection === 'team'   ? 'active' : ''}>Equipo</a>
      <a href="/#codigo" onClick={scrollTo('codigo')} className={activeSection === 'codigo' ? 'active' : ''}>Código</a>
      <NavLink to="/pitch"         onClick={() => setMenuOpen(false)}>Pitch</NavLink>
      <NavLink to="/proceso"       onClick={() => setMenuOpen(false)}>Proceso</NavLink>
      <NavLink to="/dashboard"     onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
      <NavLink to="/deep-learning" onClick={() => setMenuOpen(false)}>Deep Learning</NavLink>
    </>
  );

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="Inicio">
            <span className="brand__logo-text">r<span className="brand__ai">AI</span>z</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav" aria-label="Navegación principal">
            {NAV_LINKS}
          </nav>

          {/* Hamburger button — mobile only */}
          <button
            className={`hamburger${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile drawer — sibling of header to avoid backdrop-filter containing block */}
      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-menu__nav" aria-label="Navegación móvil">
          {NAV_LINKS}
        </nav>
      </div>
    </>
  );
}
