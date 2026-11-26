// composables/useLayout.js

import { useLayoutStore } from '@/stores/layout';
import { useStateStore } from '@/stores/state';

export function useLayout() {
  const layoutStore = useLayoutStore();
  const stateStore = useStateStore();

  function setHintsHeight(activeComponent) {
    if (!activeComponent?.adjustHeight) {
      return;
    }

    layoutStore.hintsHeight =
      (stateStore.showHints ? $('#hints').height() : 0) +
      (stateStore.hints.length ? 32 : 0);

    activeComponent.adjustHeight();
  }

  return {
    setHintsHeight,
  };
}
