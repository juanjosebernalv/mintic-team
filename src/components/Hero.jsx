import Parallax from './Parallax.jsx';

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
        <p className="hero__eyebrow">— Nuestro equipo</p>
        <h1 className="hero__title">
          Personas que construyen <span className="accent">soluciones</span>
          <br />
          con propósito.
        </h1>
        <p className="hero__lead">
          Conoce al equipo detrás del proyecto: ingenieros, arquitectos y desarrolladores
          comprometidos con la calidad, la escalabilidad y el trabajo colaborativo.
        </p>
        <a href="#team" className="btn btn--primary">
          Conocer al equipo
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
