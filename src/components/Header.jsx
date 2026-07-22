import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    const sections = ['team', 'codigo'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Inicio">
          <span className="brand__logo-text">
            r<span className="brand__ai">AI</span>z
          </span>
        </Link>
        <nav className="nav" aria-label="Navegación principal">
          <a
            href="/#team"
            onClick={scrollTo('team')}
            className={activeSection === 'team' ? 'active' : ''}
          >Equipo</a>
          <a
            href="/#codigo"
            onClick={scrollTo('codigo')}
            className={activeSection === 'codigo' ? 'active' : ''}
          >Código</a>
          <NavLink to="/pitch">Pitch</NavLink>
          <NavLink to="/proceso">Proceso</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/deep-learning">Deep Learning</NavLink>
        </nav>
      </div>
    </header>
  );
}
