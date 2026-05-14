/**
 * Avatar con fallback de iniciales sobre gradiente.
 * Si `photo` está definido y carga correctamente, se muestra la imagen.
 */
import { useState } from 'react';

export default function Avatar({ photo, initials, accent = '#7aa2f7', size = 96, alt = '' }) {
  const [error, setError] = useState(false);
  const showImage = photo && !error;

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
        borderColor: `${accent}55`
      }}
      aria-hidden={!alt}
    >
      {showImage ? (
        <img src={photo} alt={alt} onError={() => setError(true)} />
      ) : (
        <span className="avatar__initials" style={{ color: accent }}>
          {initials}
        </span>
      )}
    </div>
  );
}
