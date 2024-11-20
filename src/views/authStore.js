import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(credentials) {
      try {
        // Aquí va la lógica de autenticación (p.ej., llamada a API).
        const response = await someAuthService.login(credentials);
        this.user = response.data.user;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    logout() {
      this.user = null;
    },
  },
});