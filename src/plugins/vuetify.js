import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#E6332A',
        secondary: '#0099DB',
        accent: '#484848',
        error: '#E6332A',
        info: '#9accdc',
      },
    },
  },
});
