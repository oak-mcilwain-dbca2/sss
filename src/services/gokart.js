import mitt from "mitt";

export const eventBus = mitt();

export const GK_EVENTS = {
  INIT: "gk-init",
  POSTINIT: "gk-postinit",
};
