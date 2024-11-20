import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useI18n } from 'vue-i18n';

export default function useNavBarViewModel() {
  const authStore = useAuthStore();
  const drawer = ref(false);
  const showLanguageMenu = ref(false);
  const currentFlag = ref(require('@/assets/flag-spain.png')); // bandera predeterminada en español

  const { locale } = useI18n();

  const toggleLanguageMenu = () => {
    showLanguageMenu.value = !showLanguageMenu.value;
  };

  const setLanguage = (lang) => {
    locale.value = lang;
    currentFlag.value = lang === 'es' ? require('@/assets/flag-spain.png') : require('@/assets/flag-uk.png');
    showLanguageMenu.value = false;
  };

  return {
    authStore,
    drawer,
    showLanguageMenu,
    currentFlag,
    toggleLanguageMenu,
    setLanguage,
  };
}