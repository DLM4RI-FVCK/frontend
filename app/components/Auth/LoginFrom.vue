<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const usuario = ref("");
const contraseña = ref("");

const login = async () => {
  try {
    await auth.login({
      usuario: usuario.value,
      password: contraseña.value,
    });

    navigateTo("/inicio");
  } catch (error) {
    alert(error.data?.statusMessage || "Error al iniciar sesión");
  }
};
</script>

<template>
    <form @submit.prevent="login" class="text-center">
          <input v-model="usuario" placeholder="Usuario" required />
        <br>
        <br>
          <input
            v-model="contraseña"
            type="password"
            placeholder="Contraseña"
            required
          />
        <br>
        <br>
          <button type="submit">Entrar</button>
        </form>
</template>