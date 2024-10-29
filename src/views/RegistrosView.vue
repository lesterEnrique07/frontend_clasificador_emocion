<template>
    <LoadingPage :isLoading="loading" />
  <div class="main-content">
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="border border-success">
                <v-card-title class="bg-success text-white">Registros</v-card-title>
                <div v-for="sesion in sesions" :key="sesion.id" class="registro-card">
                  <div class="registro-info">
                    <p class="registro-date">{{ formatDate(sesion.fecha) }}</p>
                    <div class="emotions-images">
                      <img :src="getEmotionImage(sesion.emocion_audio)" alt="Emoción del Audio" class="emotion-image" />
                      <img :src="getEmotionImage(sesion.emocion_foto)" alt="Emoción de las Fotos" class="emotion-image" />
                      <img :src="getEmotionImage(sesion.emocion_audio_foto)" alt="Emoción Combinado" class="emotion-image" />
                    </div>
                  </div>
                  <button @click="revisarSesion(sesion.id)" class="revisar-button">Revisar</button>
                </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </div>   
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';

const sesions = ref([]);
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const audioEmotions = ref(null);
const photoEmotions = ref(null);
const combinedEmotions = ref(null);

const getEmotionImage = (emotion) => {
  const emotionImages = {
    "Ira": require('@/assets/3-Ira.jpg'),
    "Miedo": require('@/assets/4-Miedo.jpg'),
    "Felicidad": require('@/assets/2-Felicidad.jpg'),
    "Tristeza": require('@/assets/6-Tristeza.jpg'),
    "Neutralidad": require('@/assets/5-Neutralidad.jpg'),
    "Asco": require('@/assets/1-Asco.jpg'),
    "Neutralidad": require('@/assets/5-Neutralidad.jpg'),
  };
  return emotionImages[emotion];
};

const fetchSesions = async () => {

  loading.value = true;

  try {
    const pacienteResponse = await axios.get(`/api/paciente/${authStore.authUser.name}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const response = await axios.get(`/api/paciente/${pacienteResponse.data.id}/lista-de-sesiones`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    // Ordena las sesiones por fecha
    sesions.value = response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Realiza la solicitud para cada sesión y añade emociones al objeto de sesión
    for (const sesion of sesions.value) {
      if (sesion.clasificacion_id) {
        try {
          const clasificacionResponse = await axios.get(`/api/clasificacion/${sesion.clasificacion_id}`, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          });
          
          // Añade las emociones obtenidas a la sesión actual
          sesion.emocion_audio = clasificacionResponse.data.emocion_audio;
          sesion.emocion_foto = clasificacionResponse.data.emocion_foto;
          sesion.emocion_audio_foto = clasificacionResponse.data.emocion_audio_foto;

          loading.value = false;

        } catch (error) {
          console.error(`Error al obtener la clasificación para la sesión ${sesion.id}:`, error);
        }
      } else {
        console.warn(`La sesión ${sesion.id} no tiene un clasificacion_id.`);
      }
    }
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
};

const revisarSesion = (id) => {
  // Navegar a la página de revisión para este ID de sesión
  router.push({ name: 'RevisarSesion', params: { id } });
};

const formatDate = (date) => {
  // Verifica si el valor de la fecha no es null y procede con la conversión
  if (!date) return 'Fecha no disponible';
  
  // Convierte la cadena de fecha en un objeto Date y aplica formato en español
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

// Llamamos a fetchSesions al montar el componente
onMounted(fetchSesions);

</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.registro-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: #f7f7f7;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.registro-info {
  display: flex;
  flex-direction: column;
}

.registro-date {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.emotion-image {
  width: 40px;  /* Tamaño máximo de la imagen */
  height: 40px;  /* Tamaño máximo de la imagen */
  object-fit: contain;  /* Evita la distorsión */
  margin-bottom: 5px;
  margin-right: 5px;
}

.revisar-button {
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.revisar-button:hover {
  background-color: #45a049;
}
</style>