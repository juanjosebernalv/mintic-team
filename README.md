<div align="center">

# 👥 Team Showcase

### Sitio web del equipo — Modo oscuro · Parallax · Responsivo

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-licencia)
[![Deploy: Netlify](https://img.shields.io/badge/Netlify-Ready-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Deploy: GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Ready-181717?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)

</div>

---

## ✨ Características

- 🌙 **Modo oscuro nativo** con paleta sobria y profesional.
- 🎢 **Efecto parallax vertical** en hero y secciones de detalle.
- 📱 **Diseño 100% responsivo** (mobile-first).
- 🎯 **Cards interactivas** con animaciones suaves de revelado al hacer scroll.
- 🧑‍💼 **Página de detalle por integrante** con timeline, educación y skills.
- 🔌 **Fácil de extender:** agrega un objeto al arreglo `members.js` y listo.
- ♿ **Accesible:** respeta `prefers-reduced-motion`, semántica HTML y contraste AA.
- 🚀 **Despliegue rápido** en GitHub Pages o Netlify.

---

## 🧱 Stack tecnológico

| Categoría | Tecnología |
|---|---|
| ⚛️ UI | React 18 |
| ⚡ Build tool | Vite 5 |
| 🧭 Routing | React Router DOM 6 (HashRouter para GitHub Pages) |
| 🎨 Estilos | CSS moderno (variables, grid, flexbox) |
| 🧪 Lint / Test | (Opcional — agregar a gusto) |

---

## 📂 Estructura del proyecto

```text
team-showcase/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Avatar.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── MemberCard.jsx
│   │   ├── Parallax.jsx
│   │   ├── Reveal.jsx
│   │   └── SocialLinks.jsx
│   ├── data/
│   │   └── members.js          # 👈 Fuente única de datos del equipo
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MemberDetail.jsx
│   │   └── NotFound.jsx
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── netlify.toml
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Inicio rápido

### Requisitos

- 📦 [Node.js](https://nodejs.org/) `>= 18`
- 🧶 npm, pnpm o yarn

### Instalación

```bash
git clone https://github.com/<tu-usuario>/team-showcase.git
cd team-showcase
npm install
```

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | 🛠️ Arranca el servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | 📦 Genera la build de producción en `dist/` |
| `npm run preview` | 👀 Sirve la build localmente para verificación |
| `npm run deploy` | 🚀 Publica `dist/` en GitHub Pages (rama `gh-pages`) |

---

## 👤 Agregar un nuevo integrante

Edita `src/data/members.js` y añade un objeto siguiendo esta forma:

```js
{
  id: 4,
  slug: 'nombre-apellido',          // identificador URL-friendly único
  name: 'Nombre Apellido',
  role: 'Cargo / Rol',
  location: 'Ciudad, País',
  photo: '',                         // URL de foto (opcional)
  initials: 'NA',                    // fallback si no hay foto
  shortBio: 'Descripción breve para la home.',
  bio: 'Descripción extendida para la página de detalle.',
  workplace: 'Empresa actual',
  education: [
    { institution: 'Universidad', degree: 'Título', period: '2018 — 2022' }
  ],
  experience: [
    { company: 'Empresa', role: 'Cargo', period: '2024 — presente', summary: '...' }
  ],
  skills: ['React', 'TypeScript'],
  social: {
    linkedin: 'https://www.linkedin.com/in/usuario',
    email: 'correo@ejemplo.com'
  },
  accent: '#7aa2f7'                  // color de acento personalizado
}
```

✨ La home y las rutas detalle se actualizan automáticamente.

---

## ☁️ Despliegue

### 🌐 Netlify (recomendado)

1. Sube el repo a GitHub.
2. En Netlify → **Add new site** → **Import an existing project**.
3. Selecciona el repo. La configuración se toma automáticamente de `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. ¡Listo! Cada push a `main` despliega automáticamente.

### 🐙 GitHub Pages

1. En `vite.config.js`, ajusta la propiedad `base` con el nombre de tu repositorio:

   ```js
   base: '/team-showcase/'
   ```

2. Instala (ya incluido) y ejecuta:

   ```bash
   npm run build
   npm run deploy
   ```

3. En GitHub: **Settings → Pages → Source: `gh-pages` branch**.

> ℹ️ El proyecto usa `HashRouter` para evitar problemas de _refresh_ en GitHub Pages.

---

## 🎨 Personalización

| Qué cambiar | Dónde |
|---|---|
| 🎨 Colores y tipografía | `src/styles/main.css` (variables CSS al inicio) |
| 🧑‍🤝‍🧑 Integrantes | `src/data/members.js` |
| 🧭 Navegación | `src/components/Header.jsx` |
| 🌀 Velocidad parallax | Prop `speed` del componente `<Parallax />` |
| 🪪 Favicon / título | `public/favicon.svg` y `index.html` |

---

## 👥 Equipo actual

| 👤 | Integrante | Rol | 🔗 |
|---|---|---|---|
| 🧑‍💻 | **Pedro Rozo** | Software Developer · Architect · Data Engineer | [LinkedIn](https://www.linkedin.com/in/perozo) |
| 👩‍💻 | **Adriana Rozo** | Ingeniera de Sistemas · Frontend & Data | [LinkedIn](https://www.linkedin.com/in/adrianarozo-9b02725b) |
| 🧑‍💻 | **Juan José Bernal Villamarín** | Tech Lead · Senior Frontend / Fullstack | [LinkedIn](https://www.linkedin.com/in/juan-jose-bernal-v) |

---

## 🤝 Contribuir

¿Quieres mejorar el sitio? ¡Genial!

1. 🍴 Haz fork del repo
2. 🌱 Crea una rama: `git checkout -b feat/mi-feature`
3. 💾 Commit: `git commit -m "feat: agrega mi feature"`
4. 📤 Push: `git push origin feat/mi-feature`
5. 🔁 Abre un Pull Request

---

## 📝 Licencia

Distribuido bajo licencia **MIT**. Consulta `LICENSE` para más información.

---

<div align="center">

Hecho con ❤️ y ⚛️ React por el equipo

</div>
