// services/persistence.js

import { useStateStore } from '@/stores/state';

export function getPersistentData() {
  const state = useStateStore();

  return {
    view: structuredClone(state.view),
    activeLayers: structuredClone(state.activeLayers),
    annotations: structuredClone(state.annotations),
  };
}
