# Cómo funciona el sistema de usuarios

Esta guía sigue únicamente el recorrido de una cuenta: dónde se guarda, cómo se crea, cómo se inicia sesión y cómo llega la información al estado de la aplicación y a las pantallas. No describe otros módulos.

## 1. Palabras técnicas, en sencillo

- **Base de datos:** lugar donde una aplicación guarda información para volver a usarla. En este proyecto, los usuarios están en un archivo JSON, no en una base SQL.
- **JSON:** formato de texto que organiza datos como pares de nombre y valor, por ejemplo `"email": "persona@ejemplo.com"`.
- **JSON Server:** programa que lee y modifica el archivo JSON y permite acceder a sus datos mediante direcciones web.
- **API:** conjunto de direcciones que permiten que una parte del programa pida o envíe información a otra parte.
- **Endpoint:** una dirección concreta de una API, como `/api/auth/login`.
- **Frontend:** parte que ve y utiliza la persona en el navegador: formularios, botones y páginas.
- **Backend:** parte que procesa solicitudes y se comunica con los datos guardados. Aquí, las rutas de servidor de Nuxt y JSON Server cumplen ese papel.
- **Store:** memoria compartida de la interfaz. En este caso, el store de autenticación recuerda qué usuario inició sesión mientras se usa la aplicación.
- **`localStorage`:** espacio del navegador que conserva texto incluso al cerrar o actualizar la página.
- **Solicitud / respuesta:** mensaje que una parte del programa envía a otra y la contestación que recibe.

## 2. Dónde vive cada parte del flujo

| Parte | Archivo | Qué hace |
|---|---|---|
| Datos persistentes de usuarios | `backend/db.json` | Contiene la colección `users` y sus registros. |
| Servidor de datos | `backend/package.json` | El comando `dev` inicia JSON Server en el puerto `3001`, usando `db.json`. |
| Dirección del servidor de datos | `frontend/nuxt.config.js` | Configura `jsonServerUrl` como `http://localhost:3001`. |
| API de registro | `frontend/server/api/auth/register.post.js` | Comprueba el nombre de usuario y crea la cuenta. |
| API de inicio de sesión | `frontend/server/api/auth/login.post.js` | Comprueba usuario y contraseña y devuelve los datos sin contraseña. |
| Store de autenticación | `frontend/app/stores/auth.js` | Envía solicitudes de autenticación, conserva el usuario activo y restaura o cierra la sesión. |
| Formulario de registro | `frontend/app/components/Auth/RegisterFrom.vue` | Recoge los datos para crear una cuenta. |
| Formulario de inicio de sesión | `frontend/app/components/Auth/LoginFrom.vue` | Recoge usuario y contraseña para entrar. |
| Páginas que muestran los formularios | `frontend/app/pages/register.vue`, `frontend/app/pages/login.vue` | Colocan el formulario correspondiente en una página. |
| Restauración al abrir la aplicación | `frontend/app/app.vue` | Al terminar de montar la interfaz, pide al store que restaure la sesión guardada. |
| Endpoint auxiliar de lista | `frontend/server/api/users/index.get.js` | Devuelve todos los usuarios; no es el endpoint usado por los formularios para registrarse o iniciar sesión. |
| Store auxiliar de lista | `frontend/app/stores/user.js` | Pide esa lista al endpoint `/api/users`; es distinto del store de autenticación. |

## 3. Qué representa un usuario guardado

En `backend/db.json`, los registros están dentro de la propiedad `users`. Cada elemento de esa lista representa una cuenta. Los nombres de los campos que usa el registro son:

| Campo | Qué significa |
|---|---|
| `id` | Identificador del registro. Los registros existentes lo tienen; al crear una cuenta, el formulario no lo envía y JSON Server asigna el identificador. |
| `usuario` | Nombre de usuario que la persona escribe para identificarse. El registro lo comprueba para evitar repetirlo. |
| `nombre` | Nombre de pila. |
| `apellido` | Apellido. |
| `email` | Correo electrónico. La pantalla pide que tenga formato de correo, pero la API de registro no comprueba que sea único. |
| `contraseña` | Contraseña proporcionada al registrarse. En los datos actuales se guarda como texto normal, no como una versión cifrada o protegida. |

