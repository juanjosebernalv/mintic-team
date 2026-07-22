import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout, Target, Brain, BarChart2, ChevronRight,
  Database, MapPin, Cpu, Leaf,
} from 'lucide-react';

const PHASES = [
  {
    icon: Target,
    label: 'Fase 1 · Investigación',
    title: 'Problema y datos',
    body: 'Definimos el objetivo: predecir el departamento óptimo, la época de siembra y los lineamientos de cultivo para maximizar rendimiento con el menor uso de recursos. Exploramos fuentes oficiales — datos.gov.co, IDEAM, IGAC y Ministerio de Agricultura — y configuramos el entorno colaborativo con Google Colab, GitHub y Jira bajo ceremonias Scrum.',
    accent: 'var(--accent)',
  },
  {
    icon: Database,
    label: 'Fase 2 · Ingeniería de datos',
    title: 'EDA y preprocesamiento',
    body: 'Analizamos la estructura, calidad y distribución de los datasets. Visualizamos correlaciones entre clima, suelo y producción, identificamos variables clave, eliminamos inconsistencias y transformamos la data en formatos consumibles por el modelo de machine learning.',
    accent: 'var(--copper)',
  },
  {
    icon: Brain,
    label: 'Fase 3 · Modelado',
    title: 'Alcance estratégico y entrenamiento',
    body: 'Acotamos el demo a Cundinamarca y Boyacá — dos departamentos representativos de la región andina — como decisión estratégica para construir una solución sólida y escalable dentro de los límites de cómputo gratuito. Con los datos listos, entrenamos el modelo de ML para generar predicciones por departamento, cultivo y época del año.',
    accent: 'var(--success)',
  },
  {
    icon: BarChart2,
    label: 'Fase 4 · Validación y producto',
    title: 'Métricas y dashboard',
    body: 'Evaluamos el rendimiento con métricas de validación, ajustamos hiperparámetros y verificamos la capacidad de generalización. Los resultados se exponen en un dashboard interactivo con mapas georreferenciados, gráficas de tendencia y filtros por cultivo, condición de suelo y semestre.',
    accent: 'var(--warn)',
  },
];

