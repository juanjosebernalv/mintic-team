import { useEffect } from 'react';
import ProjectTimeline from '../components/ProjectTimeline.jsx';

export default function Proceso() {
  useEffect(() => {
    document.title = 'rAIz · Nuestro Proceso';
  }, []);

  return <ProjectTimeline />;
}