El nombre de la contraseña cambia entre las capas: el formulario y las solicitudes del navegador la llaman `password`; el archivo de datos la llama `contraseña`. La API de registro hace esa conversión.

## 4. Creación de una cuenta: recorrido completo

### 4.1 La persona abre la página y completa el formulario

1. `frontend/app/pages/register.vue` muestra el título **Crear cuenta** y el componente `<RegisterFrom />`. La página presenta el formulario; la lógica de enviar sus datos está en el componente.
2. En `frontend/app/components/Auth/RegisterFrom.vue`, cada línea `const ... = ref("")` crea un espacio reactivo para guardar lo escrito en `usuario`, `nombre`, `apellido`, `email` y `contraseña`.
   - **Reactivo** significa que Vue mantiene el valor conectado con la pantalla: cuando la persona escribe, cambia el valor que usa el programa.
3. En la plantilla, cada `v-model="..."` conecta un campo de texto con su espacio reactivo. Por ejemplo, `v-model="usuario"` hace que lo escrito en el campo Usuario quede en `usuario.value`.
4. `required` indica al navegador que el campo debe llenarse antes de enviar el formulario. `type="email"` pide que el correo tenga un formato reconocible y `type="password"` oculta visualmente los caracteres de la contraseña. Estas comprobaciones de la pantalla no sustituyen las validaciones del servidor.
5. El formulario usa `@submit.prevent="register"`. Al pulsar **Registrarse**, se ejecuta `register`; `.prevent` evita que el navegador recargue la página con su comportamiento normal.

### 4.2 El componente manda los datos al store

En la función `register` de `RegisterFrom.vue`:

1. `useAuthStore()` obtiene el store compartido de autenticación.
2. `auth.register({...})` llama a su acción `register` y crea el objeto que se enviará:
   - `usuario`, `nombre`, `apellido` y `email` se copian desde sus campos.
   - `password: contraseña.value` envía la contraseña bajo la clave `password`. Aunque el campo de pantalla se llama `contraseña`, el API espera `password`.
3. `await` significa “espera la respuesta antes de continuar”. El formulario no muestra éxito hasta que termina la solicitud.
4. Si todo funciona, aparece el aviso **Registro exitoso** y `navigateTo("/login")` lleva a la página de inicio de sesión. El registro no inicia la sesión por sí mismo.
5. Si algo falla, `catch` muestra el mensaje del servidor (`error.data?.statusMessage`) o el texto general **Error al registrarse**.

### 4.3 El store convierte la acción en una solicitud al API

En `frontend/app/stores/auth.js`, dentro de `actions.register(data)`:

1. `$fetch("/api/auth/register", ...)` envía una solicitud HTTP al endpoint interno de Nuxt `/api/auth/register`.
2. `method: "POST"` indica que se están enviando datos para crear algo.
3. `body: data` coloca en el cuerpo de la solicitud el objeto recibido del formulario. El store no guarda todavía un usuario ni marca la sesión como iniciada.

La ruta del endpoint corresponde al archivo `frontend/server/api/auth/register.post.js`: `auth/register` indica la ruta y `.post.js` que atiende solicitudes POST.

### 4.4 La API valida y guarda el registro

En `frontend/server/api/auth/register.post.js`, el orden de las operaciones es:

1. `defineEventHandler(async (event) => { ... })` define la función que Nuxt ejecuta cuando recibe una solicitud para esta ruta. `async` permite esperar respuestas de otros servicios.
2. `useRuntimeConfig(event)` lee la configuración del servidor, incluida `jsonServerUrl`.
3. `readBody(event)` lee el objeto que envió el formulario a través del store.
4. El `if` de `body.password` comprueba que haya contraseña y que no sea una cadena vacía o compuesta solo por espacios. Si no pasa, `createError` responde con estado **400** y el mensaje **Debes ingresar una contraseña**.
5. `$fetch(`${config.jsonServerUrl}/users`, { query: { usuario: body.usuario } })` pregunta a JSON Server si ya existe un registro con ese usuario.
   - `config.jsonServerUrl` apunta a `http://localhost:3001`.
   - La ruta `/users` corresponde a la colección `users` de `backend/db.json`.
   - `query` agrega el filtro `usuario` a la solicitud.
