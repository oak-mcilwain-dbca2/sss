import { createApp } from "vue";
import $ from "jquery";
import moment from "moment";

import App from "./App.vue";

globalThis.$ = $;
globalThis.jQuery = $;
globalThis.moment = moment;

const app = createApp(App).mount("#app");

app.config.errorHandler = (err) => {
  console.error(err);

  // TODO integrate with Loading component's addMessage logic
};
