import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2>404 · Página no encontrada</h2>
        <p>La ruta que buscas no existe.</p>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    </section>
  );
}
