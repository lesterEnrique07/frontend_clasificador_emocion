<template>
  <LoadingPage :isLoading="loading" />
  <div class="main-content">
    <v-container class="mt-5">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8">
          <v-card class="border border-success">
            <v-card-title class="bg-success text-white">Revisión de Emociones</v-card-title>
            <v-card-text>
              <v-progress-circular v-if="loading" indeterminate></v-progress-circular>

              <div v-if="!loading" class="photos">
                <img v-for="(multimedia, index) in multimedias.slice(1)" :key="index" :src="multimedia.direccion_url" class="photo"/>
              </div>

              <audio v-if="!loading && multimedias[0]?.direccion_url" :src="multimedias[0].direccion_url" controls class="audio"></audio>

              <v-btn @click="regresar" class="bg-blue-grey-darken-4 input" dark block>Regresar</v-btn>

              <div v-if="!loading && (audioEmotions || photoEmotions || combinedEmotions)" class="emotion-results">
                <div v-if="audioEmotions" class="emotion-box">
                  <img :src="getEmotionImage(audioEmotions)" alt="Emoción del Audio" class="emotion-image" />
                  <h4>Emoción del Audio</h4>
                  <p>{{ audioEmotions }}</p>
                </div>
                <div v-if="photoEmotions" class="emotion-box">
                  <img :src="getEmotionImage(photoEmotions)" alt="Emoción de las Fotos" class="emotion-image" />
                  <h4>Emoción de las Fotos</h4>
                  <p>{{ photoEmotions }}</p>
                </div>
                <div v-if="combinedEmotions" class="emotion-box">
                  <img :src="getEmotionImage(combinedEmotions)" alt="Emoción Combinado" class="emotion-image" />
                  <h4>Emoción Combinado</h4>
                  <p>{{ combinedEmotions }}</p>
                </div>
              </div>

              <video ref="video" style="display: none;"></video>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter, useRoute } from 'vue-router';
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';
import { defineProps } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const audioEmotions = ref(null);
const photoEmotions = ref(null);
const combinedEmotions = ref(null);
const multimedias = ref([]);

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const fetchMultimedia = async (id) => {
  try {
    const multimediaResponse = await axios.get(`/api/sesion/${id}/lista-de-multimedia-por-sesion`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    multimedias.value = multimediaResponse.data;
    console.log('Nueva :', multimedias.value);
    

  } catch (error) {
    console.error('Error al obtener multimedia:', error);
  } finally {
    loading.value = false; // Termina de cargar aquí
  }
};

const fetchSession = async (id) => {
  try {
    const sessionResponse = await axios.get(`/api/sesion/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const clasificacionId = sessionResponse.data.clasificacion_id; // Obtener clasificacion_id
    await fetchClasificacion(clasificacionId); // Llamar a la función para obtener la clasificación
  } catch (error) {
    console.error('Error al obtener sesión:', error);
  }
};

const fetchClasificacion = async (clasificacionId) => {
  try {
    const clasificacionResponse = await axios.get(`/api/clasificacion/${clasificacionId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    audioEmotions.value = clasificacionResponse.data.emocion_audio;
    photoEmotions.value = clasificacionResponse.data.emocion_foto;
    combinedEmotions.value = clasificacionResponse.data.emocion_audio_foto;
  } catch (error) {
    console.error('Error al obtener clasificación:', error);
  }
};

// Obtener el ID de la sesión desde los parámetros de la ruta
const sessionId = route.params.id;

// Llamar a las funciones al montar el componente
onMounted(() => {
  fetchMultimedia(sessionId);
  fetchSession(sessionId);
});

const getEmotionImage = (emotion) => {
  const emotionImages = {
    "Ira": require('@/assets/3-Ira.jpg'),
    "Miedo": require('@/assets/4-Miedo.jpg'),
    "Felicidad": require('@/assets/2-Felicidad.jpg'),
    "Tristeza": require('@/assets/6-Tristeza.jpg'),
    "Neutralidad": require('@/assets/5-Neutralidad.jpg'),
    "Asco": require('@/assets/1-Asco.jpg'),
  };
  return emotionImages[emotion];
};

const regresar = () => {
  router.push({ name: 'registros' });
};




</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.main-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.input {
  margin-top: 1rem;
}

.photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 1rem;
}

.photo {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
}

.audio {
  margin-top: 1rem;
  width: 100%;
}

.btn-separado {
  margin-top: 1rem;
}

.emotion-results {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.emotion-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;  /* Aumenta el ancho de la caja */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.emotion-image {
  width: 180px;  /* Tamaño máximo de la imagen */
  height: 180px;  /* Tamaño máximo de la imagen */
  object-fit: contain;  /* Evita la distorsión */
  margin-bottom: 10px;
}

h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}

p {
  font-size: 0.9rem;
  text-align: center;
}
</style>