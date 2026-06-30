import { useEffect } from 'react';
import AgricultureDashboard from '../components/AgricultureDashboard.jsx';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'rAIz · Dashboard de Predicciones';
  }, []);

  return <AgricultureDashboard />;
}
