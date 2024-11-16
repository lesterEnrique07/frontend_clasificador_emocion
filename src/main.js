// main.js
import { createApp, markRaw } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import axios from 'axios';
import router from './router'; // Ruta al archivo router.js
import en from './locales/en.json';
import es from './locales/es.json';
//Pina
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
//Fontawesome
import '@fortawesome/fontawesome-free/css/all.min.css'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
//Icons
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Configuración global de Axios
window.axios = axios;
window.axios.defaults.baseURL = 'http://localhost:8000';
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.headers.common['Content-Type'] = 'application/json';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;


//Configurando Vuetify
const vuetify = createVuetify({
    components,
    directives,
    iconfont: 'md',
})

//Configurando Pinia
const pinia = createPinia();
pinia.use(({ store }) => {
    store.router = markRaw(router);
});
pinia.use(createPersistedState);

const messages = {
    en,
    es
  };
  
const i18n = createI18n({
    locale: 'es', // Configura el idioma predeterminado a español
    messages,
  });

//Creando app
const app = createApp(App).use(router).use(pinia).use(vuetify).use(i18n);


app.config.globalProperties.$axios = axios;
app.mount('#app');

