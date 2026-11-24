// stores/user.js

import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    ready: false,
    whoami: null,
  }),

  actions: {
    setWhoami(whoami) {
      this.whoami = whoami;
      this.ready = true;
    },

    loadMockUser() {
      this.whoami = {
        email: "oak@example.com",
        username: "oak",
        is_internal_dbca: true,
      };
      this.ready = true;
    },
  },
});
