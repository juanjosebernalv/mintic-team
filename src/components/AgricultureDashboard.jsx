import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Leaf, TrendingUp, Zap, Target,
  ChevronUp, ChevronDown, ChevronsUpDown,
  AlertCircle, SlidersHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ── Palette ───────────────────────────────────────────────────────────────
const C = {
  turquesa: '#2dd4bf', dorado: '#d4a947', verde: '#86c87a',
  cobre: '#c47a3a',    naranja: '#e07040', lavanda: '#8b7cf8', azul: '#60a5fa',
  bg: '#090c0e', card: '#0f1410', card2: '#141a14',
  border: '#1e2a1e', borderStr: '#2a3d2a',
  text: '#e8ece6', muted: '#a8b5a4', dim: '#667060',
  danger: '#e07068',
};
const CHART_COLORS = [C.turquesa, C.dorado, C.verde, C.cobre, C.naranja, C.lavanda, C.azul];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ── Crop definitions ──────────────────────────────────────────────────────
const CULTIVOS = {
  Papa:      { rendBase: 19,  tonBase: 260, peaks: [3,4,9,10],  boyF: 1.30 },
  Maíz:      { rendBase: 3.3, tonBase: 85,  peaks: [4,5,10,11], boyF: 0.90 },
  Frijol:    { rendBase: 1.2, tonBase: 32,  peaks: [3,4,9],     boyF: 1.10 },
  Arveja:    { rendBase: 2.2, tonBase: 58,  peaks: [3,4,10],    boyF: 1.15 },
  Cebolla:   { rendBase: 22,  tonBase: 190, peaks: [1,2,6,7],   boyF: 0.80 },
  Zanahoria: { rendBase: 19,  tonBase: 150, peaks: [5,6,11,12], boyF: 1.05 },
  Trigo:     { rendBase: 2.6, tonBase: 65,  peaks: [3,4,9,10],  boyF: 1.20 },
};

// ── Deterministic pseudo-random (LCG) — 168 records ──────────────────────
const RAW_DATA = (() => {
  let s = 7919;
  const r01 = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const rf  = (lo, hi) => lo + r01() * (hi - lo);
  const ri  = (lo, hi) => Math.round(rf(lo, hi));
  const rows = [];

  Object.entries(CULTIVOS).forEach(([cultivo, p]) => {
    ['Cundinamarca', 'Boyacá'].forEach(dept => {
      const dF = dept === 'Boyacá' ? p.boyF : 1.0;
      for (let mes = 1; mes <= 12; mes++) {
        const peak  = p.peaks.includes(mes);
        const mF    = peak ? rf(1.2, 1.55) : rf(0.55, 0.92);
        const base  = p.tonBase * mF * dF;
        const tonEst  = Math.max(8,  ri(base * 0.88, base * 1.14));
        const tonHist = Math.max(6,  ri(tonEst * 0.78, tonEst * 1.06));
        const rend    = Math.max(0.4, +(p.rendBase * (peak ? rf(1.1,1.32) : rf(0.78,1.02))).toFixed(1));
        const efic    = Math.min(98, ri(peak ? 68 : 42, peak ? 97 : 80));
        const precip  = ri(peak ? 95 : 20, peak ? 210 : 90);
        const temp    = ri(dept === 'Boyacá' ? 9 : 12, dept === 'Boyacá' ? 16 : 22);
        const conf    = Math.min(98, ri(62, 98));
        const rv      = r01();
        const cond    = peak
          ? (rv > 0.28 ? 'Óptimo' : 'Bueno')
          : (rv > 0.55 ? 'Bueno' : rv > 0.25 ? 'Óptimo' : 'Regular');
        rows.push({
          departamento: dept, cultivo, mes, mesNombre: MESES[mes - 1],
          toneladas_estimadas:  tonEst,
          toneladas_historicas: tonHist,
          rendimiento_ton_ha:   rend,
          eficiencia_recursos:  efic,
          precipitacion_mm:     precip,
          temperatura_promedio: temp,
          indice_confianza:     conf,
          condicion_suelo:      cond,
          epoca: mes <= 6 ? 'Primer semestre' : 'Segundo semestre',
        });
      }
    });
  });
  return rows;
})();

