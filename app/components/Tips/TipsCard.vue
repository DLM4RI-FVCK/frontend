<template>
  <div class="tips-card">
    <h2>Tips financieros</h2>
    <p v-if="tipsStore.error" class="tips-error">{{ tipsStore.error }}</p>
    <p v-else-if="tipsStore.loading">Cargando tips...</p>
    <template v-else-if="currentTip">
      <p class="tips-card__tip">{{ currentTip }}</p>
      <div :key="tipIndex" class="tips-card__counter" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle class="tips-card__track" cx="20" cy="20" r="17" />
          <circle class="tips-card__progress" cx="20" cy="20" r="17" />
        </svg>
      </div>
    </template>
  </div>
</template>

<script setup>
// traemos funciones propias de vue
import { computed, onMounted, onUnmounted, ref } from 'vue'
// traemos nuestro store
const tipsStore = useTipsStore()
// esta sera la posicion de nuestro tip actual
const tipIndex = ref(0)
// 
const currentTip = computed(() => tipsStore.tips[tipIndex.value] || '')
let tipTimer

onMounted(async () => {
  // esto va a demorar , trae elos tips
  await tipsStore.getTips()
  // esto es una funcion de tiempo
  tipTimer = setInterval(() => {
    // si la cantidad de tips es mayor a 0 haz lo siguiente
    if (tipsStore.tips.length > 0) {
      tipIndex.value = (tipIndex.value + 1) % tipsStore.tips.length
      // coge la posicion actual sumale 1 , dividelo y el residuo es la posicion
      // del tip que me vas a mostrar
      // (0 + 1) % 3 es 1
      // (1 + 1) % 3 es 2
      // (2 + 1) % 3 es 0
    }
  }, 15000) // 15 segundos porque , porque 1000ms son 1 segundo
})

// cuando se ceirre la pagina para el contador
onUnmounted(() => {
  clearInterval(tipTimer)
})

</script>





















<style>
.tips-card {
  position: relative;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
}

.tips-card h2 {
  margin: 0 2.5rem 0.75rem 0;
}

.tips-card__tip {
  margin: 0;
}

.tips-card__counter {
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.tips-card__counter svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.tips-card__counter circle {
  fill: none;
  stroke-width: 3;
}

.tips-card__track {
  stroke: #e5e7eb;
}

.tips-card__progress {
  stroke: #4b7f52;
  stroke-dasharray: 107;
  stroke-dashoffset: 107;
  animation: fill-tip-border 15s linear forwards;
}

@keyframes fill-tip-border {
  to {
    stroke-dashoffset: 0;
  }
}

.tips-error {
  color: #b91c1c;
}
</style>