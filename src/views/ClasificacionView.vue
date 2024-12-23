<template>
  <LoadingPage :isLoading="loading" />
  <div class="main-content">
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="border border-success">
          <v-card-title class="bg-success text-white">{{ $t("Clasificación de Emociones") }}</v-card-title>
          <v-card-text>
            <v-btn @click="startRecording" :disabled="recording || recordingCompleted" class="bg-blue-grey-darken-4 input" dark block>{{ $t("Iniciar Grabación") }}</v-btn>
            <v-btn @click="toggleRecording" :disabled="!recording" :class="['btn-separado', recording ? (paused ? 'bg-yellow-darken-4' : 'bg-red-darken-4') : 'bg-grey darken-1']" dark block> {{ translate(paused ? 'Continuar Grabación' : 'Pausar Grabación') }} </v-btn>
            <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
            <div v-if="timeRemaining">{{ $t("Tiempo restante:") }} {{ timeRemaining }} {{ $t("segundos") }}</div>
            <div class="photos">
              <img v-for="(photo, index) in photos" :key="index" :src="photo.data" class="photo"/>
            </div>
            <audio v-if="audioURL" :src="audioURL" controls class="audio"></audio>
            <v-btn v-if="photos.length === 5 && !recording" @click="processRecording" :disabled="processButtonDisabled" class="bg-green-darken-4 input" dark block>{{ $t("Procesar") }}</v-btn>
            <v-btn v-if="showSaveButton && photos.length === 5 && !recording" @click="saveResults" class="bg-yellow-darken-4 input" dark block :disabled="saveButtonDisabled">{{ $t("Guardar") }}</v-btn>
            <v-btn @click="resetOrCancel" class="bg-blue-grey-darken-4 input" dark block>{{ translate(cancelButtonLabel) }}</v-btn>
            <div v-if="audioEmotions || photoEmotions || combinedEmotions" class="emotion-results">
                <div v-if="audioEmotions" class="emotion-box">
                  <img :src="getEmotionImage(audioEmotions)" alt="Emoción del Audio" class="emotion-image" />
                  <h4>{{ $t("Emoción del Audio") }}</h4>
                  <p>{{ translateE(traducirEmocion(audioEmotions)) }}</p>
                </div>
                <div v-if="photoEmotions" class="emotion-box">
                  <img :src="getEmotionImage(photoEmotions)" alt="Emoción de las Fotos" class="emotion-image" />
                  <h4>{{ $t("Emoción de las Fotos") }}</h4>
                  <p>{{ translateE(traducirEmocion(photoEmotions)) }}</p>
                </div>
                <div v-if="combinedEmotions" class="emotion-box">
                  <img :src="getEmotionImage(combinedEmotions)" alt="Emoción Combinado" class="emotion-image" />
                  <h4>{{ $t("Emoción Combinado") }}</h4>
                  <p>{{ translateE(traducirEmocion(combinedEmotions)) }}</p>
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
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import LoadingPage from "../components/LoadingPage.vue";
import axios from 'axios';
import { emotionApi } from '../axiosInstances';
import { useI18n } from "vue-i18n";

const { t } = useI18n(); // Usa t en lugar de $t
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const recording = ref(false);
const paused = ref(true);
const mediaRecorder = ref(null);
const recordedChunks = ref([]);
const photos = ref([]);
const audioEmotions = ref(null);
const photoEmotions = ref(null);
const combinedEmotions = ref(null);
const timeRemaining = ref(60); 
const totalRecordingTime = ref(0);
const audioURL = ref('');
const recordingCompleted = ref(false);
const audioFragments = ref([]);
const fragmentDuration = 2000;  
const fragmentSeconds = [10, 22, 34, 46, 58];
const showSaveButton = ref(false); 
const savedId = ref(null);
const processButtonDisabled = ref(false);
const saveButtonDisabled = ref(false);
const cancelButtonLabel = ref("Cancelar");
const audioURLNube = ref('');
const photoURLsNube = ref([]);
const audioFullBlob = ref(null);
let audioFileName = ``;
let audiofilePath = ``;
let fotofilePath = ``;
let photoInterval = null;
let countdownInterval = null;
let videoStream = null;
let audioStream = null;
let audiofragmentoStream = null;

const traducirEmocion = (emocionIngles) => {
  const emocionesTraduccion = {
    "angry": "Ira",
    "fearful": "Miedo",
    "happy": "Felicidad",
    "sad": "Tristeza",
    "disgusted": "Asco",
    "neutral": "Neutralidad",
    "surprise": "Neutralidad",
    "other": "Neutralidad"
  };
  return emocionesTraduccion[emocionIngles] || emocionIngles;
};

