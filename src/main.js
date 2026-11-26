import { createApp } from 'vue';
import { createPinia } from 'pinia';
import $ from 'jquery';
import moment from 'moment';

import 'foundation-sites';

import App from './App.vue';

import '@/assets/css/foundation-flex.css';
import '@/assets/css/style.css';

globalThis.$ = $;
globalThis.jQuery = $;
globalThis.moment = moment;

// expose Foundation for legacy code if needed
globalThis.Foundation = window.Foundation;

const app = createApp(App);

app.use(createPinia());

app.mount('#app');

app.config.errorHandler = (err) => {
  console.error(err);

  // TODO integrate with Loading component's addMessage logic
};

$(document).foundation();

console.log('foundation fn:', typeof $(document).foundation);
