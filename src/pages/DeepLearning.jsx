import { useEffect } from 'react';
import DeepLearningDemo from '../components/DeepLearningDemo.jsx';

export default function DeepLearning() {
  useEffect(() => {
    document.title = 'rAIz · Deep Learning Training';
  }, []);

  return <DeepLearningDemo />;
}
