import { createApp } from "vue";
import $ from "jquery";

import App from "./App.vue";

window.$ = $;
window.jQuery = $;

createApp(App).mount("#app");
