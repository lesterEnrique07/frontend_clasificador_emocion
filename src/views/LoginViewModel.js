import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

export default function useLoginViewModel() {
  const authStore = useAuthStore();

  const form = ref({
    email: '',
    password: '',
  });

  const login = async () => {
    try {
      await authStore.login(form.value);
    } catch (error) {
      console.error("Failed to login:", error);
      // Aquí podrías manejar mensajes de error o notificaciones.
    }
  };

  return {
    form,
    login,
  };
}