const getEmotionImage = (emotion) => {
  const emotionImages = {
    "angry": require('@/assets/3-Ira.jpg'),
    "fearful": require('@/assets/4-Miedo.jpg'),
    "happy": require('@/assets/2-Felicidad.jpg'),
    "sad": require('@/assets/6-Tristeza.jpg'),
    "disgusted": require('@/assets/1-Asco.jpg'),
    "neutral": require('@/assets/5-Neutralidad.jpg'),
    "surprise": require('@/assets/5-Neutralidad.jpg'),
    "other": require('@/assets/5-Neutralidad.jpg'),
  };
  return emotionImages[emotion];
};

const translate = (pausa) => {
  if (pausa === 'Continuar Grabación') return t("Continuar Grabación");
  if (pausa === 'Pausar Grabación') return t("Pausar Grabación");
  if (pausa === 'Cancelar') return t("Cancelar");
  if (pausa === 'Reiniciar') return t("Reiniciar");
  return pausa; // Default in case the value is different
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

const startRecording = async () => {

  try {
    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audiofragmentoStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const fragmentRecorder = new MediaRecorder(audiofragmentoStream);

    fragmentRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      audioFragments.value.push(event.data);
    }
  };

  const captureAudioFragment = () => {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      fragmentRecorder.start();
      setTimeout(() => {
        fragmentRecorder.stop();  
      }, fragmentDuration);
    }
  };

    const video = document.querySelector('video');
    video.srcObject = videoStream;
    video.play();
    mediaRecorder.value = new MediaRecorder(audioStream);

    mediaRecorder.value.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      clearInterval(countdownInterval);
      const blob = new Blob(recordedChunks.value, { type: 'audio/wav' });
      audioURL.value = URL.createObjectURL(blob);
      audioFullBlob.value = blob;
      ("Grabación completa. Fragmentos de audio:", audioFragments.value);
    };

    mediaRecorder.value.start();
    recording.value = true;
    paused.value = false;

    totalRecordingTime.value = 0; 

    countdownInterval = setInterval(() => {
      totalRecordingTime.value += 1; 
      timeRemaining.value = 60 - totalRecordingTime.value;

      if (totalRecordingTime.value >= 60) {  
        stopRecording(); 
      }

      // Captura audio en los segundos específicos
      if (fragmentSeconds.includes(totalRecordingTime.value)) {
        captureAudioFragment();
      }

      // Toma fotos en los segundos específicos
      if ([12, 24, 36, 48, 60].includes(totalRecordingTime.value)) {
        takePhoto();
      }
    }, 1000);
  } catch (error) {
    console.error('Error al iniciar grabación:', error);
  }
};

const stopRecording = () => {

  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }
  recording.value = false; 
  paused.value = true; 
  timeRemaining.value = 60;
  recordingCompleted.value = true;
  
};

const toggleRecording = () => {
  if (paused.value) {
    continueRecording();
  } else {
    pauseRecording();
  }
};

const pauseRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
    mediaRecorder.value.pause(); 
    clearInterval(countdownInterval); 
    paused.value = true; 
  }
};

const continueRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state === 'paused') {
    mediaRecorder.value.resume(); 
    paused.value = false; 

    countdownInterval = setInterval(() => {
      totalRecordingTime.value += 1; 
      timeRemaining.value = 60 - totalRecordingTime.value; 

      // Toma fotos en los segundos específicos
      if ([12, 24, 36, 48, 60].includes(totalRecordingTime.value)) {
        takePhoto();
      }

      if (totalRecordingTime.value >= 60) {
        stopRecording(); 
      }
    }, 1000);
  }
};

const takePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = document.querySelector('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoName = `photo_${Date.now()}_${photos.value.length + 1}.png`;
    photos.value.push({ name: photoName, data: canvas.toDataURL('image/png') });
};

