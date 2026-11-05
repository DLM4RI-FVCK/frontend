<template>
      <v-container class="py-6" style="max-width: 900px;">
        <div class=" rounded-lg pa-4">
          <Dashboard />
          <TipsCard /> 
        </div>
      </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout : 'main'
})
</script>
