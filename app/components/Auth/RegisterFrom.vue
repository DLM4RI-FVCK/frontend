<script setup>

const auth = useAuthStore();

const usuario = ref("");
const nombre = ref("");
const apellido = ref("");
const email = ref("");
const contraseña = ref("");


const register = async () => {
	try {
		await auth.register({
			usuario: usuario.value,
			nombre: nombre.value,
			apellido: apellido.value,
			email: email.value,
			password: contraseña.value,
		});

		alert("Registro exitoso");

		navigateTo("/login");
	} catch (error) {
		alert(error.data?.statusMessage || "Error al registrarse");
}
};


</script>

<template>
	<div class="text-center">
		<form @submit.prevent="register">
			<input v-model="usuario" placeholder="Usuario" required />
			<br>
			<br>	
			<input v-model="nombre" placeholder="Nombre" required />
			<br>
			<br>
			<input v-model="apellido" placeholder="Apellido" required />
			<br>
			<br>
			<input v-model="email" type="email" placeholder="Correo" required />
			<br>
			<br>
			<input v-model="contraseña" type="password" placeholder="Contraseña" required />
			<br>
			<br>
			<button type="submit">Registrarse</button>
		</form>
	</div>
</template>