const processRecording = async () => {
  processButtonDisabled.value = true;
  loading.value = true;

  const accumulatedEmotions = {
    "angry": 0,
    "fearful": 0,
    "happy": 0,
    "sad": 0,
    "neutral": 0,
    "disgusted": 0,
    "other": 0
  };

  const accumulatedEmotions2 = {
    "angry": 0,
    "disgusted": 0,
    "fearful": 0,
    "happy": 0,
    "sad": 0,
    "surprise":0,
    "neutral": 0,
    "other": 0
  };
  
  try {
    // Petición 1: Enviar solo el audio

    // Iterar sobre los fragmentos de audio y hacer una petición por cada uno

    for (let i = 0; i < audioFragments.value.length; i++) {
      const audioBlob = new Blob([audioFragments.value[i]], { type: 'audio/wav' });
      const audioFile = new File([audioBlob], `audio_fragment_${i + 1}.wav`, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioFile);

      // Enviar la solicitud a la API para cada fragmento de audio
      const audioResponse = await emotionApi.post('/predict_audio', formData, {
        headers: {
          'Content-Type': null,
        },
      });

      // Acumular las probabilidades de cada emoción
      if (audioResponse.data && Array.isArray(audioResponse.data.predictions)) {
        audioResponse.data.predictions.forEach(emotion => {
          accumulatedEmotions[emotion.label] += emotion.probability;
        });
      } else {
        console.error('No se recibieron predicciones válidas para el fragmento:', i + 1, audioResponse.data);
      }
    }

    // Seleccionar la emoción con la mayor probabilidad acumulada
    let maxEmotion = Object.keys(accumulatedEmotions).reduce((a, b) => accumulatedEmotions[a] > accumulatedEmotions[b] ? a : b);

    // Petición 2: Enviar solo las fotos

    const IMAGE_PATHS = photos.value.map(photo => {
      return fetch(photo.data)
        .then(res => res.blob())
        .then(blob => {
          return new File([blob], photo.name, { type: 'image/png' });
        });
    });

    const files = await Promise.all(IMAGE_PATHS);

    const photosFormData = new FormData();
    files.forEach(file => {
      photosFormData.append('images', file);
    });
    const photosResponse = await emotionApi.post('/predict_image', photosFormData, {
      headers: {
      'Content-Type': null, 
      },
    });

    let maxPhotoEmotion = {};

    if (photosResponse.data && Array.isArray(photosResponse.data.predictions)) {
      maxPhotoEmotion = photosResponse.data.predictions.reduce((max, emotion) => {
        return emotion.probability > max.probability ? emotion : max;
      });
    } else {
      console.error('No se recibieron predicciones válidas:', photosResponse.data);
    }

    //Petición 3: Enviar el audio y las fotos

    const cbIMAGE_PATHS = photos.value.map(photo => {
      return fetch(photo.data)
        .then(res => res.blob())
        .then(blob => {
          return new File([blob], photo.name, { type: 'image/png' });
        });
    });

    const cbfiles = await Promise.all(cbIMAGE_PATHS);
    
    // Iterar sobre los fragmentos de audio de 2 segundos
    for (let i = 0; i < audioFragments.value.length; i++) {
      const cbformData = new FormData();

      // Agregar las 5 fotos al FormData
      cbfiles.forEach((cbfile) => {
        cbformData.append('images', cbfile); 
      });

      // Usar el audio correspondiente
      const audioBlob = new Blob([audioFragments.value[i]], { type: 'audio/wav' });
      const audioFile = new File([audioBlob], `audio_fragment_${i + 1}.wav`, { type: 'audio/wav' });
      cbformData.append('audio', audioFile); 

      // Hacer la petición a la API
      const combinedResponse = await emotionApi.post('/predict_mult', cbformData, {
        headers: {
          'Content-Type': null,
        },
      });

      // Acumular las probabilidades de cada emoción
      if (combinedResponse.data && Array.isArray(combinedResponse.data.predictions)) {
        combinedResponse.data.predictions.forEach(emotion => {
          if (accumulatedEmotions2[emotion.label] !== undefined) {
            accumulatedEmotions2[emotion.label] += emotion.probability;
          }
        });
      } else {
        console.error('No se recibieron predicciones válidas:', combinedResponse.data);
      }
    }

    // Determinar la emoción con la mayor probabilidad acumulada
    let cbmaxEmotion = Object.keys(accumulatedEmotions2).reduce((a, b) => 
      accumulatedEmotions2[a] > accumulatedEmotions2[b] ? a : b
    );

    audioEmotions.value = maxEmotion;
    photoEmotions.value = maxPhotoEmotion.label;
    combinedEmotions.value = cbmaxEmotion;
  
  } catch (error) {
    console.error('Error en la clasificación de emociones:', error);
  } finally {
    showSaveButton.value = true;
    loading.value = false;
    recordedChunks.value = [];
  }
};

