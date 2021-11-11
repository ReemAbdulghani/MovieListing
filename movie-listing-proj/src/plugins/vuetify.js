import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

//import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
          light: {
            primary: '#3f51b5',
            secondary: '#b0bec5',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
          dark: {
            primary: '#b71c1c',
          },
        },
      },
  })
