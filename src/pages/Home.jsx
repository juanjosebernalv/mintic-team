import { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import MemberCard from '../components/MemberCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { members } from '../data/members.js';

export default function Home() {
  useEffect(() => {
    document.title = 'Nuestro Equipo · Team Showcase';
  }, []);

  return (
    <>
      <Hero />

      <section id="team" className="section">
        <div className="container">
          <header className="section__head">
            <p className="section__eyebrow">— Equipo</p>
            <h2 className="section__title">Conoce a nuestros integrantes</h2>
            <p className="section__lead">
              Un equipo diverso de profesionales con experiencia en arquitectura, frontend,
              datos y liderazgo técnico.
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
    </>
  );
}
