export default defineEventHandler(async (event) => {
  
  const config = useRuntimeConfig(event)
  
  const body = await readBody(event)
 
  // Login usuarios

  if (!body.password || body.password.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Debes ingresar una contraseña'
    })
  }

  const users = await $fetch(`${config.jsonServerUrl}/users`, {
    query: {
      usuario: body.usuario
    }
  })

  if (users.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El usuario ya existe'
    })
  }


 // registrar nuevo usuario
  
  const newUser = await $fetch(`${config.jsonServerUrl}/users`, {
    method: 'POST',
    body: {
      usuario: body.usuario,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      contraseña: body.password
    }
  })

  return newUser
})