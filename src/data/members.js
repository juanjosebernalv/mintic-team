/**
 * Datos del equipo.
 *
 * Para agregar un integrante nuevo, simplemente añade un objeto al arreglo
 * siguiendo la misma forma. El campo `slug` debe ser único y se utiliza en la URL.
 *
 * Campos:
 *  - id: identificador numérico interno
 *  - slug: identificador URL-friendly (kebab-case)
 *  - name: nombre completo
 *  - role: cargo o rol profesional
 *  - location: ciudad / país
 *  - photo: URL o ruta relativa de la foto (cuadrada). Si no hay, usa initials.
 *  - initials: iniciales (fallback cuando no hay foto)
 *  - shortBio: descripción breve para la home
 *  - bio: descripción extendida para la página de detalle
 *  - education: arreglo de { institution, degree, period }
 *  - workplace: lugar de trabajo actual
 *  - experience: arreglo de { company, role, period, summary }
 *  - skills: arreglo de strings con habilidades destacadas
 *  - social: { linkedin, email, website? }
 *  - accent: color de acento opcional (hex) para personalizar la card
 */

export const members = [
  {
    id: 1,
    slug: 'pedro-rozo',
    name: 'Pedro Rozo',
    role: 'Software Developer · Software Architect · Data Engineer',
    location: 'Bogotá, Colombia',
    photo: '',
    initials: 'PR',
    shortBio:
      'Ingeniero de software apasionado por el diseño de soluciones escalables y eficientes, con experiencia en entornos on-premise y cloud-native.',
    bio: 'Soy un ingeniero de software altamente capacitado y apasionado por el diseño y desarrollo de soluciones escalables y eficientes. Con experiencia en el desarrollo de software tanto on-premise como en entornos nativos de la nube, he demostrado habilidades sólidas en varios lenguajes de programación, incluyendo Java, C# y Python. Mi enfoque principal ha sido el diseño y la implementación de software de alta calidad que satisface las necesidades de miles de usuarios diarios, procesando eficientemente decenas de millones de transacciones en tiempo real.',
    workplace: 'DIAN — Dirección de Impuestos y Aduanas Nacionales',
    education: [
      {
        institution: 'Universidad de los Andes',
        degree: 'Master of Information Engineering',
        period: '2018 — 2023'
      },
      {
        institution: 'Universidad de los Andes',
        degree: 'Especialista en Construcción de Software',
        period: '2004 — 2005'
      },
      {
        institution: 'Universidad de Cundinamarca',
        degree: 'Ingeniería Informática (B.E.)',
        period: '1997 — 2002'
      }
    ],
    experience: [
      {
        company: 'DIAN',
        role: 'Ingeniero de software',
        period: 'ene 2018 — presente',
        summary:
          'Diseño e implementación del Servicio de Firma Electrónica y optimización de la arquitectura del Sistema de Factura Electrónica, soportando millones de transacciones diarias.'
      },
      {
        company: 'DIAN',
        role: 'Consultor Senior',
        period: 'ago 2003 — oct 2013',
        summary:
          'Participación en el diseño e implementación del modelo MUISCA y de la arquitectura transaccional, de concurrencia y seguridad de la plataforma.'
      }
    ],
    skills: ['Java', 'C#', 'Python', 'Big Data', 'Machine Learning', 'Design Patterns', 'Cloud Native'],
    social: {
      linkedin: 'https://www.linkedin.com/in/perozo',
      email: ''
    },
    accent: '#7aa2f7'
  },
  {
    id: 2,
    slug: 'adriana-rozo',
    name: 'Adriana Rozo',
    role: 'Ingeniera de Sistemas · Frontend & Data',
    location: 'Colombia',
    photo: '',
    initials: 'AR',
    shortBio:
      'Ingeniera de Sistemas con experiencia en desarrollo Frontend (Angular, TypeScript) y análisis espacial / temporal de datos con Python.',
    bio: 'Ingeniera de Sistemas con trayectoria combinando desarrollo Frontend e investigación en ciencia de datos. He participado en proyectos interdisciplinarios de análisis espacial y temporal, procesando datos provenientes de múltiples fuentes (raster, shapefiles, CSV, Excel, PDF) y aplicando técnicas como Random Forest y modelos ARIMA para la imputación e interpolación de series.',
    workplace: 'Cybercolombia — Investigación',
    education: [
      {
        institution: 'Universidad Nacional de Colombia',
        degree: 'Ingeniería de Sistemas',
        period: '1998 — 2002'
      }
    ],
    experience: [
      {
        company: 'Cybercolombia',
        role: 'Investigación — Análisis espacial y temporal',
        period: 'sep 2024 — nov 2024',
        summary:
          'Proyecto interdisciplinario para proyectar tendencias agrícolas en Cundinamarca. Procesamiento y limpieza de datos, imputación espacial con Random Forest y modelos ARIMA para series temporales.'
      },
      {
        company: 'Grupo de Gestión y Tecnología S.A.',
        role: 'Consultoría Frontend',
        period: 'jul 2023 — mar 2024',
        summary:
          'Implementación de sitios web con HTML, CSS, JavaScript, TypeScript y Angular 14.'
      },
      {
        company: 'Freelance',
        role: 'e-learning',
        period: '2016 — 2018',
        summary:
          'Proyectos de e-learning para instituciones educativas: JavaScript, jQuery, CreateJS, HTML5 y CSS.'
      }
    ],
    skills: ['Angular', 'TypeScript', 'Python', 'Pandas', 'GeoPandas', 'rasterio', 'Random Forest', 'ARIMA'],
    social: {
      linkedin: 'https://www.linkedin.com/in/adrianarozo-9b02725b',
      email: 'adrianis@gmail.com'
    },
    accent: '#9ece6a'
  },
  {
    id: 3,
    slug: 'juan-jose-bernal',
    name: 'Juan José Bernal Villamarín',
    role: 'Tech Lead · Senior Frontend / Fullstack Developer',
    location: 'Bogotá, Colombia',
    photo: '',
    initials: 'JB',
    shortBio:
      'Profesional con más de 20 años de experiencia en desarrollo de aplicaciones frontend. Líder técnico, comunicador y apasionado por la tecnología.',
    bio: 'I am a highly accomplished professional with over 20 years of experience in frontend application development. I possess a comprehensive understanding of a diverse range of technologies and programming languages, and I have a proven track record of success in creating scalable and high-performance applications. As a motivating and collaborative leader, I excel in fostering effective communication and collaboration across teams.',
    workplace: 'Parser — Senior Frontend Engineer',
    education: [
      {
        institution: 'Acámica',
        degree: 'Front-end avanzado en React',
        period: '2020'
      },
      {
        institution: 'Universidad Autónoma de Colombia',
        degree: 'Especialista en Gerencia de Tecnología',
        period: '2012 — 2013'
      },
      {
        institution: 'Universidad Distrital Francisco José de Caldas',
        degree: 'Ingeniería',
        period: ''
      }
    ],
    experience: [
      {
        company: 'Parser',
        role: 'Senior Frontend Engineer',
        period: 'oct 2024 — presente',
        summary: 'Desarrollo frontend con tecnologías modernas, liderazgo técnico y mentoría.'
      },
      {
        company: 'KLYM',
        role: 'Technical Lead',
        period: 'may 2023 — oct 2024',
        summary: 'Liderazgo técnico en aplicaciones financieras de uso intensivo.'
      },
      {
        company: 'Gorilla Logic',
        role: 'Senior Web Developer',
        period: 'nov 2020 — mar 2023',
        summary:
          'Arquitectura Jamstack con Next.js, Nuxt.js y Contentful. Migración de aplicaciones legacy, componentes React/Vue con TypeScript y Tailwind CSS, testing con Jest.'
      }
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Vue', 'Nuxt.js', 'Angular', 'Tailwind CSS', 'Jest', 'Team Leadership'],
    social: {
      linkedin: 'https://www.linkedin.com/in/juan-jose-bernal-v',
      email: 'juan.jose.bernal.villamarin@gmail.com'
    },
    accent: '#bb9af7'
  }
];

export const getMemberBySlug = (slug) => members.find((m) => m.slug === slug);