// ── Helpers ───────────────────────────────────────────────────────────────
const sumF  = (arr, fn) => arr.reduce((s, d) => s + fn(d), 0);
const avgF  = (arr, fn) => arr.length ? sumF(arr, fn) / arr.length : 0;
const fmt   = n => Math.round(n).toLocaleString('es-CO');
const fmtF  = (n, d = 1) => (+n).toFixed(d);

function heatColor(v, lo, hi) {
  if (v == null) return C.card2;
  const t = Math.max(0, Math.min(1, (v - lo) / ((hi - lo) || 1)));
  const lerp = (a, b, u) => Math.round(a + (b - a) * u);
  if (t < 0.5) {
    const u = t * 2;
    return `rgb(${lerp(220,212,u)},${lerp(100,169,u)},${lerp(80,71,u)})`;
  }
  const u = (t - 0.5) * 2;
  return `rgb(${lerp(212,134,u)},${lerp(169,200,u)},${lerp(71,122,u)})`;
}

// ── Shared styles ─────────────────────────────────────────────────────────
const CARD = {
  background: `linear-gradient(155deg, ${C.card} 0%, ${C.card2} 100%)`,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: '1.5rem',
};
const CHART_H3 = { margin: '0 0 .35rem', fontSize: '1rem', fontWeight: 600, color: C.text, letterSpacing: '-.01em' };
const EYEBROW  = { fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', color: C.dim };
const SEL = {
  background: C.card2, border: `1px solid ${C.borderStr}`, borderRadius: 8,
  color: C.muted, fontSize: '.875rem', padding: '.5rem 2rem .5rem .85rem',
  cursor: 'pointer', outline: 'none', appearance: 'none', minWidth: 150,
};
const BTN_PAGE = (active) => ({
  background: active ? C.turquesa : C.card2,
  border: `1px solid ${active ? C.turquesa : C.borderStr}`,
  borderRadius: 8, color: active ? '#0b0d12' : C.muted,
  padding: '.38rem .65rem', cursor: active ? 'default' : 'pointer',
  fontSize: '.82rem', fontWeight: active ? 700 : 400, minWidth: 34,
});

// ── Custom tooltip ────────────────────────────────────────────────────────
function CTip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.borderStr}`, borderRadius: 8, padding: '8px 12px', fontSize: '.8rem', color: C.text }}>
      {label && <p style={{ margin: '0 0 4px', color: C.muted, fontWeight: 600, fontSize: '.75rem' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', color: p.color || C.turquesa }}>
          <span style={{ color: C.muted }}>{p.name}:</span>{' '}
          <strong>{typeof p.value === 'number' ? p.value.toLocaleString('es-CO') : p.value}{unit}</strong>
        </p>
      ))}
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, unit, delta, deltaLabel = 'vs. histórico' }) {
  const pos = delta >= 0;
  return (
    <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: '.6rem', transition: 'transform .2s,box-shadow .2s', cursor: 'default' }}
         onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,.45)'; }}
         onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={EYEBROW}>{label}</span>
        <span style={{ color: C.turquesa, opacity: .7 }}>{icon}</span>
      </div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:'.45rem' }}>
        <span style={{ fontSize:'1.8rem', fontWeight:700, color:C.text, letterSpacing:'-.025em', lineHeight:1 }}>{value}</span>
        <span style={{ color:C.dim, fontSize:'.85rem', paddingBottom:'.12rem' }}>{unit}</span>
      </div>
      {delta != null && (
        <div style={{ fontSize:'.78rem', color: pos ? C.verde : C.danger, display:'flex', alignItems:'center', gap:'.3rem' }}>
          {pos ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          {pos ? '+' : ''}{fmtF(delta)}% {deltaLabel}
        </div>
      )}
    </div>
  );
}

// ── Sortable TH ───────────────────────────────────────────────────────────
function STh({ field, label, sortField, sortDir, onSort }) {
  const active = field === sortField;
  return (
    <th onClick={() => onSort(field)} style={{
      padding:'.6rem .85rem', fontSize:'.72rem', textTransform:'uppercase',
      letterSpacing:'.1em', color: active ? C.turquesa : C.dim, cursor:'pointer',
      background: C.card, borderBottom:`1px solid ${C.borderStr}`, whiteSpace:'nowrap',
      userSelect:'none', fontWeight:600, textAlign:'left',
    }}>
      <span style={{ display:'flex', alignItems:'center', gap:'.3rem' }}>
        {label}
        {active ? (sortDir==='asc' ? <ChevronUp size={11}/> : <ChevronDown size={11}/>) : <ChevronsUpDown size={11} style={{ opacity:.3 }}/>}
      </span>
    </th>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function AgricultureDashboard() {
  const [filters, setFilters] = useState({ dept:'all', cultivo:'all', epoca:'all', cond:'all' });
  const [sortField, setSortField] = useState('mes');
  const [sortDir,   setSortDir]   = useState('asc');
  const [page,      setPage]      = useState(1);
  const [isMobile,  setIsMobile]  = useState(false);
  const PAGE = 10;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cultivoList = useMemo(() => [...new Set(RAW_DATA.map(d => d.cultivo))].sort(), []);
  const setF = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };

  // Filtered data
  const data = useMemo(() => RAW_DATA.filter(d => {
    if (filters.dept    !== 'all' && d.departamento    !== filters.dept)    return false;
    if (filters.cultivo !== 'all' && d.cultivo         !== filters.cultivo) return false;
    if (filters.epoca   !== 'all' && d.epoca           !== filters.epoca)   return false;
    if (filters.cond    !== 'all' && d.condicion_suelo !== filters.cond)    return false;
    return true;
  }), [filters]);

  // KPIs
  const kpis = useMemo(() => {
    if (!data.length) return null;
    const totalEst  = sumF(data, d => d.toneladas_estimadas);
    const totalHist = sumF(data, d => d.toneladas_historicas);
    const avgRend   = avgF(data, d => d.rendimiento_ton_ha);
    const avgEfic   = avgF(data, d => d.eficiencia_recursos);
    const avgConf   = avgF(data, d => d.indice_confianza);
    return {
      totalEst, totalHist,
      deltaTon:  ((totalEst - totalHist) / totalHist) * 100,
      avgRend,   deltaRend: ((avgRend  - avgF(RAW_DATA, d => d.rendimiento_ton_ha))  / avgF(RAW_DATA, d => d.rendimiento_ton_ha))  * 100,
      avgEfic,   deltaEfic: ((avgEfic  - avgF(RAW_DATA, d => d.eficiencia_recursos)) / avgF(RAW_DATA, d => d.eficiencia_recursos)) * 100,
      avgConf,   deltaConf: ((avgConf  - avgF(RAW_DATA, d => d.indice_confianza))    / avgF(RAW_DATA, d => d.indice_confianza))    * 100,
    };
  }, [data]);

  // Chart 1: grouped bar by cultivo
  const barData = useMemo(() => {
    const m = {};
    data.forEach(d => {
      if (!m[d.cultivo]) m[d.cultivo] = { cultivo: d.cultivo, Estimadas: 0, Históricas: 0 };
      m[d.cultivo].Estimadas  += d.toneladas_estimadas;
      m[d.cultivo].Históricas += d.toneladas_historicas;
    });
    return Object.values(m);
  }, [data]);

  // Chart 2: line monthly
  const lineData = useMemo(() => {
    const m = {};
    data.forEach(d => {
      if (!m[d.mes]) m[d.mes] = { _mes: d.mes, mes: d.mesNombre.slice(0,3), Cundinamarca: 0, Boyacá: 0 };
      m[d.mes][d.departamento] += d.toneladas_estimadas;
    });
    return Object.values(m).sort((a, b) => a._mes - b._mes);
  }, [data]);

  // Chart 3: stacked bar rendimiento × condicion
  const stackData = useMemo(() => {
    const m = {};
    data.forEach(d => {
      if (!m[d.cultivo]) m[d.cultivo] = { cultivo:d.cultivo, Óptimo:[], Bueno:[], Regular:[] };
      m[d.cultivo][d.condicion_suelo].push(d.rendimiento_ton_ha);
    });
    const av = arr => arr.length ? +(arr.reduce((s,v)=>s+v,0)/arr.length).toFixed(1) : 0;
    return Object.values(m).map(r => ({ cultivo:r.cultivo, Óptimo:av(r.Óptimo), Bueno:av(r.Bueno), Regular:av(r.Regular) }));
  }, [data]);

  // Chart 4: area efficiency by month
  const areaData = useMemo(() => {
    const m = {};
    data.forEach(d => {
      if (!m[d.mes]) m[d.mes] = { _mes:d.mes, mes:d.mesNombre.slice(0,3), cnd:[], boy:[] };
      if (d.departamento === 'Cundinamarca') m[d.mes].cnd.push(d.eficiencia_recursos);
      else m[d.mes].boy.push(d.eficiencia_recursos);
    });
    const av = arr => arr.length ? +(arr.reduce((s,v)=>s+v,0)/arr.length).toFixed(1) : null;
    return Object.values(m).sort((a,b)=>a._mes-b._mes).map(r => ({
      mes: r.mes, Cundinamarca: av(r.cnd), Boyacá: av(r.boy),
    }));
  }, [data]);

  // Chart 5: pie by cultivo
  const pieData = useMemo(() => {
    const m = {};
    data.forEach(d => { m[d.cultivo] = (m[d.cultivo]||0) + d.toneladas_estimadas; });
    return Object.entries(m).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [data]);

  // Chart 6: heatmap
  const heatmap = useMemo(() => {
    const mx = {};
    data.forEach(d => {
      const k = `${d.cultivo}||${d.mes}`;
      if (!mx[k]) mx[k] = { t:0, n:0 };
      mx[k].t += d.rendimiento_ton_ha; mx[k].n++;
    });
    const crops = [...new Set(data.map(d=>d.cultivo))].sort();
    const months = [...new Set(data.map(d=>d.mes))].sort((a,b)=>a-b);
    const get = (c,m) => { const e=mx[`${c}||${m}`]; return e ? +(e.t/e.n).toFixed(1) : null; };
    const vals = Object.values(mx).map(e=>e.t/e.n);
    return { crops, months, get, lo:vals.length?Math.min(...vals):0, hi:vals.length?Math.max(...vals):1 };
  }, [data]);

  // Table: sorted + paginated
  const tableRows = useMemo(() => [...data].sort((a, b) => {
    const av=a[sortField], bv=b[sortField];
    if (typeof av==='string') return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir==='asc' ? av-bv : bv-av;
  }), [data, sortField, sortDir]);

  const totalPages = Math.ceil(tableRows.length / PAGE);
  const pageRows   = tableRows.slice((page-1)*PAGE, page*PAGE);
  const onSort = (f) => { if(f===sortField) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortField(f);setSortDir('asc');} setPage(1); };

  const cols = '1fr 1fr';

  return (
    <section style={{ padding:'5rem 0 6rem' }}>
      <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 1.25rem' }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header style={{ textAlign:'center', maxWidth:680, margin:'0 auto 3.5rem' }}>
          <span style={{ ...EYEBROW, display:'block', marginBottom:'.75rem' }}>
            — Análisis de predicciones del modelo
          </span>
          <h2 style={{
            background:'linear-gradient(110deg,#2dd4bf 10%,#c47a3a 90%)',
            WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent',
            fontSize:'clamp(1.9rem, 3vw + .5rem, 2.9rem)',
            fontWeight:700, letterSpacing:'-.025em', margin:'0 0 .5rem', lineHeight:1.12,
          }}>
            Dashboard de Predicciones
          </h2>
          <p style={{ fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.18em', color:C.turquesa, fontWeight:500, margin:'0 0 1rem' }}>
            Análisis de cultivos — Cundinamarca & Boyacá
          </p>
          <p style={{ color:C.muted, fontSize:'1rem', maxWidth:'56ch', margin:'0 auto', lineHeight:1.7 }}>
            Explora las predicciones del modelo de IA: compara estimaciones con datos históricos,
            analiza rendimientos por mes y cultivo, y evalúa la eficiencia de recursos en la región andina colombiana.
          </p>
        </header>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div style={{ ...CARD, marginBottom:'2rem', display:'flex', flexWrap:'wrap', alignItems:'flex-end', gap:'1rem' }}>
          <span style={{ display:'flex', alignItems:'center', gap:'.5rem', color:C.turquesa, fontWeight:600, fontSize:'.875rem' }}>
            <SlidersHorizontal size={16}/> Filtros
          </span>
          {[
            { label:'Departamento', key:'dept', opts:[['all','Todos'],['Cundinamarca','Cundinamarca'],['Boyacá','Boyacá']] },
            { label:'Cultivo',      key:'cultivo', opts:[['all','Todos'],...cultivoList.map(c=>[c,c])] },
            { label:'Época',        key:'epoca', opts:[['all','Todos'],['Primer semestre','1er semestre'],['Segundo semestre','2do semestre']] },
            { label:'Suelo',        key:'cond', opts:[['all','Todos'],['Óptimo','Óptimo'],['Bueno','Bueno'],['Regular','Regular']] },
          ].map(f => (
            <div key={f.key} style={{ display:'flex', flexDirection:'column', gap:'.25rem' }}>
              <span style={EYEBROW}>{f.label}</span>
              <div style={{ position:'relative' }}>
                <select value={filters[f.key]} onChange={e=>setF(f.key,e.target.value)} style={SEL}>
                  {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown size={12} style={{ position:'absolute', right:'.6rem', top:'50%', transform:'translateY(-50%)', color:C.dim, pointerEvents:'none' }}/>
              </div>
            </div>
          ))}
          {Object.values(filters).some(v=>v!=='all') && (
            <button onClick={()=>{ setFilters({dept:'all',cultivo:'all',epoca:'all',cond:'all'}); setPage(1); }}
              style={{ marginLeft:'auto', background:'transparent', border:`1px solid ${C.borderStr}`, borderRadius:8, color:C.muted, fontSize:'.8rem', padding:'.45rem .85rem', cursor:'pointer' }}>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {data.length === 0 && (
          <div style={{ ...CARD, textAlign:'center', padding:'4rem 2rem' }}>
            <AlertCircle size={44} style={{ margin:'0 auto .75rem', color:C.dim }}/>
            <p style={{ fontSize:'1.05rem', color:C.muted, margin:'0 0 .4rem' }}>Sin resultados</p>
            <p style={{ fontSize:'.875rem', color:C.dim, margin:0 }}>No hay datos para los filtros seleccionados.</p>
          </div>
        )}

        {kpis && (<>

          {/* ── KPIs ─────────────────────────────────────────────────── */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
            <KpiCard icon={<Leaf size={18}/>}       label="Total Ton. Estimadas"  value={fmt(kpis.totalEst)}        unit="ton"    delta={kpis.deltaTon}  />
            <KpiCard icon={<TrendingUp size={18}/>}  label="Rendimiento Promedio"  value={fmtF(kpis.avgRend)}       unit="ton/ha" delta={kpis.deltaRend} deltaLabel="vs. global" />
            <KpiCard icon={<Zap size={18}/>}         label="Eficiencia Recursos"   value={Math.round(kpis.avgEfic)} unit="%"      delta={kpis.deltaEfic} deltaLabel="vs. global" />
            <KpiCard icon={<Target size={18}/>}      label="Confianza del Modelo"  value={Math.round(kpis.avgConf)} unit="%"      delta={kpis.deltaConf} deltaLabel="vs. global" />
          </div>

          {/* ── Charts 2×2 ───────────────────────────────────────────── */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : cols, gap:'1.25rem', marginBottom:'1.25rem' }}>

            {/* Chart 1: Grouped bar */}
            <div style={CARD}>
              <h3 style={CHART_H3}>Toneladas por Cultivo</h3>
              <p style={{ ...EYEBROW, marginBottom:'1.1rem' }}>Estimadas vs. históricas</p>
              <ResponsiveContainer width="100%" height={255}>
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="cultivo" tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<CTip unit=" ton"/>}/>
                  <Legend wrapperStyle={{ fontSize:'.8rem', color:C.muted }}/>
                  <Bar dataKey="Estimadas"  fill={C.turquesa} radius={[4,4,0,0]}/>
                  <Bar dataKey="Históricas" fill={C.cobre}    radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Line monthly */}
            <div style={CARD}>
              <h3 style={CHART_H3}>Tendencia Mensual de Producción</h3>
              <p style={{ ...EYEBROW, marginBottom:'1.1rem' }}>Toneladas estimadas por departamento</p>
              <ResponsiveContainer width="100%" height={255}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="mes" tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<CTip unit=" ton"/>}/>
                  <Legend wrapperStyle={{ fontSize:'.8rem', color:C.muted }}/>
                  <Line type="monotone" dataKey="Cundinamarca" stroke={C.turquesa} strokeWidth={2} dot={{ r:3, fill:C.turquesa }} activeDot={{ r:5 }}/>
                  <Line type="monotone" dataKey="Boyacá"       stroke={C.dorado}   strokeWidth={2} dot={{ r:3, fill:C.dorado   }} activeDot={{ r:5 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3: Stacked bar rendimiento × condicion */}
            <div style={CARD}>
              <h3 style={CHART_H3}>Rendimiento por Condición de Suelo</h3>
              <p style={{ ...EYEBROW, marginBottom:'1.1rem' }}>Promedio ton/ha por cultivo y condición</p>
              <ResponsiveContainer width="100%" height={255}>
                <BarChart data={stackData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="cultivo" tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CTip unit=" ton/ha"/>}/>
                  <Legend wrapperStyle={{ fontSize:'.8rem', color:C.muted }}/>
                  <Bar dataKey="Óptimo"  stackId="s" fill={C.verde}   radius={[0,0,0,0]}/>
                  <Bar dataKey="Bueno"   stackId="s" fill={C.dorado}  radius={[0,0,0,0]}/>
                  <Bar dataKey="Regular" stackId="s" fill={C.naranja} radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 4: Area efficiency */}
            <div style={CARD}>
              <h3 style={CHART_H3}>Eficiencia de Recursos por Mes</h3>
              <p style={{ ...EYEBROW, marginBottom:'1.1rem' }}>Promedio mensual por departamento (%)</p>
              <ResponsiveContainer width="100%" height={255}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="gCnd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.turquesa} stopOpacity={0.28}/>
                      <stop offset="95%" stopColor={C.turquesa} stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="gBoy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.dorado} stopOpacity={0.28}/>
                      <stop offset="95%" stopColor={C.dorado} stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="mes" tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{ fill:C.dim, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<CTip unit="%"/>}/>
                  <Legend wrapperStyle={{ fontSize:'.8rem', color:C.muted }}/>
                  <Area type="monotone" dataKey="Cundinamarca" stroke={C.turquesa} fill="url(#gCnd)" strokeWidth={2} dot={{ r:3, fill:C.turquesa }}/>
                  <Area type="monotone" dataKey="Boyacá"       stroke={C.dorado}   fill="url(#gBoy)" strokeWidth={2} dot={{ r:3, fill:C.dorado   }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Donut + legend (full width) */}
          <div style={{ ...CARD, marginBottom:'1.25rem' }}>
            <h3 style={CHART_H3}>Distribución por Cultivo</h3>
            <p style={{ ...EYEBROW, marginBottom:'1.1rem' }}>Participación en producción estimada total</p>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:'2.5rem' }}>
              <PieChart width={260} height={260}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={68} outerRadius={118} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(v,n) => [`${fmt(v)} ton`, n]}
                  contentStyle={{ background:C.card, border:`1px solid ${C.borderStr}`, borderRadius:8, color:C.text, fontSize:'.8rem' }}/>
              </PieChart>
              <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                {pieData.map((d, i) => {
                  const tot = pieData.reduce((s,p)=>s+p.value, 0);
                  return (
                    <div key={d.name} style={{ display:'flex', alignItems:'center', gap:'.65rem', fontSize:'.875rem' }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:CHART_COLORS[i%CHART_COLORS.length], flexShrink:0 }}/>
                      <span style={{ color:C.muted, minWidth:80 }}>{d.name}</span>
                      <span style={{ color:C.text, fontWeight:600 }}>{fmt(d.value)} ton</span>
                      <span style={{ color:C.dim, fontSize:'.75rem' }}>({((d.value/tot)*100).toFixed(1)}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart 6: Heatmap rendimiento × (cultivo, mes) */}
          <div style={{ ...CARD, marginBottom:'1.25rem' }}>
            <h3 style={CHART_H3}>Mapa de Calor — Rendimiento (ton/ha)</h3>
            <p style={{ ...EYEBROW, marginBottom:'1.1rem' }}>Cultivo × mes — promedio por celda</p>
            <div style={{ overflowX:'auto' }}>
              <table style={{ borderCollapse:'collapse', minWidth:600, fontSize:'.78rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding:'.4rem .75rem', color:C.dim, fontWeight:600, textAlign:'left', borderBottom:`1px solid ${C.border}`, background:C.card, minWidth:88 }}>Cultivo</th>
                    {heatmap.months.map(m => (
                      <th key={m} style={{ padding:'.4rem .55rem', color:C.dim, fontWeight:600, textAlign:'center', borderBottom:`1px solid ${C.border}`, background:C.card, minWidth:50 }}>
                        {MESES[m-1].slice(0,3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmap.crops.map(cultivo => (
                    <tr key={cultivo}>
                      <td style={{ padding:'.42rem .75rem', color:C.muted, fontWeight:500, borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>{cultivo}</td>
                      {heatmap.months.map(m => {
                        const v = heatmap.get(cultivo, m);
                        return (
                          <td key={m} title={v!=null?`${cultivo} — ${MESES[m-1]}: ${v} ton/ha`:'Sin datos'} style={{
                            padding:'.48rem .4rem', textAlign:'center',
                            background: heatColor(v, heatmap.lo, heatmap.hi),
                            color: v!=null ? 'rgba(0,0,0,.78)' : C.dim,
                            fontWeight:600, borderBottom:`1px solid ${C.border}`, borderLeft:`1px solid ${C.border}`,
                          }}>
                            {v ?? '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginTop:'.9rem', fontSize:'.74rem', color:C.dim }}>
                <span>Bajo</span>
                <div style={{ height:9, width:180, borderRadius:4, background:'linear-gradient(to right,rgb(220,100,80),rgb(212,169,71),rgb(134,200,122))' }}/>
                <span>Alto</span>
              </div>
            </div>
          </div>

          {/* ── Table ───────────────────────────────────────────────────── */}
          <div style={CARD}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'1.1rem' }}>
              <div>
                <h3 style={{ ...CHART_H3, margin:0 }}>Predicciones Detalladas</h3>
                <p style={{ ...EYEBROW, marginTop:'.25rem' }}>{data.length} registros</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'.45rem', fontSize:'.78rem', color:C.dim }}>
                <span style={{ display:'inline-block', width:10, height:10, background:`${C.verde}22`, border:`1px solid ${C.verde}55`, borderRadius:2 }}/>
                Confianza &gt; 85 %
              </div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ borderCollapse:'collapse', minWidth:720, fontSize:'.82rem', width:'100%' }}>
                <thead>
                  <tr>
                    {[
                      ['departamento','Departamento'],['cultivo','Cultivo'],['mes','Mes'],
                      ['toneladas_estimadas','Ton. Est.'],['rendimiento_ton_ha','Rend.'],
                      ['eficiencia_recursos','Eficiencia'],['indice_confianza','Confianza'],
                      ['condicion_suelo','Suelo'],
                    ].map(([f,l]) => <STh key={f} field={f} label={l} sortField={sortField} sortDir={sortDir} onSort={onSort}/>)}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((d, i) => {
                    const hi = d.indice_confianza > 85;
                    return (
                      <tr key={i}
                        style={{ background: hi ? `${C.verde}0d` : 'transparent', borderBottom:`1px solid ${C.border}`, transition:'background .12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = hi ? `${C.verde}1a` : C.card2}
                        onMouseLeave={e => e.currentTarget.style.background = hi ? `${C.verde}0d` : 'transparent'}>
                        <td style={{ padding:'.58rem .85rem', color: d.departamento==='Cundinamarca' ? C.turquesa : C.dorado, whiteSpace:'nowrap', fontWeight:500 }}>{d.departamento}</td>
                        <td style={{ padding:'.58rem .85rem', color:C.text }}>{d.cultivo}</td>
                        <td style={{ padding:'.58rem .85rem', color:C.muted }}>{d.mesNombre.slice(0,3)}</td>
                        <td style={{ padding:'.58rem .85rem', color:C.text }}>{fmt(d.toneladas_estimadas)} ton</td>
                        <td style={{ padding:'.58rem .85rem', color:C.text }}>{fmtF(d.rendimiento_ton_ha)} t/ha</td>
                        <td style={{ padding:'.58rem .85rem', color: d.eficiencia_recursos>=80?C.verde:d.eficiencia_recursos>=60?C.dorado:C.danger }}>{d.eficiencia_recursos}%</td>
                        <td style={{ padding:'.58rem .85rem', color: hi ? C.verde : C.muted, fontWeight: hi?600:400 }}>{d.indice_confianza}%</td>
                        <td style={{ padding:'.58rem .85rem', color: d.condicion_suelo==='Óptimo'?C.verde:d.condicion_suelo==='Bueno'?C.dorado:C.dim }}>{d.condicion_suelo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginTop:'1.1rem' }}>
                <span style={{ fontSize:'.78rem', color:C.dim }}>Pág. {page} de {totalPages}</span>
                <div style={{ display:'flex', gap:'.4rem', alignItems:'center' }}>
                  <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                    style={{ ...BTN_PAGE(false), opacity:page===1?.45:1, cursor:page===1?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'.3rem' }}>
                    <ChevronLeft size={13}/> Anterior
                  </button>
                  {Array.from({ length:Math.min(totalPages,7) },(_,i)=>{
                    const pg = totalPages<=7 ? i+1 : Math.max(1, Math.min(page-3+i, totalPages-6+i));
                    return pg>=1&&pg<=totalPages ? (
                      <button key={pg} onClick={()=>setPage(pg)} style={BTN_PAGE(pg===page)}>{pg}</button>
                    ) : null;
                  })}
                  <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                    style={{ ...BTN_PAGE(false), opacity:page===totalPages?.45:1, cursor:page===totalPages?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'.3rem' }}>
                    Siguiente <ChevronRight size={13}/>
                  </button>
                </div>
              </div>
            )}
          </div>

        </>)}
      </div>
    </section>
  );
}
