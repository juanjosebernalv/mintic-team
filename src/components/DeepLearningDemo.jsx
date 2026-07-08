import { useEffect, useRef, useState, useCallback } from 'react';

/* ── constantes ── */
const CAPAS = [4, 6, 6, 4, 2];
const ETIQUETAS_CAPAS = ['Entrada', 'Oculta 1', 'Oculta 2', 'Oculta 3', 'Salida'];
const EPOCAS = 80;
const TA_RAPIDA = 0.12;   // tasa de aprendizaje rápida
const TA_LENTA  = 0.01;   // tasa de aprendizaje lenta

const C = {
  bg:     '#0f1410',
  accent: '#2dd4bf',
  copper: '#c47a3a',
  muted:  '#a8b5a4',
  dim:    '#667060',
  warn:   '#d4a947',
  border: '#1e2a1e',
  danger: '#e07068',
};

/* ── generadores de datos ── */
function generarPerdida(lr, epocas) {
  let loss = 2.4;
  return Array.from({ length: epocas }, () => {
    loss = Math.max(0.05, loss * (1 - lr * (0.9 + Math.random() * 0.2)) + (Math.random() - 0.5) * 0.08);
    return +loss.toFixed(4);
  });
}

function generarPrecision(perdida) {
  return perdida.map(l => Math.min(0.99, 1 - l / 3 + (Math.random() - 0.5) * 0.02));
}

function generarSerieTemporal(n = 120) {
  return Array.from({ length: n }, (_, i) =>
    +(i * 0.015 + Math.sin((i / n) * Math.PI * 4) * 1.2 + (Math.random() - 0.5) * 0.4 + 2).toFixed(3)
  );
}

/* ── helpers de layout ── */
function construirLayout(W, H) {
  const mX = 80, usableW = W - mX * 2, usableH = H - 50;
  return CAPAS.map((count, li) => {
    const x = mX + (li / (CAPAS.length - 1)) * usableW;
    return Array.from({ length: count }, (_, ni) => ({
      x,
      y: H / 2 + (ni - (count - 1) / 2) * (usableH / (count + 1)),
    }));
  });
}

function hexAlpha(r) {
  return Math.min(255, Math.max(0, Math.round(r * 255))).toString(16).padStart(2, '0');
}

