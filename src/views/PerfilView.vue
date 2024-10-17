<template>
  <LoadingPage :isLoading="loading" />
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="border border-success">
          <v-card-title class="bg-success text-white" >Perfil del Usuario</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nombre</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.nombre }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Apellido</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.apellido }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>CI</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.ci }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Fecha de Nacimiento</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.fecha_nacimiento }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Sexo</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.sexo }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Dirección</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.direccion }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Teléfono</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.telefono }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.correo }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Usuario</v-list-item-title>
                  <v-list-item-subtitle>{{ paciente.usuario }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const loading = ref(false);
const paciente = ref({
  nombre: '',
  apellido: '',
  ci: '',
  fecha_nacimiento: '',
  sexo: '',
  direccion: '',
  telefono: '',
  correo: '',
  usuario: ''
});

const authStore = useAuthStore();

onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/paciente/${authStore.authUser.name}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    paciente.value = response.data;
  } catch (error) {
    console.error('Error al obtener los datos del paciente:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.input {
  margin-top: 1rem;
}
</style>