const STATS = [
  { value: '7', label: 'Cultivos modelados', icon: Leaf },
  { value: '2', label: 'Departamentos cubiertos', icon: MapPin },
  { value: '168', label: 'Predicciones generadas', icon: Cpu },
  { value: '4', label: 'Profesionales del equipo', icon: Sprout },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealDiv({ className, style, children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s var(--ease) ${delay}ms, transform 0.55s var(--ease) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function PitchSection() {
  return (
    <section className="pitch-section">
      <div className="container">

        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="pitch-header">
          <RevealDiv>
            <span className="pitch-eyebrow">
              Concurso Datos al Ecosistema 2026 · MINTIC
            </span>
          </RevealDiv>
          <RevealDiv delay={60}>
            <h2 className="pitch-title">
              <span className="pitch-title__brand">rAIz</span>
              <span className="pitch-title__sep"> — </span>
              IA para el campo colombiano
            </h2>
          </RevealDiv>
          <RevealDiv delay={120}>
            <p className="pitch-lead">
              Un modelo de machine learning que predice las mejores condiciones de siembra
              en Colombia: qué cultivar, cuándo y dónde — para ayudar al agricultor
              a maximizar su rendimiento y reducir pérdidas evitables.
            </p>
          </RevealDiv>
        </header>

        {/* ── Problema / Solución ────────────────────────────────────── */}
        <div className="pitch-ps-grid">
          <RevealDiv className="pitch-ps-card pitch-ps-card--problem" delay={0}>
            <span className="pitch-ps-tag">El Problema</span>
            <h3 className="pitch-ps-title">Decisiones sin datos</h3>
            <p className="pitch-ps-body">
              La mayoría de agricultores colombianos toma decisiones de siembra
              basadas en experiencia empírica, sin acceso a información predictiva
              integrada sobre clima, suelo y demanda. El resultado: cultivos fuera
              de temporada, suelos inadecuados y pérdidas que podrían prevenirse.
            </p>
          </RevealDiv>

          <RevealDiv className="pitch-ps-card pitch-ps-card--solution" delay={80}>
            <span className="pitch-ps-tag pitch-ps-tag--accent">La Solución</span>
            <h3 className="pitch-ps-title">Predicción basada en evidencia</h3>
            <p className="pitch-ps-body">
              rAIz cruza datos climáticos, de suelo y producción histórica de fuentes
              oficiales colombianas para entrenar un modelo que recomienda el departamento
              óptimo, la época ideal y el cultivo más rentable — con un índice de
              confianza cuantificable por predicción.
            </p>
          </RevealDiv>
        </div>

        {/* ── Proceso en 4 fases ────────────────────────────────────── */}
        <RevealDiv>
          <h2 className="pitch-section-title">Cómo lo construimos</h2>
          <p className="pitch-section-sub">
            Nueve pasos de trabajo riguroso, condensados en cuatro fases.
          </p>
        </RevealDiv>

        <div className="pitch-phases">
          {PHASES.map((ph, i) => {
            const Icon = ph.icon;
            return (
              <RevealDiv key={i} className="pitch-phase-card" delay={i * 70}>
                <div className="pitch-phase-card__head">
                  <div className="pitch-phase-card__icon" style={{ '--ph-accent': ph.accent }}>
                    <Icon size={22} strokeWidth={1.6} />
                  </div>
                  <span className="pitch-phase-card__label">{ph.label}</span>
                </div>
                <h3 className="pitch-phase-card__title">{ph.title}</h3>
                <p className="pitch-phase-card__body">{ph.body}</p>
              </RevealDiv>
            );
          })}
        </div>

        {/* ── Impacto ───────────────────────────────────────────────── */}
        <RevealDiv>
          <h2 className="pitch-section-title">Resultados del demo</h2>
        </RevealDiv>

        <div className="pitch-stats">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <RevealDiv key={i} className="pitch-stat" delay={i * 55}>
                <Icon size={20} strokeWidth={1.5} className="pitch-stat__icon" />
                <span className="pitch-stat__value">{s.value}</span>
                <span className="pitch-stat__label">{s.label}</span>
              </RevealDiv>
            );
          })}
        </div>

        {/* ── Fuentes de datos ─────────────────────────────────────── */}
        <RevealDiv className="pitch-sources">
          <span className="pitch-sources__label">Fuentes de datos oficiales</span>
          <div className="pitch-sources__list">
            {['datos.gov.co', 'IDEAM', 'IGAC', 'Ministerio de Agricultura'].map(s => (
              <span key={s} className="pitch-source-badge">{s}</span>
            ))}
          </div>
        </RevealDiv>

        {/* ── Diferenciadores ──────────────────────────────────────── */}
        <RevealDiv className="pitch-diff-grid">
          {[
            { title: 'Escalable por diseño', body: 'Hoy cubre Cundinamarca y Boyacá. La arquitectura permite añadir departamentos y cultivos sin reestructurar el modelo.' },
            { title: 'Datos abiertos colombianos', body: 'Construido 100 % sobre fuentes públicas y oficiales: trazable, auditable y replicable por cualquier institución.' },
            { title: 'Demo interactivo real', body: 'Un demo de dashboard funcional con predicciones explorables, filtros y mapa georreferenciado.' },
          ].map((d, i) => (
            <RevealDiv key={i} className="pitch-diff-card" delay={i * 65}>
              <h4 className="pitch-diff-card__title">{d.title}</h4>
              <p className="pitch-diff-card__body">{d.body}</p>
            </RevealDiv>
          ))}
        </RevealDiv>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <RevealDiv className="pitch-cta">
          <Link to="/dashboard" className="btn btn--primary pitch-cta__btn">
            Explorar el Dashboard <ChevronRight size={16} />
          </Link>
          <Link to="/proceso" className="btn btn--ghost pitch-cta__btn">
            Ver proceso completo
          </Link>
        </RevealDiv>

      </div>
    </section>
  );
}
