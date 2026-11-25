<!-- DateTimeInput.vue -->
<template>
  <input
    type="datetime-local"
    :value="modelValue"
    :min="min"
    :max="max"
    v-bind="$attrs"
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
    min: {
      type: String,
      default: "",
    },
    max: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue"],
};
</script>
