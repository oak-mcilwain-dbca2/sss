<template>
  <img :src="legendSvg" />
</template>
<script>
import legendSvg from '@/assets/images/legend.svg';

export default {
  // TODO: Currently not referenced by Export.vue template.
  // Retained during migration pending review of export subsystem.
  setup() {
    return {
      legendSvg,
    };
  },
  computed: {
    legendInfo: {
      get: function () {
        return this.$root.export.legendInfo();
      },
    },
    title: function () {
      return this.$root.export.title;
    },
  },
};
</script>