6. Si `users.length > 0`, ya hay una coincidencia. La API detiene el registro y devuelve estado **400** con **El usuario ya existe**.
7. Si no hay coincidencia, otra llamada `$fetch` envía un `POST` a `/users`. El cuerpo guarda `usuario`, `nombre`, `apellido` y `email`, y asigna `body.password` al campo `contraseña`.
8. JSON Server escribe el nuevo registro en `backend/db.json` y asigna el `id`, ya que el cuerpo enviado no contiene uno.
9. `return newUser` devuelve a la pantalla el registro que respondió JSON Server. En esta respuesta de registro también viene `contraseña`; el store `register` no lo guarda en `localStorage` ni en `auth.user`.

**En una frase:** formulario → store de autenticación → API de registro de Nuxt → JSON Server → `backend/db.json`; luego la respuesta vuelve a la pantalla.

## 5. Inicio de sesión: recorrido completo

### 5.1 La persona escribe sus credenciales

1. `frontend/app/pages/login.vue` presenta el título **Iniciar sesión** y el componente `<LoginFrom />`.
2. En `frontend/app/components/Auth/LoginFrom.vue`, `const auth = useAuthStore()` obtiene el store y `ref("")` crea los espacios para `usuario` y `contraseña`.
3. Los `v-model` guardan lo escrito en esos espacios. El campo de contraseña la oculta visualmente.
4. `@submit.prevent="login"` hace que el botón **Entrar** ejecute `login` sin recargar la página.
5. `auth.login({ usuario: usuario.value, password: contraseña.value })` envía las dos credenciales al store. De nuevo, la clave enviada se llama `password`, aunque la variable de la pantalla se llame `contraseña`.

### 5.2 El store pregunta al API de login

En `frontend/app/stores/auth.js`, dentro de `actions.login(data)`:

1. `$fetch("/api/auth/login", { method: "POST", body: data })` manda usuario y contraseña al backend de Nuxt.
2. `await` espera la respuesta. Si el servidor rechaza la solicitud, las siguientes líneas no se ejecutan y el error vuelve al `catch` del formulario.
3. Cuando la API responde correctamente, `this.user = user` guarda la respuesta en la propiedad `user` del store.
   - `this.user` es la información del usuario actualmente autenticado en la memoria compartida de la interfaz.
4. `localStorage.setItem("user", JSON.stringify(user))` convierte ese objeto en texto JSON y lo guarda en el navegador con la clave `user`, para poder restaurarlo después de recargar la página.

### 5.3 El API busca la coincidencia

En `frontend/server/api/auth/login.post.js`:

1. `useRuntimeConfig(event)` obtiene la dirección de JSON Server y `readBody(event)` lee usuario y contraseña recibidos.
2. `$fetch(`${config.jsonServerUrl}/users`)` pide la colección de usuarios a JSON Server.
3. `users.find(...)` recorre esa colección hasta encontrar un elemento cuyo `item.usuario` sea igual a `body.usuario` **y** cuyo `item.contraseña` sea igual a `body.password`.
   - `===` compara los valores exactamente; por tanto, usuario y contraseña deben coincidir con lo guardado.
   - En el código actual se descargan todos los usuarios para buscar la coincidencia en la API de Nuxt.
4. Si no hay coincidencia, `createError` responde con estado **401** y el mensaje **Usuario o contraseña incorrectos**.
5. Si la encuentra, `const { contraseña, ...userData } = user` separa la contraseña del resto del registro. `userData` contiene los demás campos, como `id`, `usuario`, `nombre`, `apellido` y `email`.
6. `return userData` devuelve esos datos al store sin incluir la contraseña.

**En una frase:** formulario → store → API de login de Nuxt → JSON Server busca en `users` → API devuelve el usuario sin contraseña → store guarda ese usuario.

### 5.4 Qué ve la persona después de intentar entrar

