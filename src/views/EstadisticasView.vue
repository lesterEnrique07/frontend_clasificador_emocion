<template>
  <LoadingPage :isLoading="loading" />
  <div class="main-content">
    <v-container class="mt-5">
      <v-row justify="center">
        <v-col cols="16" sm="12" md="10">
          <v-card class="border border-primary">
            <v-card-title class="bg-success text-white">{{ $t("Estadísiticas") }}</v-card-title>
            <div v-for="(registro, index) in estadisticas" :key="index" class="registro-card">
              <div class="registro-info">
                <p class="registro-date" style="text-align: center;">
                  {{ translate(registro.fecha) }}
                </p>
                <div :class="['emotions-images', { 'horizontal': index === 0 }]">
                  <template v-if="index === 0">
                    <div class="emotion-container">
                      <img :src="getEmotionImage(registro.emocion_audio)" alt="Emoción del Audio" class="emotion-image" />
                      <p><b>{{ $t("Emoción del Audio:") }}</b> {{ translateE(registro.emocion_audio) }} <br> <b>{{ $t("Total de veces:") }}</b> {{ registro.emocion_audio_cantidad }}</p>
                    </div>
                    <div class="emotion-container">
                      <img :src="getEmotionImage(registro.emocion_foto)" alt="Emoción de las Fotos" class="emotion-image" />
                      <p><b>{{ $t("Emoción de las Fotos:") }}</b> {{ translateE(registro.emocion_foto) }} <br> <b>{{ $t("Total de veces:") }}</b> {{ registro.emocion_foto_cantidad }}</p>
                    </div>
                    <div class="emotion-container">
                      <img :src="getEmotionImage(registro.emocion_audio_foto)" alt="Emoción Combinado" class="emotion-image" />
                      <p><b>{{ $t("Emoción Combinado:") }}</b> {{ translateE(registro.emocion_audio_foto) }} <br> <b>{{ $t("Total de veces:") }}</b> {{ registro.emocion_audio_foto_cantidad }}</p>
                    </div>
                  </template>
                </div>

                <div class="emotions-images">
                  <template v-if="index === 1">
                        <div v-for="(row, rowIndex) in registro.emocion_distribucion" :key="rowIndex" class="emotion-row">
                            <p style="margin: 30px 10px;">
                                <b>
                                    {{ rowIndex === 0 ? t('Emociones del Audio:') : rowIndex === 1 ? t('Emociones de las Fotos:') : t('Emociones Combinado:') }}
                                </b>
                            </p>
                            <div style="display: flex; flex-grow: 1; justify-content: flex-start;">
                                <!-- Ajustado para desestructurar el par [emotion, count] correctamente -->
                                <div v-for="([emotion, count], emotionIndex) in row" :key="emotionIndex" class="emotion-container">
                                    <img :src="getEmotionImage(emotion)" class="emotion-image" />
                                    <p style="text-align: center;">{{ translateE(emotion) }} - {{ count }}</p> <!-- Nombre de la emoción y su conteo -->
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="index === 2">
                        <div v-for="(row, rowIndex) in registro.emocion_diversidad" :key="rowIndex" class="emotion-row">
                            <p style="margin: 30px 10px;">
                                <b>
                                    {{ rowIndex === 0 ? t('Emociones del Audio:') : rowIndex === 1 ? t('Emociones de las Fotos:') : t('Emociones Combinado:') }}
                                </b>
                            </p>
                            <div style="display: flex; flex-grow: 1; justify-content: flex-start;">
                                <!-- Ajustado para desestructurar el par [emotion, count] correctamente -->
                                <div v-for="([emotion, count], emotionIndex) in row" :key="emotionIndex" class="emotion-container">
                                    <img :src="getEmotionImage(emotion)" class="emotion-image" />
                                    <p style="text-align: center;">{{ translateE(emotion) }} - {{ formatCount(count) }}%</p> <!-- Nombre de la emoción y su conteo -->
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
              </div>
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
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';
import { useI18n } from "vue-i18n";

const { t } = useI18n(); // Usa t en lugar de $t
const authStore = useAuthStore();
const estadisticas = ref([
  {
    fecha: 'Emoción Más Común', // Primera tarjeta con emoción más común
    emocion_audio: null,
    emocion_foto: null,
    emocion_audio_foto: null,
    emocion_audio_cantidad: null,
    emocion_foto_cantidad: null,
    emocion_audio_foto_cantidad: null,
  },
  {
    fecha: 'Distribución de Emociones', // Segunda tarjeta con la distribución de emociones
    emocion_distribucion: [[], [], []], // Tres filas para audio, foto y combinado
  },
  {
    fecha: 'Diversidad de Emociones', // Tercera tarjeta con la diversidad de emociones
    emocion_diversidad: [[], [], []], // Tres filas para audio, foto y combinado
  }
]);

