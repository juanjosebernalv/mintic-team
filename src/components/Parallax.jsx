/**
 * Contenedor parallax.
 * Aplica un desplazamiento vertical proporcional al scroll de la página.
 *
 * Props:
 *  - speed: factor de velocidad (negativo = se mueve hacia arriba más lento, 0.2 - 0.6 funciona bien)
 *  - children: contenido
 *  - className: clase adicional opcional
 */
import { useEffect, useRef } from 'react';

export default function Parallax({ speed = 0.3, children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respetar la preferencia del usuario de movimiento reducido.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let raf = 0;
    const onScroll = () => {
      raf = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;
        // offset relativo al centro del viewport
        const offset = (rect.top + rect.height / 2 - viewportH / 2) * speed * -1;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  );
}