1. Si `auth.login(...)` termina bien, el componente ejecuta `navigateTo("/inicio")`.
2. Si el servidor devuelve un error, el `catch` muestra `error.data?.statusMessage`; para credenciales incorrectas será **Usuario o contraseña incorrectos**. Si no hay un mensaje utilizable, muestra **Error al iniciar sesión**.
3. La aplicación tiene una página `frontend/app/pages/Inicio.vue`; Nuxt deriva la ruta `/inicio` del nombre de ese archivo.

## 6. Cómo se mantiene la sesión al volver a abrir la aplicación

1. `frontend/app/app.vue` ejecuta `useAuthStore()` para obtener el mismo store de autenticación.
2. `onMounted(() => { auth.restoreSession() })` espera a que la aplicación se monte en el navegador y después llama a `restoreSession`.
3. En `auth.js`, `localStorage.getItem("user")` busca el texto guardado con la clave `user`.
4. Si encuentra algo, `JSON.parse(savedUser)` lo convierte de texto a objeto y `this.user = ...` vuelve a ponerlo en el store.
5. Si no hay nada guardado, el `if` no cambia el valor y `user` sigue siendo `null` (sin usuario activo).

Esto restaura los datos guardados en ese navegador; el código no vuelve a consultar el servidor para confirmar la contraseña o comprobar que el registro siga existiendo.

## 7. Cómo se cierra la sesión

En `frontend/app/stores/auth.js`, `logout()`:

1. `this.user = null` vacía la sesión que la interfaz tiene en memoria.
2. `localStorage.removeItem("user")` borra la copia guardada en el navegador. Así no se restaura en la siguiente carga.
3. `nuxtApp.$router.push("/login")` intenta navegar a la página de login. En el archivo mostrado, `nuxtApp` no se declara dentro de `logout`; si no está disponible en el entorno de ejecución, esa navegación podría fallar aunque las dos operaciones anteriores ya hayan limpiado la sesión.

## 8. Cómo las pantallas consultan el store

En `frontend/app/pages/index.vue`, `const auth = useAuthStore()` obtiene el store y la plantilla decide qué mostrar:

- `v-if="auth.user"` muestra la bienvenida y el correo cuando hay un usuario en el store.
- `{{ auth.user.nombre }}` y `{{ auth.user.email }}` leen valores del objeto recibido del API de login.
- El botón **Cerrar sesión** ejecuta `auth.logout`.
- El `v-else` muestra enlaces para iniciar sesión o registrarse si `auth.user` está vacío.

Es decir, los componentes no leen `backend/db.json` directamente. Consultan el store; el store se comunica con el API y el API habla con JSON Server.

## 9. Endpoint de lista de usuarios, separado del login

También existe `frontend/server/api/users/index.get.js`:

1. Obtiene `jsonServerUrl` de la configuración.
2. Pide todos los registros de `/users` a JSON Server.
3. Devuelve la lista completa como respuesta de `/api/users`.

`frontend/app/stores/user.js` ofrece `getUsers()`, que llama a `/api/users` y guarda la respuesta en `this.users`. Este store de lista es diferente de `useAuthStore()` y no participa en el registro ni en el login descritos arriba.

## 10. Observaciones importantes sobre lo que hace el código actual

- La contraseña se guarda sin cifrar en `backend/db.json`. El endpoint de login también la compara directamente con el valor guardado.
- La respuesta exitosa del endpoint de login excluye la contraseña, pero la respuesta del endpoint de registro devuelve el registro creado tal como lo devuelve JSON Server, incluida la contraseña.
- El endpoint `/api/users` devuelve todos los campos de todos los usuarios tal como llegan de JSON Server, incluida la contraseña guardada. No es el endpoint que necesita el formulario de login.
- La interfaz marca todos los campos del registro como obligatorios, pero en el servidor la comprobación explícita es para la contraseña y para que el nombre de usuario no esté repetido. No hay una comprobación de correo único en el código de registro.
- Estos puntos describen el comportamiento que existe en el código; no significan que sea apropiado para un sistema que maneja cuentas reales.
