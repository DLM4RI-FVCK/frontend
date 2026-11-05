export const useTipsStore = defineStore('tips', {
  state: () => ({
    // aqui se alamacenaran todos los tips que vengan de la api y a su vez del server
    tips: [],
    // loading es para saber si se esta cargando la informacion de los tips
    loading: false,
    // error es para saber si hubo un error al cargar los tips
    error: null
  }),

  actions: {
    // una funcion asincrona para obtener los tips de la api y almacenarlos en el state
    async getTips() {
      this.loading = true
      this.error = null
    // try es "intentar" y catch es "atrapar" el error si es que ocurre
    // que intentamos ? hacer un fetch (pedir y traer) a la api para obtener los
    //  tips y si ocurre un error lo atrapamos y lo mostramos en consola
      try {
        this.tips = await $fetch('/api/tips')
      } catch (error) {
        this.error = 'No se pudieron cargar los tips.'
        console.error('Error al cargar los tips:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
