<template>
  <LoadingPage :isLoading="loading" />
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col>
        <v-card class="border border-success">
          <v-card-title class="bg-success text-white">{{ $t("REGISTRO") }}</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">

              <v-text-field
                v-model="form.nombre"
                :label="$t('Nombre')"
                outlined
                autofocus
                class="input"
                required
                :error-messages="errors.nombre" 
              ></v-text-field>

              <v-text-field
                v-model="form.apellido"
                :label="$t('Apellido')"
                outlined
                autofocus
                class="input"
                required
                :error-messages="errors.apellido"
              ></v-text-field>

              <v-text-field
                v-model="form.ci"
                :label="$t('CI')"
                outlined
                autofocus
                class="input"
                required
                :error-messages="errors.ci"
              ></v-text-field>

               <v-select
                v-model="form.sexo"
                :items="sexos"
                :label="$t('Sexo')"
                outlined
                class="input"
                required
              ></v-select>

              <v-text-field
                v-model="form.direccion"
                :label="$t('Dirección')"
                outlined
                autofocus
                class="input"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.telefono"
                :label="$t('Teléfono')"
                outlined
                class="input"
                required
                :error-messages="errors.telefono"
              ></v-text-field>

              <v-text-field
                v-model="form.email"
                :label="$t('Correo electrónico')"
                outlined
                prepend-icon="mdi-at"
                class="input"
                required
                :error-messages="errors.email"
              ></v-text-field>

              <v-text-field
                v-model="form.user"
                :label="$t('Usuario')"
                outlined
                prepend-icon="mdi-account"
                autofocus
                class="input"
                required
                :error-messages="errors.user"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                :label="$t('Contraseña')"
                outlined
                prepend-icon="mdi-key"
                type="password"
                class="input"
                required
                :error-messages="errors.password"
              ></v-text-field>

              <v-btn type="submit" class="bg-blue-grey-darken-4 input" dark block >{{ $t("Crear") }}</v-btn>
              <v-btn to="/login" class="bg-blue-grey-darken-4 input" dark block >{{ $t("Regresar a Iniciar sesión") }}</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/store/auth";
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const loading = ref(false);
let sexos = ref([]);

const { t, locale } = useI18n(); // Usa t en lugar de $t

// Verificamos el idioma de la etiqueta para configurar el valor de "sexo" en "form"
const form = ref({
  nombre: '',
  apellido: '',
  ci: '',
  sexo: t('Sexo') === 'Sexo' ? 'Masculino' : 'Male', // Asignamos el valor según el idioma
  direccion: '',
  telefono: '',
  email: '',
  user: '',
  password: ''
});

const errors = ref({
  nombre: '',
  apellido: '',
  ci: '',
  telefono: '',
  email: '',
  user: '',
  password: ''
});

sexos.value = ['Masculino', 'Femenino'];

/// Función para actualizar los sexos
const updateSexos = () => {
  if (t('Sexo') === 'Sexo') {
    sexos.value = ['Masculino', 'Femenino']; // Español
    form.value.sexo = 'Masculino'; // Establecer el valor por defecto
  } else {
    sexos.value = ['Male', 'Female']; // Inglés
    form.value.sexo = 'Male'; // Establecer el valor por defecto
  }
};

// Observamos los cambios en el idioma y actualizamos los sexos y el campo 'sexo'
watch(locale, () => {
  updateSexos();
});

const validateNombre = () => {
  let error = '';
  if (!/^[A-Za-z\s]+$/.test(form.value.nombre)) {
    error = t('El nombre debe ser una cadena de texto.');
  } else if (form.value.nombre.length > 50) {
    error = t('El nombre debe tener un máximo de 50 caracteres.');
  }
  errors.value.nombre = error;
  return error === ''; // Retorna si la validación fue exitosa
};

const validateApellido = () => {
  let error = '';
  if (!/^[A-Za-z\s]+$/.test(form.value.apellido)) {
    error = t('Los apellidos deben ser una cadena de texto.');
  } else if (form.value.apellido.length > 50) {
    error = t('Los apellidos deben tener un máximo de 50 caracteres.');
  }
  errors.value.apellido = error;
  return error === '';
};

const validateCI = () => {
  let error = '';
  if (!/^\d{11}$/.test(form.value.ci)) {
    error = t('El Carné de Identidad debe contener exactamente 11 caracteres y solo números.');
  }
  errors.value.ci = error;
  return error === '';
};

const validateTelefono = () => {
  let error = '';
  if (!/^\d{8}$/.test(form.value.telefono)) {
    error = t('El teléfono debe tener 8 números y contener solo números.');
  }
  errors.value.telefono = error;
  return error === '';
};

const validateEmail = () => {
  let error = '';
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.value.email)) {
    error = t('El correo debe tener un formato de correo válido.');
  } else if (form.value.email.length > 100) {
    error = t('El correo debe tener un máximo de 100 caracteres.');
  }
  errors.value.email = error;
  return error === '';
};

const validateUser = () => {
  let error = '';
  if (!/^[A-Za-z0-9]+$/.test(form.value.user)) {
    error = t('El usuario debe contener solo caracteres alfanuméricos.');;
  } else if (form.value.user.length < 5) {
    error = t('El usuario debe tener un mínimo de 5 caracteres.');;
  } else if (form.value.user.length > 20) {
    error = t('El usuario debe tener un máximo de 20 caracteres.');;
  }
  errors.value.user = error;
  return error === '';
};

const validatePassword = () => {
  let error = '';
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8}$/.test(form.value.password)) {
    error = t('La contraseña debe contener exactamente 8 caracteres, al menos una letra mayúscula, un dígito y un carácter especial.');;
  }
  errors.value.password = error;
  return error === '';
};

const calculateFechaNacimiento = (ci) => {
  const year = ci.substring(0, 2);
  const month = ci.substring(2, 4);
  const day = ci.substring(4, 6);
  const fullYear = year < '25' ? `20${year}` : `19${year}`;
  return `${fullYear}-${month}-${day}`; 
};

const handleSubmit = async () => {
  // Limpiar errores previos
  errors.value = {
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    email: '',
    user: '',
    password: ''
  };

  // Validar campos
  const isNombreValid = validateNombre();
  const isApellidoValid = validateApellido();
  const isCIValid = validateCI();
  const isTelefonoValid = validateTelefono();
  const isEmailValid = validateEmail();
  const isUserValid = validateUser();
  const isPasswordValid = validatePassword();

  if (!isNombreValid || !isApellidoValid || !isCIValid || !isTelefonoValid || !isEmailValid || !isUserValid || !isPasswordValid) {
    // No hacer la solicitud si alguna validación falla
    return;
  }

  loading.value = true;
  try {
    // Registro en la API
    await axios.post('/api/auth/register', {
      name: form.value.user,
      email: form.value.email,
      password: form.value.password
    });

    const fechaNacimiento = calculateFechaNacimiento(form.value.ci);

    if (form.value.sexo === 'Male') {
      form.value.sexo = 'Masculino'; // Convertir a 'Masculino' si es 'Male'
    } else if (form.value.sexo === 'Female') {
      form.value.sexo = 'Femenino'; // Convertir a 'Femenino' si es 'Female'
    }

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
    console.error('Error al registrar:', error.response ? error.response.data : error);
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