import { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import MemberCard from '../components/MemberCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { members } from '../data/members.js';

export default function Home() {
  useEffect(() => {
    document.title = 'rAIz · Agricultura Inteligente Colombiana';
  }, []);

  return (
    <>
      <Hero />

      <section id="team" className="section">
        <div className="container">
          <header className="section__head">
            <p className="section__eyebrow">— Equipo rAIz</p>
            <h2 className="section__title">Las personas detrás del proyecto</h2>
            <p className="section__lead">
              Un equipo diverso de ingenieros, científicos de datos y líderes técnicos
              comprometidos con transformar el agro colombiano mediante tecnología e inteligencia artificial.
            </p>
          </header>

          <div className="grid">
            {members.map((m, idx) => (
              <Reveal key={m.id} delay={idx * 90}>
                <MemberCard member={m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="codigo" className="section section--dark">
        <div className="container">
          <header className="section__head">
            <p className="section__eyebrow">— Open Source</p>
            <h2 className="section__title">Código</h2>
            <p className="section__lead">
              Todo el trabajo de rAIz es abierto. Aquí encontrarás el código del proyecto
              y el sitio que documenta nuestro proceso.
            </p>
          </header>

          <div className="repo-grid">
            <Reveal delay={0}>
              <a
                href="https://github.com/cybercolombia/suelosabio"
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card"
              >
                <div className="repo-card__icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <div className="repo-card__body">
                  <h3 className="repo-card__name">cybercolombia / suelosabio</h3>
                  <p className="repo-card__desc">
                    Repositorio principal del proyecto — datos climáticos, modelos de suelos
                    e inteligencia agrícola para Colombia.
                  </p>
                </div>
                <span className="repo-card__arrow" aria-hidden="true">→</span>
              </a>
            </Reveal>

            <Reveal delay={120}>
              <a
                href="https://github.com/juanjosebernalv/mintic-team"
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card"
              >
                <div className="repo-card__icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <div className="repo-card__body">
                  <h3 className="repo-card__name">juanjosebernalv / mintic-team</h3>
                  <p className="repo-card__desc">
                    Homepage del equipo — sitio que documenta el proceso, las personas
                    y el avance del proyecto durante el concurso MINTIC 2026.
                  </p>
                </div>
                <span className="repo-card__arrow" aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
