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
          <a
            href="#team"
            onClick={e => {
              e.preventDefault();
              document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >Equipo</a>
          <a
            href="#codigo"
            onClick={e => {
              e.preventDefault();
              document.getElementById('codigo')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >Código</a>
        </nav>
      </div>
    </header>
  );
}
