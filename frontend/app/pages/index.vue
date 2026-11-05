<script setup>

const auth = useAuthStore()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>

  <div>

    <h1>Mi aplicación</h1>

    <div v-if="auth.user">

      <h2>Bienvenido, {{ auth.user.nombre }}</h2>

      <p>{{ auth.user.email }}</p>

      <button @click="auth.logout">
        Cerrar sesión
      </button>

    </div>

    <div v-else>

      <NuxtLink to="/login">
        Iniciar sesión
      </NuxtLink>

      <NuxtLink to="/register">
        Registrarse
      </NuxtLink>

    </div>

  </div>

</template>