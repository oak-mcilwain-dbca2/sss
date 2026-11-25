<!-- DateTimeInput.vue -->
<template>
  <input
    type="datetime-local"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  name: "DateTimeInput",

  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },

  emits: ["update:modelValue"],
};
</script>
