import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import Parallax from '../components/Parallax.jsx';
import Reveal from '../components/Reveal.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import { getMemberBySlug } from '../data/members.js';

export default function MemberDetail() {
  const { slug } = useParams();
  const member = getMemberBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (member) document.title = `${member.name} · Team Showcase`;
  }, [member]);

  if (!member) {
    return (
      <section className="section">
        <div className="container">
          <h2>Integrante no encontrado</h2>
          <Link to="/" className="btn btn--ghost">← Volver</Link>
        </div>
      </section>
    );
  }

  return (
    <article className="detail" style={{ '--accent': member.accent }}>
      <section className="detail__hero">
        <Parallax speed={0.2} className="detail__bg">
          <div className="detail__glow" />
        </Parallax>

        <div className="container detail__hero-inner">
          <Link to="/" className="btn btn--ghost detail__back">← Equipo</Link>
          <div className="detail__head">
            <Avatar
              photo={member.photo}
              initials={member.initials}
              accent={member.accent}
              size={160}
              alt={member.name}
            />
            <div>
              <p className="section__eyebrow">{member.location}</p>
              <h1 className="detail__name">{member.name}</h1>
              <p className="detail__role">{member.role}</p>
              <SocialLinks social={member.social} accent={member.accent} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail__grid">
          <Reveal className="detail__main">
            <h2 className="block-title">Sobre {member.name.split(' ')[0]}</h2>
            <p className="lead">{member.bio}</p>

            <h2 className="block-title">Experiencia</h2>
            <ol className="timeline">
              {member.experience.map((exp, i) => (
                <li key={i} className="timeline__item">
                  <div className="timeline__dot" />
                  <div className="timeline__body">
                    <div className="timeline__head">
                      <h3>{exp.role}</h3>
                      <span className="timeline__period">{exp.period}</span>
                    </div>
                    <p className="timeline__company">{exp.company}</p>
                    <p>{exp.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="detail__aside" delay={120}>
            <div className="panel">
              <h3 className="panel__title">Lugar de trabajo</h3>
              <p>{member.workplace}</p>
            </div>

            <div className="panel">
              <h3 className="panel__title">Educación</h3>
              <ul className="edu-list">
                {member.education.map((e, i) => (
                  <li key={i}>
                    <strong>{e.institution}</strong>
                    <span>{e.degree}</span>
                    {e.period && <span className="muted">{e.period}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <h3 className="panel__title">Habilidades</h3>
              <ul className="tags">
                {member.skills.map((s) => (
                  <li key={s} className="tag">{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
