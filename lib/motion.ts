import { useEffect, useState } from 'react';

/** true kada korisnik u sistemu traži smanjene animacije (prefers-reduced-motion). */
export function useReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}
