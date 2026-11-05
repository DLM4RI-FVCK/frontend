// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  actions: {
    // REGISTRO
    async register(data) {
      return await $fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });
    },

    // LOGIN
    async login(data) {
      const user = await $fetch("/api/auth/login", {
        method: "POST",
        body: data,
      });

      this.user = user;
      // se guarda en el localStorage del navegador la información del usuario que 
      // se acaba de loguear, para que no se pierda al recargar la página
      localStorage.setItem("user", JSON.stringify(user));
    },

    // RESTAURAR SESIÓN (Crucial para que no se borre al recargar F5)
    restoreSession() {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    },

    // LOGOUT elimina la información del usuario 
    // del store y del localStorage y redirige a 
    // la página de login
    logout() {
      this.user = null;
      localStorage.removeItem("user");
      return navigateTo("/login");
    },
  },
});