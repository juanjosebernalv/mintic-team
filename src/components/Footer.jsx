export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__inner">
        <span className="footer__brand">
          r<span className="brand__ai">AI</span>z
        </span>
        <p className="footer__tagline">Agricultura Inteligente Colombiana</p>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} rAIz · Construido con React + Vite.
        </p>
      </div>
    </footer>
  );
}
