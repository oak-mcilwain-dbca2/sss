import { createApp } from "vue";
import $ from "jquery";
import moment from "moment";

import App from "./App.vue";

globalThis.$ = $;
globalThis.jQuery = $;
globalThis.moment = moment;

createApp(App).mount("#app");