/* ══════════════════════════════════════════════
   Red Neuronal — animación independiente y continua
══════════════════════════════════════════════ */
function RedNeuronalCanvas({ iniciado, nodeAct, connW }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function dibujar() {
      const W   = canvas.width;
      const H   = canvas.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, W, H);

      const layout  = construirLayout(W, H);
      const progreso = iniciado ? 1 : 0;
      const ahora   = Date.now();

      /* conexiones */
      for (let li = 0; li < layout.length - 1; li++) {
        layout[li].forEach((src, si) => {
          layout[li + 1].forEach((dst, di) => {
            const w     = connW[li]?.[si]?.[di] ?? 0.5;
            const alpha = 0.06 + w * 0.3 * progreso;
            const pulso = Math.sin(ahora / 400 + si * 0.9 + li) * 0.5 + 0.5;
            const grad  = ctx.createLinearGradient(src.x, src.y, dst.x, dst.y);
            grad.addColorStop(0, `${C.accent}${hexAlpha(alpha)}`);
            grad.addColorStop(1, `${C.copper}${hexAlpha(alpha * 0.5 + pulso * 0.07)}`);
            ctx.beginPath();
            ctx.moveTo(src.x, src.y);
            ctx.lineTo(dst.x, dst.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = 0.7 + w * 1.1 * progreso;
            ctx.stroke();
          });
        });
      }

      /* neuronas */
      layout.forEach((col, li) => {
        col.forEach(({ x, y }, ni) => {
          const act   = nodeAct[li]?.[ni] ?? 0.5;
          const pulso = Math.sin(ahora / 600 + ni * 1.3 + li * 0.7) * 0.5 + 0.5;
          const r     = 9 + act * 3 * progreso;
          const gr    = Math.max(r * 2.5, 1);
          const fr    = Math.max(r, 1);

          /* halo */
          const halo = ctx.createRadialGradient(x, y, 0, x, y, gr);
          halo.addColorStop(0, `${C.accent}${hexAlpha(0.07 + act * 0.16 * progreso + pulso * 0.05)}`);
          halo.addColorStop(1, '#00000000');
          ctx.beginPath();
          ctx.arc(x, y, gr, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();

          /* relleno */
          const fill = ctx.createRadialGradient(x - fr * 0.3, y - fr * 0.3, 0, x, y, fr);
          fill.addColorStop(0, li === 0 ? C.copper : C.accent);
          fill.addColorStop(1, C.bg);
          ctx.beginPath();
          ctx.arc(x, y, fr, 0, Math.PI * 2);
          ctx.fillStyle = fill;
          ctx.fill();

          /* borde */
          ctx.beginPath();
          ctx.arc(x, y, fr, 0, Math.PI * 2);
          ctx.strokeStyle   = li === CAPAS.length - 1 ? C.copper : C.accent;
          ctx.lineWidth     = 1.5;
          ctx.globalAlpha   = Math.min(1, 0.55 + act * 0.45 * progreso);
          ctx.stroke();
          ctx.globalAlpha   = 1;
        });
      });

      /* etiquetas de capas */
      ctx.font      = '11px ui-sans-serif,system-ui,sans-serif';
      ctx.textAlign = 'center';
      layout.forEach((col, li) => {
        ctx.fillStyle = C.muted;
        ctx.fillText(ETIQUETAS_CAPAS[li], col[0].x, H - 6);
      });

      /* paquetes de señal (paso frontal) */
      if (iniciado) {
        const t = (ahora / 1000) % 1;
        for (let li = 0; li < layout.length - 1; li++) {
          const si  = Math.floor(t * CAPAS[li]) % CAPAS[li];
          const di  = Math.floor(t * CAPAS[li + 1]) % CAPAS[li + 1];
          const src = layout[li][si];
          const dst = layout[li + 1][di];
          const px  = src.x + (dst.x - src.x) * t;
          const py  = src.y + (dst.y - src.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle   = C.warn;
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      rafRef.current = requestAnimationFrame(dibujar);
    }

    rafRef.current = requestAnimationFrame(dibujar);
    return () => cancelAnimationFrame(rafRef.current);
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [iniciado]);   // solo reinicia si cambia iniciado — el loop corre siempre

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={300}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}

/* ══════════════════════════════════════════════
   Gráfica de métrica genérica (Pérdida / Precisión)
══════════════════════════════════════════════ */
function MetricaCanvas({ datosRapido, datosLento, epoca, etiquetaY, formatoY }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const pL = 48, pR = 16, pT = 24, pB = 36;
    const gW = W - pL - pR, gH = H - pT - pB;

    const visR = datosRapido.slice(0, Math.max(1, epoca));
    const visL = datosLento.slice(0, Math.max(1, epoca));

    const todos  = [...datosRapido, ...datosLento];
    const minV   = Math.min(...todos) * 0.9;
    const maxV   = Math.max(...todos) * 1.06;
    const rango  = maxV - minV || 1;

    const tx = i => pL + (i / (EPOCAS - 1)) * gW;
    const ty = v => pT + gH - ((v - minV) / rango) * gH;

    /* rejilla */
    ctx.strokeStyle = C.border; ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = pT + (g / 4) * gH;
      ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(pL + gW, y); ctx.stroke();
      const val = maxV - (g / 4) * rango;
      ctx.fillStyle = C.dim; ctx.font = '10px ui-sans-serif,system-ui,sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(formatoY ? formatoY(val) : val.toFixed(2), pL - 5, y + 4);
    }

    /* ejes */
    ctx.strokeStyle = C.border; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pL, pT); ctx.lineTo(pL, pT + gH); ctx.lineTo(pL + gW, pT + gH); ctx.stroke();

    /* etiquetas eje X */
    ctx.fillStyle = C.dim; ctx.font = '10px ui-sans-serif,system-ui,sans-serif'; ctx.textAlign = 'center';
    [0, 20, 40, 60, 79].forEach(i => ctx.fillText(`Ép ${i + 1}`, tx(i), pT + gH + 20));

    /* curva lenta (punteada) */
    if (visL.length > 1) {
      ctx.beginPath();
      visL.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.strokeStyle = C.copper; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.globalAlpha = 0.75;
      ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }

    /* curva rápida */
    if (visR.length > 1) {
      ctx.beginPath();
      visR.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.95; ctx.stroke(); ctx.globalAlpha = 1;
      const lx = tx(visR.length - 1), ly = ty(visR[visR.length - 1]);
      ctx.beginPath(); ctx.arc(lx, ly, 4.5, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill();
    }

    /* leyenda */
    const lY = pT + 14;
    [[C.accent, `TA rápida (${TA_RAPIDA})`], [C.copper, `TA lenta (${TA_LENTA})`]].forEach(([col, txt], i) => {
      const lx = pL + 8 + i * 130;
      ctx.fillStyle = col; ctx.fillRect(lx, lY - 6, 18, 3);
      ctx.fillStyle = C.muted; ctx.font = '10px ui-sans-serif,system-ui,sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(txt, lx + 24, lY);
    });

    /* etiqueta eje Y */
    ctx.save(); ctx.translate(12, pT + gH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = C.muted; ctx.font = '11px ui-sans-serif,system-ui,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(etiquetaY, 0, 0); ctx.restore();
  }, [epoca, datosRapido, datosLento, etiquetaY, formatoY]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={210}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}

/* ══════════════════════════════════════════════
   Serie Temporal
══════════════════════════════════════════════ */
function SerieTemporalCanvas({ serie, prediccion, paso }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const pL = 48, pR = 16, pT = 24, pB = 36;
    const gW = W - pL - pR, gH = H - pT - pB;
    const n  = serie.length;

    const todos = [...serie, ...prediccion];
    const minV  = Math.min(...todos) * 0.88;
    const maxV  = Math.max(...todos) * 1.08;
    const rango = maxV - minV || 1;

    const tx = i => pL + (i / (n - 1)) * gW;
    const ty = v => pT + gH - ((v - minV) / rango) * gH;

    /* rejilla */
    ctx.strokeStyle = C.border; ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = pT + (g / 4) * gH;
      ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(pL + gW, y); ctx.stroke();
    }
    ctx.strokeStyle = C.border; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pL, pT); ctx.lineTo(pL, pT + gH); ctx.lineTo(pL + gW, pT + gH); ctx.stroke();

    /* valor real */
    ctx.beginPath();
    serie.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
    ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1;

    /* predicción del modelo */
    const vis = prediccion.slice(0, paso);
    if (vis.length > 1) {
      ctx.beginPath();
      vis.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      const grad = ctx.createLinearGradient(pL, 0, pL + gW, 0);
      grad.addColorStop(0, C.accent); grad.addColorStop(1, C.copper);
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(tx(vis.length - 1), ty(vis[vis.length - 1]), 5, 0, Math.PI * 2);
      ctx.fillStyle = C.accent; ctx.fill();
    }

    /* leyenda */
    const lY = pT + 14;
    ctx.fillStyle = C.muted; ctx.fillRect(pL + 10, lY - 5, 18, 2);
    ctx.fillStyle = C.muted; ctx.font = '11px ui-sans-serif,system-ui,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Valor real', pL + 34, lY);
    ctx.fillStyle = C.accent; ctx.fillRect(pL + 118, lY - 5, 18, 2);
    ctx.fillText('Predicción del modelo', pL + 142, lY);

    /* eje X */
    ctx.fillStyle = C.dim; ctx.font = '10px ui-sans-serif,system-ui,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Pasos temporales', pL + gW / 2, pT + gH + 28);
  }, [serie, prediccion, paso]);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={200}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}

