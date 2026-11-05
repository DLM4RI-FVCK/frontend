# Finny

Finny es una aplicación web de educación y gestión financiera personal. Su propósito es ayudar a las personas a organizar sus movimientos de dinero, desarrollar hábitos de ahorro y aprender conceptos financieros de forma clara, visual y amigable.

## Equipo

| Integrante | Rol y aporte |
| --- | --- |
| **Mario Castro** | Desarrollo técnico, arquitectura del proyecto, implementación en Nuxt/Vue, componentes funcionales, navegación, comunicación entre componentes, configuración de Vuetify y conversión del código a JavaScript. |
| **Kiara Corena** | Diseño UI/UX, definición de la identidad visual de Finny, criterios de color, estilo de marca y experiencia general del producto. |
| **Andrea Hernandez** | Diseño UI/UX, composición de pantallas, organización visual de contenidos y adaptación de la interfaz a diferentes tamaños de pantalla. |

## Funcionalidades implementadas

### Dashboard financiero

- Resumen de saldo disponible, ahorro y deudas.
- Carrusel de tarjetas financieras con variaciones y referencias.
- Estadísticas del usuario: racha, nivel y puntos.
- Acciones rápidas para registrar un ingreso, un gasto o un ahorro.
- Diálogo dinámico de movimientos usando `props`, `emits` y `v-model`.
- Navegación inferior para las áreas principales de la aplicación.
- Tarjetas de consejos y aprendizaje financiero.

### Educación financiera

- Página independiente en `/education`.
- Header con navegación de regreso, racha y puntos de experiencia.
- Tarjeta de nivel actual con progreso de XP.
- Sección de logros desbloqueados.
- Ruta de aprendizaje con lecciones completadas, activas y bloqueadas.
- Reto diario con recompensa de experiencia.
- Quiz interactivo sobre la regla financiera 50/30/20.
- Respuesta visual para indicar si la opción seleccionada es correcta.
- Diseño responsive para escritorio, tablet y móvil.
- Componentes separados dentro de `app/components/education/`.
- Layout específico para educación en `app/layouts/education.vue`.

### Autenticación y navegación

- Pantallas de inicio de sesión y registro.
- Layout de autenticación independiente.
- Layout general para las páginas principales.
- Navegación entre dashboard y educación mediante Nuxt.

## Arquitectura del proyecto

```text
app/
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── dashboard/
│   │   ├── DashboardBottomNavigation.vue
│   │   ├── DashboardHeader.vue
│   │   ├── FinanceActions.vue
│   │   ├── CarruselFinanzas.vue
│   │   ├── FinnyTips.vue
│   │   ├── LearningSlide.vue
│   │   └── MovementDialog.vue
│   ├── education/
│   │   ├── EducationAchievements.vue
│   │   ├── EducationChallenge.vue
│   │   ├── EducationHeader.vue
│   │   ├── EducationLevelCard.vue
│   │   ├── EducationQuiz.vue
│   │   └── EducationRoute.vue
│   ├── Login/
│   └── Register/
├── layouts/
│   ├── auth.vue
│   ├── default.vue
│   └── education.vue
├── pages/
│   ├── dashboard.vue
│   ├── education.vue
│   ├── index.vue
│   ├── login.vue
│   └── register.vue
└── plugins/
	└── vuetify.js
```

La aplicación utiliza una estructura de componentes reutilizables. Las páginas coordinan los datos y la navegación, mientras que los componentes se encargan de representar cada sección de la interfaz.

## Comunicación entre componentes

### ¿Qué son el padre, el hijo, las props y los emits?

Un **componente padre** es el que coloca a otro componente dentro de su plantilla. El componente colocado es su **hijo**. En este proyecto, por ejemplo, `dashboard.vue` es el padre de `FinanceActions.vue` y `MovementDialog.vue`.

- Una **prop** es información que el padre le pasa al hijo. Como una persona que entrega una nota: el hijo la recibe y la muestra o la usa.
- Un **emit** es un aviso que el hijo le manda al padre cuando sucede algo. Como levantar la mano para decirle algo a quien está a cargo.
- **`v-model`** mantiene un valor sincronizado. En un componente propio, Vue lo conecta usando una prop `modelValue` y un evento `update:modelValue`.

### ¿Dónde hay props?

| Prop | Padre → hijo | ¿Qué hace? |
| --- | --- | --- |
| `modelValue` | [`app/pages/dashboard.vue`](./app/pages/dashboard.vue) → [`app/components/Dashboard/MovementDialog.vue`](./app/components/Dashboard/MovementDialog.vue) | Indica si el diálogo está abierto (`true`) o cerrado (`false`). Es el valor que controla el `v-model` del diálogo. |
| `tipoMovimiento` (se pasa como `tipo-movimiento`) | [`app/pages/dashboard.vue`](./app/pages/dashboard.vue) → [`app/components/Dashboard/MovementDialog.vue`](./app/components/Dashboard/MovementDialog.vue) | Indica si el título y el texto del diálogo deben decir ingreso, gasto o ahorro. |

