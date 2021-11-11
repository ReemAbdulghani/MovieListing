import Vue from "vue";
import App from "./App.vue";
import VueCompositionAPI from '@vue/composition-api'
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";

import routes from "./router"

Vue.use(VueCompositionAPI);
Vue.use(VueRouter);


const router = new VueRouter({
  routes: routes,
  mode: "history",
  base: process.env.BASE_URL,
});
 
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
