import { useEffect } from 'react';
import PitchSection from '../components/PitchSection.jsx';

export default function Pitch() {
  useEffect(() => {
    document.title = 'rAIz · Pitch';
  }, []);

  return <PitchSection />;
}