**Analogía:** el padre prepara una ventana, le dice al hijo si debe estar abierta o cerrada y le pasa una etiqueta con lo que va a mostrar.

**Técnicamente:** `dashboard.vue` guarda los valores y los envía con `v-model="dialogoMovimiento"` y `:tipo-movimiento="movimientoSeleccionado"`. `MovementDialog.vue` los recibe con `defineProps`.

### ¿Qué emits hay?

| Evento | Hijo → padre | ¿Qué avisa? |
| --- | --- | --- |
| `seleccionar` | [`app/components/Dashboard/FinanceActions.vue`](./app/components/Dashboard/FinanceActions.vue) → [`app/pages/dashboard.vue`](./app/pages/dashboard.vue) | Envía el texto `ingreso`, `gasto` o `ahorro` cuando se elige una acción. |
| `update:modelValue` | [`app/components/Dashboard/MovementDialog.vue`](./app/components/Dashboard/MovementDialog.vue) → [`app/pages/dashboard.vue`](./app/pages/dashboard.vue) | Envía el nuevo estado del diálogo para que el padre también sepa si está abierto o cerrado. |

**Analogía de `seleccionar`:** el hijo avisa “eligieron gasto”; el padre recibe el aviso y abre el diálogo correcto.

**Técnicamente:** `FinanceActions.vue` ejecuta `emitir('seleccionar', accion)` y `dashboard.vue` escucha con `@seleccionar="abrirDialogoMovimiento"`.

**Analogía de `update:modelValue`:** el hijo avisa “la ventana se cerró”; el padre actualiza su propio registro.

**Técnicamente:** el diálogo emite `update:modelValue` con `true` o `false`. El `v-model` de `dashboard.vue` usa ese evento para actualizar `dialogoMovimiento`. También recibe el aviso de Vuetify cuando se cierra el diálogo.

### ¿Cómo funciona el `v-model` del diálogo?

En [`app/pages/dashboard.vue`](./app/pages/dashboard.vue), esta línea conecta al padre con el hijo:

```vue
<MovementDialog v-model="dialogoMovimiento" :tipo-movimiento="movimientoSeleccionado" />
```

Se puede leer como: “le paso `dialogoMovimiento` al hijo y dejo que el hijo me avise cuando cambie”. En [`app/components/Dashboard/MovementDialog.vue`](./app/components/Dashboard/MovementDialog.vue), `modelValue` recibe ese valor y `update:modelValue` devuelve los cambios. Así el padre conserva el control del estado.

### Otros `v-model` del proyecto

Estos `v-model` conectan datos con controles de Vuetify dentro del mismo componente; no son props ni emits propios entre las páginas y esos componentes:

| Ruta | ¿Qué sincroniza? |
| --- | --- |
| [`app/components/Login/LoginForm.vue`](./app/components/Login/LoginForm.vue) | La validez del formulario, el correo y la contraseña. |
| [`app/components/Register/RegisterForm.vue`](./app/components/Register/RegisterForm.vue) | La validez del formulario y los valores escritos en sus campos. |
| [`app/components/Dashboard/FinanceActions.vue`](./app/components/Dashboard/FinanceActions.vue) | Si el menú de acciones está abierto. |
| [`app/components/Dashboard/DashboardBottomNavigation.vue`](./app/components/Dashboard/DashboardBottomNavigation.vue) | La pestaña seleccionada en la navegación. |

[`app/pages/login.vue`](./app/pages/login.vue) es el padre de `LoginForm.vue` y [`app/pages/register.vue`](./app/pages/register.vue) es el padre de `RegisterForm.vue`. Actualmente esas páginas no les pasan props ni escuchan emits; cada formulario maneja sus propios campos.

## Tecnologías

- Nuxt 4.
- Vue 3.
- Vuetify.
- Vue Router.
- JavaScript.
- Vite.
- Material Design Icons.
- Fontsource Outfit.

Todo el código de la aplicación está escrito en JavaScript. No se utiliza TypeScript en los componentes ni en la configuración fuente del proyecto.

## Instalación

Requisitos:

- Node.js 18 o superior.
- npm.

Instalar dependencias:

```bash
npm install
```

## Desarrollo

Iniciar el servidor local:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

Si el puerto está ocupado, Nuxt seleccionará automáticamente otro puerto disponible.

## Compilación para producción

```bash
npm run build
```

Para generar una versión estática:

```bash
npm run generate
```

Para previsualizar la compilación:

```bash
npm run preview
```

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Página inicial. |
| `/login` | Inicio de sesión. |
| `/register` | Registro de usuario. |
| `/dashboard` | Panel principal de finanzas. |
| `/education` | Módulo de educación financiera. |

## Estado actual

La interfaz principal, el dashboard financiero y el módulo de educación están implementados con datos de ejemplo y componentes preparados para crecer. La siguiente etapa puede conectar estas vistas con autenticación real, persistencia de movimientos, perfiles de usuario y una API financiera.
