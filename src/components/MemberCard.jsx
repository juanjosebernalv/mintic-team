import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import SocialLinks from './SocialLinks.jsx';

export default function MemberCard({ member }) {
  return (
    <article className="card" style={{ '--accent': member.accent }}>
      <div className="card__head">
        <Avatar
          photo={member.photo}
          initials={member.initials}
          accent={member.accent}
          size={88}
          alt={member.name}
        />
        <div>
          <h3 className="card__name">{member.name}</h3>
          <p className="card__role">{member.role}</p>
          <p className="card__meta">
            <span>{member.workplace}</span>
          </p>
        </div>
      </div>

      <p className="card__bio">{member.shortBio}</p>

      <div className="card__edu">
        <span className="label">Educación</span>
        <span>{member.education[0]?.institution}</span>
      </div>

      <div className="card__footer">
        <SocialLinks social={member.social} accent={member.accent} />
        <Link to={`/member/${member.slug}`} className="btn btn--ghost">
          Ver perfil →
        </Link>
      </div>
    </article>
  );
}
