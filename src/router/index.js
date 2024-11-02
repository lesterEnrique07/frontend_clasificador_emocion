import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import HomeView from '../views/HomeView.vue'
import ClasificacionView from '../views/ClasificacionView.vue'
import RegistrosView from '../views/RegistrosView.vue'
import CourseView from '../views/CourseView.vue'
import EditionView from '../views/EditionView.vue'
import PerfilView from '../views/PerfilView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import RevisionView from '../views/RevisionView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/clasificacion/:section?',
    name: 'clasificacion',
    component: ClasificacionView
  },
  {
    path: '/registros',
    name: 'registros',
    component: RegistrosView
  },
  {
    path: '/estadisticas',
    name: 'estadisticas',
    component: EditionView
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutUsView
  },
  {
    path: '/revision/:id',
    name: 'revision',
    component: RevisionView,
    props: true
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/*Controlar que si el usuario no ha realizado login no puede entrar
a ninguna otra ruta*/
router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();
  if (authRequired && !auth.user && !sessionStorage.getItem('TOKEN')) {
    auth.returnUrl = to.fullPath;
    return '/login'
  }
  /*Esta condición se hace para cuando el usuario refresca 
  la página no se pierdan los estados de authUser y authToken*/
  if (sessionStorage.getItem('TOKEN')) {
    //Se guarda el token almacenado  en sessionStorage al estado authToken
    auth.$state.authToken = sessionStorage.getItem('TOKEN');
    //En el caso del JSON primero se hace el parse para convertirlo a objeto y luego se extrae solamente
    //la información del usuario (id, name, email)
    auth.$state.authUser = JSON.parse(sessionStorage.getItem('AUTH')).data.data;
  }
})


export default router
