<script setup>

//traemos la informacion del store de auth (autentificación donde esta
// usuario, contraseña etc....... en este caso solo usaremos nombre)
const auth = useAuthStore();

</script>

<template>
  
  <div>
      <v-card class="w-full  bg-transparent" style="border: none; box-shadow: none;">
        <!-- aqui le preguntamos si hay usuario en ele state y que nos ponga su nombre -->
        <h1>Hola, {{ auth.user?.nombre }}</h1>
      </v-card>
  </div>

</template>
