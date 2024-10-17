<template>
  <LoadingPage :isLoading="loading" />
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col>
        <v-card class="border border-success">
          <v-card-title class="bg-success text-white">REGISTER</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="form.nombre"
                label="Nombre"
                outlined
                autofocus
                class="input"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.apellido"
                label="Apellido"
                outlined
                autofocus
                class="input"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.ci"
                label="CI"
                outlined
                autofocus
                class="input"
                required
              ></v-text-field>
               <v-select
                v-model="form.sexo"
                :items="sexos"
                label="Sexo"
                outlined
                class="input"
                required
              ></v-select>
              <v-text-field
                v-model="form.direccion"
                label="Dirección"
                outlined
                autofocus
                class="input"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.telefono"
                label="Teléfono"
                outlined
                class="input"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                outlined
                prepend-icon="mdi-at"
                class="input"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.user"
                label="User"
                outlined
                prepend-icon="mdi-account"
                autofocus
                class="input"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                label="Password"
                outlined
                prepend-icon="mdi-key"
                type="password"
                class="input"
                required
              ></v-text-field>
              <v-btn type="submit" class="bg-blue-grey-darken-4 input" dark block >Crear</v-btn>
              <v-btn to="/login" class="bg-blue-grey-darken-4 input" dark block >Regresar a Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';

const authStore = useAuthStore();
const loading = ref(false);

//Formulario para crear el usuario
const form = ref({
  nombre: '',
  apellido: '',
  ci: '',
  sexo: 'Masculino',
  direccion: '',
  telefono: '',
  email: '',
  user: '',
  password: ''
});

const sexos = ['Masculino', 'Femenino'];

const calculateFechaNacimiento = (ci) => {
  const year = ci.substring(0, 2);
  const month = ci.substring(2, 4);
  const day = ci.substring(4, 6);
  const fullYear = year < '25' ? `20${year}` : `19${year}`;
  return `${day}-${month}-${fullYear}`;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Registrar en tabla user
    await axios.post('/api/auth/register', {
      name: form.value.user,
      email: form.value.email,
      password: form.value.password
    });

    // Calcular fecha de nacimiento
    const fechaNacimiento = calculateFechaNacimiento(form.value.ci);

    // Registrar en tabla paciente
    await axios.post('/api/paciente', {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      ci: form.value.ci,
      fecha_nacimiento: fechaNacimiento,
      sexo: form.value.sexo,
      direccion: form.value.direccion,
      telefono: form.value.telefono,
      correo: form.value.email,
      usuario: form.value.user,
      contrasena: form.value.password   
    });
  } catch (error) {
    console.error('Error al registrar:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.input {
  margin-top: 1rem;
}
</style>
