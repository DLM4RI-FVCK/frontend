export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)


  // se lee la información que viene del store alla se llamaba "data"
  // y contenia user y contraseña, aca se llama "body" y 
  // contiene el objeto donde vienen usuario y contraseña 
  const body = await readBody(event)

  // obtenemos todos los usuarios de nuestro servidor json-server, que es un array de objetos
  // se pone config.jsonserverurl porque en "nuxt.config.ts" se 
  // definio la variable de entorno jsonServerUrl
  const users = await $fetch(`${config.jsonServerUrl}/users`)

  // Buscamos concidencias entre el usukario y la contraseña 
  // que vienen del body y los que vienen del json-server
  // item representa cada objeto del array (todos los usuarios)
  // y se compara con el body que viene del frontend osea del store
  // que previamente se lleno con los datos del formulario de login
  const user = users.find((item) => {
  return (
    item.usuario === body.usuario &&
    item.contraseña === body.password
  )
})

  // Si no encuentra coincidencia da error 401,
  //  que significa que no se pudo autenticar el usuario
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuario o contraseña incorrectos'
    })
  }

  // No devolver la contraseña para que no se vea en el 
  // frontend, solo devolver el resto de la información del usuario
  // aqui lo que se crea es un nuevo objeto que contiene toda 
  // la información del usuario menos la contraseña
  const { contraseña, ...userData } = user

  // se devuelve el objeto userData que contiene toda 
  // la información del usuario menos la contraseña
  // y ese objeto se guarda en el store del frontend en la propiedad user
  return userData
})