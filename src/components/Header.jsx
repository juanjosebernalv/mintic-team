import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Inicio">
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M16 44 L32 16 L48 44 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="36" r="3" fill="currentColor" />
          </svg>
          <span>Team Showcase</span>
        </Link>
        <nav className="nav" aria-label="Navegación principal">
          <Link to="/">Equipo</Link>
          <a href="#contacto">Contacto</a>
        </nav>
      </div>
    </header>
  );
}
