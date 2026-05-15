import Parallax from './Parallax.jsx';
import raizLogo from '../assets/raiz-logo-1.png';

export default function Hero() {
  return (
    <section className="hero">
      {/* Capas decorativas con parallax */}
      <Parallax speed={0.25} className="hero__layer hero__layer--back">
        <div className="hero__glow hero__glow--a" />
      </Parallax>
      <Parallax speed={0.45} className="hero__layer hero__layer--mid">
        <div className="hero__glow hero__glow--b" />
      </Parallax>

      <div className="container hero__content">
        {/* Logo centrado */}
        <div className="hero__logo-wrap">
          <img
            src={raizLogo}
            alt="rAIz — Agricultura Inteligente Colombiana"
            className="hero__logo"
          />
        </div>

        <p className="hero__lead">
          Datos climáticos predictivos e inteligencia de suelos para ayudar al campo colombiano
          a anticipar riesgos, reducir pérdidas y mejorar la productividad agrícola.
        </p>
        <button
          className="btn btn--primary"
          onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Conocer al equipo
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  );
}
