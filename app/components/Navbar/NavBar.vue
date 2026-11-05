<template>
	<v-app-bar class="bg-transparent" style="border: none; box-shadow: none;">
		<v-container fluid class="py-6 d-flex justify-space-between" style="max-width: 1000px;">
			<div>
				<h1>
					<NuxtLink to="/inicio" class="text-black" style="text-decoration: none;">
						Finny
					</NuxtLink>
				</h1>
			</div>

			<div class="d-flex justify-center">
				<button @click="auth.logout" class="bg-transparent" style="border: none;">
					<v-icon class="text-red">
							mdi-keyboard-return
					</v-icon>
				</button>
			</div>
		</v-container>
	</v-app-bar>
</template>

<script setup>
const auth = useAuthStore();
</script>

<style></style>