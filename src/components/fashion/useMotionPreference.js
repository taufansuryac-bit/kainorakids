import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const snapshot = () => window.matchMedia(query).matches;
const subscribe = callback => {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

export function useMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