/* ══════════════════════════════════════════════
   Componente principal
══════════════════════════════════════════════ */
export default function DeepLearningDemo() {
  const [ejecutando, setEjecutando] = useState(false);
  const [iniciado,   setIniciado]   = useState(false);  // nunca vuelve a false
  const [epoca,      setEpoca]      = useState(0);
  const [pasoST,     setPasoST]     = useState(0);

  const rafRef   = useRef(null);
  const lastRef  = useRef(0);
  const epocaRef = useRef(0);
  const pasoRef  = useRef(0);

  /* datos estables */
  const perdidaRapida   = useRef(generarPerdida(TA_RAPIDA, EPOCAS)).current;
  const perdidaLenta    = useRef(generarPerdida(TA_LENTA,  EPOCAS)).current;
  const precisionRapida = useRef(generarPrecision(perdidaRapida)).current;
  const precisionLenta  = useRef(generarPrecision(perdidaLenta)).current;
  const serieTemporal   = useRef(generarSerieTemporal(120)).current;
  const prediccion      = useRef(generarSerieTemporal(120)).current;

  const nodeAct = useRef(
    CAPAS.map(cnt => Array.from({ length: cnt }, () => Math.random()))
  ).current;

  const connW = useRef(
    CAPAS.slice(0, -1).map((cnt, li) =>
      Array.from({ length: cnt }, () =>
        Array.from({ length: CAPAS[li + 1] }, () => Math.random())
      )
    )
  ).current;

  const ticker = useCallback((ts) => {
    if (ts - lastRef.current > 120) {
      lastRef.current = ts;
      if (epocaRef.current < EPOCAS) { epocaRef.current += 1; setEpoca(epocaRef.current); }
      if (pasoRef.current < serieTemporal.length) { pasoRef.current += 2; setPasoST(pasoRef.current); }
      if (epocaRef.current >= EPOCAS && pasoRef.current >= serieTemporal.length) {
        setEjecutando(false);
        return;   // el ticker se detiene — la red neuronal sigue animándose por su cuenta
      }
    }
    rafRef.current = requestAnimationFrame(ticker);
  }, [serieTemporal.length]);

  useEffect(() => {
    if (ejecutando) { rafRef.current = requestAnimationFrame(ticker); }
    else            { cancelAnimationFrame(rafRef.current); }
    return () => cancelAnimationFrame(rafRef.current);
  }, [ejecutando, ticker]);

  const manejarClick = () => {
    if (ejecutando) { setEjecutando(false); return; }
    epocaRef.current = 0; pasoRef.current = 0;
    setEpoca(0); setPasoST(0);
    setIniciado(true);
    setEjecutando(true);
  };

  const perdidaActual   = perdidaRapida[Math.max(0, epoca - 1)]?.toFixed(4) ?? '—';
  const precisionActual = ((precisionRapida[Math.max(0, epoca - 1)] ?? 0) * 100).toFixed(1);

  return (
    <section className="dl-demo">
      <div className="container">

        {/* encabezado */}
        <div className="dl-demo__header">
          <h1 className="dl-demo__title">
            Visualizador de <span className="accent">Entrenamiento</span> Deep Learning
          </h1>
          <p className="dl-demo__sub">
            Red neuronal de {CAPAS.length} capas entrenada sobre datos de series temporales.
            Compara la convergencia con <strong>tasa de aprendizaje rápida vs lenta</strong> en tiempo real.
          </p>
        </div>

        {/* estadísticas */}
        <div className="dl-demo__stats">
          {[
            { etiqueta: 'Época',          valor: `${epoca} / ${EPOCAS}` },
            { etiqueta: 'Pérdida',        valor: perdidaActual, hi: true },
            { etiqueta: 'Precisión',      valor: `${precisionActual}%` },
            { etiqueta: 'TA Rápida',      valor: TA_RAPIDA },
            { etiqueta: 'Arquitectura',   valor: CAPAS.join('→') },
          ].map(({ etiqueta, valor, hi }) => (
            <div key={etiqueta} className="dl-stat">
              <span className="dl-stat__label">{etiqueta}</span>
              <span className={`dl-stat__value${hi ? ' dl-stat__value--hi' : ''}`}>{valor}</span>
            </div>
          ))}
        </div>

        {/* controles */}
        <div className="dl-demo__controls">
          <button
            className={`dl-btn dl-btn--primary${ejecutando ? ' dl-btn--active' : ''}`}
            onClick={manejarClick}
          >
            {ejecutando ? '⏸ Pausar' : iniciado ? '▶ Reiniciar' : '▶ Iniciar Entrenamiento'}
          </button>
          <div className="dl-progress-wrap">
            <div className="dl-progress" style={{ width: `${(epoca / EPOCAS) * 100}%` }} />
          </div>
        </div>

        {/* grilla principal */}
        <div className="dl-demo__grid">

          {/* arquitectura — columna izquierda, fila 1 */}
          <div className="dl-card">
            <div className="dl-card__label">Arquitectura neuronal · {CAPAS.join(' → ')} neuronas</div>
            <RedNeuronalCanvas iniciado={iniciado} nodeAct={nodeAct} connW={connW} />
          </div>

          {/* métricas — columna derecha, fila 1: dos gráficas apiladas */}
          <div className="dl-card dl-card--metrics">
            <div className="dl-card__label">Pérdida por época</div>
            <MetricaCanvas
              datosRapido={perdidaRapida}
              datosLento={perdidaLenta}
              epoca={epoca}
              etiquetaY="Pérdida"
            />
            <div className="dl-card__label dl-card__label--mt">Precisión por época</div>
            <MetricaCanvas
              datosRapido={precisionRapida}
              datosLento={precisionLenta}
              epoca={epoca}
              etiquetaY="Precisión"
              formatoY={v => `${(v * 100).toFixed(0)}%`}
            />
          </div>

          {/* serie temporal — fila 2, ancho completo */}
          <div className="dl-card dl-card--wide">
            <div className="dl-card__label">Predicción de serie temporal · TA rápida</div>
            <SerieTemporalCanvas serie={serieTemporal} prediccion={prediccion} paso={pasoST} />
          </div>

        </div>

        {/* explicaciones */}
        <div className="dl-demo__explainer">
          <div className="dl-explain-card">
            <h3>Arquitectura</h3>
            <p>Red totalmente conectada con {CAPAS.length} capas ({CAPAS.join('→')} neuronas).
            Las capas ocultas usan activación ReLU y dropout para regularización.
            Los paquetes animados representan la propagación hacia adelante.</p>
          </div>
          <div className="dl-explain-card">
            <h3>Tasa de Aprendizaje Rápida</h3>
            <p>TA = {TA_RAPIDA} permite pasos de gradiente grandes — converge en menos épocas
            pero con riesgo de sobrepasar el mínimo. Ideal para entrenamiento urgente
            en datos de series temporales con patrones claros.</p>
          </div>
          <div className="dl-explain-card">
            <h3>Series Temporales</h3>
            <p>El modelo aprende a predecir una señal estacional de 120 pasos con tendencia y ruido.
            La línea teal muestra la predicción del modelo; la gris es el valor real de referencia.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
