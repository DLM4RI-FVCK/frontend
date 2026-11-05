
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return
  }

  const auth = useAuthStore()
  auth.restoreSession()

  // Si no hay usuario, enviarlo al login
  if (!auth.user) {
    return navigateTo('/login')
  }
})
