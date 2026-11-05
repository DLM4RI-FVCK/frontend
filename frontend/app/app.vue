<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
const authStore = useAuthStore()

// Al montar la app por primera vez, intentamos recuperar el usuario del localStorage
onMounted(() => {
  authStore.restoreSession()
})


const auth = useAuthStore()

onMounted(() => {
  auth.restoreSession()
})
</script>
