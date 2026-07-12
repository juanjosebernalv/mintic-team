import { useState, useEffect, useRef } from 'react';
import {
  Target, Search, Settings, BarChart2, Database,
  MapPin, Brain, CheckCircle, LayoutDashboard,
} from 'lucide-react';

const ICONS = {
  Target, Search, Settings, BarChart2, Database,
  MapPin, Brain, CheckCircle, LayoutDashboard,
};

const STATUS = {
  completed: { label: 'Completado', badge: 'ptl-badge--done' },
  in_progress: { label: 'En proceso', badge: 'ptl-badge--wip' },
  upcoming: { label: 'Próximamente', badge: 'ptl-badge--soon' },
};

const steps = [
  {
    id: 1,
    title: 'Definición del problema y objetivo',
    description:
      'Decidimos construir un modelo de IA para predecir las mejores condiciones de siembra en Colombia: departamento óptimo, época del año y lineamientos para maximizar el rendimiento con el menor uso de recursos.',
    icon: 'Target',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Investigación y selección de datos',
    description:
      'Búsqueda exhaustiva de datasets sobre suelos, clima, condiciones atmosféricas y resultados históricos de producción agrícola en fuentes oficiales como datos.gov.co, IDEAM, IGAC y el Ministerio de Agricultura.',
    icon: 'Search',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Configuración del ambiente de trabajo',
    description:
      'Creamos los entornos en Google Colab, organizamos los datos en Google Drive, configuramos repositorios en GitHub y tableros en Jira. Definimos ceremonias Scrum para el seguimiento remoto del equipo.',
    icon: 'Settings',
    status: 'completed',
  },
  {
    id: 4,
    title: 'Exploración inicial de datos (EDA)',
    description:
      'Analizamos la estructura, calidad y distribución de los datasets. Identificamos variables clave, detectamos inconsistencias y visualizamos correlaciones entre condiciones climáticas, de suelo y resultados de producción.',
    icon: 'BarChart2',
    status: 'completed',
  },
  {
    id: 5,
    title: 'Preprocesamiento y transformación de datos',
    description:
      'Estandarizamos formatos, limpiamos nombres de columnas, filtramos registros inválidos y transformamos la data para que fuera consumible por el modelo de machine learning.',
    icon: 'Database',
    status: 'completed',
  },
  {
    id: 6,
    title: 'Definición del alcance — Cundinamarca y Boyacá',
    description:
      'Por limitaciones de la capa gratuita de cómputo, acotamos el alcance a dos departamentos representativos: Cundinamarca y Boyacá. Una decisión estratégica para construir un demo sólido y escalable.',
    icon: 'MapPin',
    status: 'completed',
  },
  {
    id: 7,
    title: 'Entrenamiento del modelo',
    description:
      'Con la información lista para su cruce, entrenamos el modelo de machine learning para generar predicciones sobre las condiciones óptimas de siembra por departamento, cultivo y época del año.',
    icon: 'Brain',
    status: 'completed',
  },
  {
    id: 8,
    title: 'Validación y evaluación del modelo',
    description:
      'Evaluamos el rendimiento del modelo con métricas de validación, ajustamos hiperparámetros y verificamos la capacidad de generalización de las predicciones obtenidas.',
    icon: 'CheckCircle',
    status: 'completed',
  },
  {
    id: 9,
    title: 'Dashboard de resultados',
    description:
      'Implementación de esta sección: un dashboard interactivo que permite explorar las predicciones del modelo por departamento, cultivo y condición climática.',
    icon: 'LayoutDashboard',
    status: 'completed',
  },
];

export default function ProjectTimeline() {
  const [visibleItems, setVisibleItems] = useState(() => new Set());
  const itemRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, idx]));
            obs.unobserve(entry.target);
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="ptl-section">
      <div className="container">
        <header className="ptl-header">
          <span className="ptl-eyebrow">— Concurso Datos al Ecosistema 2026</span>
          <h2 className="ptl-title">Proceso de construcción</h2>
          <p className="ptl-subtitle">IA para Colombia · rAIz</p>
          <p className="ptl-desc">
            Un recorrido por el proceso de construcción de nuestro modelo de inteligencia
            artificial para predecir las condiciones óptimas de cultivos agrícolas en
            Cundinamarca y Boyacá.
          </p>
        </header>

        <div className="ptl-list" role="list">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const isVisible = visibleItems.has(idx);
            const Icon = ICONS[step.icon];
            const statusCfg = STATUS[step.status];

            const card = (
              <div className={`ptl-card ptl-card--${step.status}`} role="listitem">
                <div className="ptl-card__head">
                  <span className="ptl-card__title">{step.title}</span>
                  <span className={`ptl-badge ${statusCfg.badge}`}>{statusCfg.label}</span>
                </div>
                <p className="ptl-card__desc">{step.description}</p>
              </div>
            );

            return (
              <div
                key={step.id}
                ref={el => { itemRefs.current[idx] = el; }}
                className={`ptl-item ptl-item--${isLeft ? 'L' : 'R'}${isVisible ? ' is-visible' : ''}`}
                style={{ '--ptl-delay': `${idx * 55}ms` }}
              >
                <div className="ptl-item__left">
                  {isLeft && card}
                </div>

                <div className="ptl-item__axis">
                  <div className={`ptl-node ptl-node--${step.status}`} aria-hidden="true">
                    {Icon && <Icon size={20} strokeWidth={1.75} />}
                    <span className="ptl-step-num">{step.id}</span>
                  </div>
                </div>

                <div className="ptl-item__right">
                  {!isLeft && card}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
