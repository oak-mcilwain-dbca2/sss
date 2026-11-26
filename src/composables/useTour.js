import { useStateStore } from '@/stores/state';

import { startTour } from '@/services/tour';

export function useTour() {
  const state = useStateStore();

  const takeTour = () => {
    state.touring = true;

    try {
      startTour();
    } catch (error) {
      state.touring = false;
      throw error;
    }
  };

  return {
    takeTour,
  };
}
