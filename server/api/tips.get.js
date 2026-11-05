export default defineEventHandler(async (event) => {
 // obtenemos la configuracion del runtime para poder usar la url del json server
// osea le decimos que tenemos un server Json que queremos usar
  const config = useRuntimeConfig(event)
  
  // obtenemos los tips del json server usando la url que tenemos en la configuracion anterior
  const tips = await $fetch(`${config.jsonServerUrl}/tips`)
  // devolvemos a la api los tips que obtuvimos del json server 
  // y los convertimos en un array para poder usarlos en el componente de la app
  return Object.values(tips)
})
