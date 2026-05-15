import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Inicio">
          <span className="brand__logo-text">
            r<span className="brand__ai">AI</span>z
          </span>
        </Link>
        <nav className="nav" aria-label="Navegación principal">
          <Link to="/">Equipo</Link>
          <a href="#contacto">Contacto</a>
        </nav>
      </div>
    </header>
  );
}
