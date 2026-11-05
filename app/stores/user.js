export const useUsersStore = defineStore('users', {

  state: () => ({
    users: []
  }),

  actions: {

    async getUsers() {
      this.users = await $fetch('/api/users')
    }

  }

})