const saveAudioToLocal = async (blob) => {
  audioFileName = `audio_${Date.now()}.wav`;
  audiofilePath = `http://localhost/emociones/${audioFileName}`;

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = audioFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const saveResults = async () => {

  saveButtonDisabled.value = true;
  loading.value = true;
  const saveData = {
    emocion_audio: traducirEmocion(audioEmotions.value),
    emocion_foto: traducirEmocion(photoEmotions.value),
    emocion_audio_foto: traducirEmocion(combinedEmotions.value),
  };

  try {
    const response = await axios.post('/api/clasificacion/check', saveData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const { id } = response.data;

    // Verificar si el ID es null
    if (id === null) {
      // Hacer la petición para crear una nueva clasificación
      const createResponse = await axios.post('/api/clasificacion', {
        emocion_audio: traducirEmocion(audioEmotions.value),
        emocion_foto: traducirEmocion(photoEmotions.value),
        emocion_audio_foto: traducirEmocion(combinedEmotions.value),
      }, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      // Extraer el ID de la respuesta
      savedId.value = createResponse.data.clasificacion.id;
      console.log('Nueva clasificación creada con ID:', savedId.value);
    } else {
      savedId.value = id;
      console.log('ID guardado:', savedId.value);  
    }

    const pacienteResponse = await axios.get(`/api/paciente/${authStore.authUser.name}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const pacienteId = pacienteResponse.data.id;
    console.log('ID del paciente obtenido:', pacienteId);

    // Crear una nueva sesión con los IDs de paciente y clasificación
    const sesionResponse = await axios.post('/api/sesion', {
      paciente_id: pacienteId,
      clasificacion_id: savedId.value,
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const sesionId = sesionResponse.data.sesion.id;
    console.log('ID de la nueva sesión creada:', sesionId);

    await saveAudioToLocal(audioFullBlob.value);

    audioURLNube.value = audiofilePath;
    console.log('url del audio:', audioURLNube.value);

    // Guardar el audio en la base de datos
    const audioResponse = await axios.post('/api/multimedia', {
      nombre: audioFileName,
      tipo: "Audio",
      direccion_url: audioURLNube.value,
      sesion_id: sesionId
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const audioId = audioResponse.data.multimedia.id;

    for (const [index, photo] of photos.value.entries()) {

      // Obtener el blob de la foto
      const photoBlob = await fetch(photo.data).then(res => res.blob());
      // Crear un enlace temporal para descargar la foto
      const link = document.createElement('a');
      // Asignar un nombre único para la foto
      const photoFileName = `photo_${index + 1}_${Date.now()}.png`;
      // Crear un objeto URL para el blob
      link.href = URL.createObjectURL(photoBlob);
      // Establecer el nombre del archivo para la descarga
      link.download = photoFileName;
      // Agregar el enlace al DOM (temporalmente)
      document.body.appendChild(link);
      // Simular un clic en el enlace para iniciar la descarga
      link.click();
      // Limpiar el objeto URL creado
      URL.revokeObjectURL(link.href);
      // Eliminar el enlace del DOM
      document.body.removeChild(link);
      // Puedes almacenar la URL localmente si lo necesitas
      fotofilePath = `http://localhost/emociones/${photoFileName}`;
      console.log(`Url de foto ${index + 1}:`, fotofilePath);
      photoURLsNube.value.push(fotofilePath); 
      
      // Guardar cada foto en la base de datos
      const photoResponse = await axios.post('/api/multimedia', {
        nombre: photoFileName,
        tipo: "Foto",
        direccion_url: photoURLsNube.value[index],
        sesion_id: sesionId
      }, {
      headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      const photoId = photoResponse.data.multimedia.id;
      console.log(`ID de foto ${index + 1} guardado:`, photoId);

    }

    console.log('ID de audio guardado:', audioId);
    console.log('url de las fotos:', photoURLsNube.value);

    cancelButtonLabel.value = "Reiniciar";
    loading.value = false;
    
  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
};

const resetOrCancel = () => {
  if (cancelButtonLabel.value === "Reiniciar") {
    // Restablecer el formulario al estado inicial
    cancel();
    cancelButtonLabel.value = "Cancelar";
  } else {
    cancel();
  }
};

const cancel = () => {
  stopRecording(); 
  recordedChunks.value = []; 
  photos.value = []; 
  audioEmotions.value = null; 
  photoEmotions.value = null; 
  combinedEmotions.value = null; 
  audioURL.value = '';
  photoURLsNube.value = [];
  loading.value = false; 
  recording.value = false; 
  paused.value = true; 
  timeRemaining.value = 60; 
  recordingCompleted.value = false;
  processButtonDisabled.value = false;
  saveButtonDisabled.value = false;
  showSaveButton.value = false;
  audioFragments.value = [];
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