const translate = (fecha) => {
  if (fecha === 'Emoción Más Común') return t("Emoción Más Común");
  if (fecha === 'Distribución de Emociones') return t("Distribución de Emociones");
  if (fecha === 'Diversidad de Emociones') return t("Diversidad de Emociones");
  return fecha; // Default in case the value is different
};

const translateE = (emotion) => {
  if (emotion === 'Asco') return t("Asco");
  if (emotion === 'Felicidad') return t("Felicidad");
  if (emotion === 'Ira') return t("Ira");
  if (emotion === 'Miedo') return t("Miedo");
  if (emotion === 'Neutralidad') return t("Neutralidad");
  if (emotion === 'Tristeza') return t("Tristeza");
  return emotion; // Default in case the value is different
};

const loading = ref(false);

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

const formatCount = (count) => {
  return count % 1 === 0 ? count : count.toFixed(2);
};

// Función para obtener la emoción más común desde la API
const fetchMostCommonEmotion = async () => {
  try {

    loading.value = true;

    const pacienteResponse = await axios.get(`/api/paciente/${authStore.authUser.name}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const response = await axios.get(`api/paciente/${pacienteResponse.data.id}/emocion-mas-repetida`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    estadisticas.value[0].emocion_audio = response.data.emocion_audio.emocion;
    estadisticas.value[0].emocion_foto = response.data.emocion_foto.emocion;
    estadisticas.value[0].emocion_audio_foto = response.data.emocion_audio_foto.emocion;
    estadisticas.value[0].emocion_audio_cantidad = response.data.emocion_audio.cantidad;
    estadisticas.value[0].emocion_foto_cantidad = response.data.emocion_foto.cantidad;
    estadisticas.value[0].emocion_audio_foto_cantidad = response.data.emocion_audio_foto.cantidad;

    loading.value = false;

  } catch (error) {
    console.error('Error fetching most common emotion:', error);
  }
};

// Función para obtener la distribución de emociones desde la API
const fetchEmotionDistribution = async () => {
  try {

    loading.value = true;

    const pacienteResponse = await axios.get(`/api/paciente/${authStore.authUser.name}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const response = await axios.get(`api/paciente/${pacienteResponse.data.id}/distribucion-de-emociones`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Ordenamos las emociones por frecuencia de mayor a menor para cada categoría
    estadisticas.value[1].emocion_distribucion[0] = Object.entries(response.data.emocion_audio)
      .sort((a, b) => b[1] - a[1]);

    estadisticas.value[1].emocion_distribucion[1] = Object.entries(response.data.emocion_foto)
      .sort((a, b) => b[1] - a[1]);

    estadisticas.value[1].emocion_distribucion[2] = Object.entries(response.data.emocion_audio_foto)
      .sort((a, b) => b[1] - a[1]);

    loading.value = false;
    
  } catch (error) {
    console.error('Error fetching emotion distribution:', error);
  }
};

// Función para obtener la distribución de emociones desde la API
const fetchEmotionDiversity = async () => {
  try {

    loading.value = true;

    const pacienteResponse = await axios.get(`/api/paciente/${authStore.authUser.name}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const response = await axios.get(`api/paciente/${pacienteResponse.data.id}/diversidad-de-emociones`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Ordenamos las emociones por frecuencia de mayor a menor para cada categoría
    estadisticas.value[2].emocion_diversidad[0] = Object.entries(response.data.emocion_audio)
      .sort((a, b) => b[1] - a[1]);

    estadisticas.value[2].emocion_diversidad[1] = Object.entries(response.data.emocion_foto)
      .sort((a, b) => b[1] - a[1]);

    estadisticas.value[2].emocion_diversidad[2] = Object.entries(response.data.emocion_audio_foto)
      .sort((a, b) => b[1] - a[1]);

    loading.value = false;
    
  } catch (error) {
    console.error('Error fetching emotion distribution:', error);
  }
};

// Llama a la API cuando se monta el componente
onMounted(() => {
  fetchMostCommonEmotion();
  fetchEmotionDistribution();
  fetchEmotionDiversity();
});
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
  justify-content: center;
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

.emotions-images {
  display: flex;
  flex-direction: column;
}

.emotion-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.emotion-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.emotion-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 2px 1px;
}

.emotions-images.horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

</style>