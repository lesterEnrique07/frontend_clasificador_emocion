<template>
  <LoadingPage :isLoading="loading" />
  <div class="main-content">
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="border border-success">
          <v-card-title class="bg-success text-white">Clasificación de Emociones</v-card-title>
          <v-card-text>
            <v-btn @click="startRecording" :disabled="recording || recordingCompleted" class="bg-blue-grey-darken-4 input" dark block>Iniciar Grabación</v-btn>
            <v-btn @click="toggleRecording" :disabled="!recording" :class="['btn-separado', recording ? (paused ? 'bg-yellow-darken-4' : 'bg-red-darken-4') : 'bg-grey darken-1']" dark block> {{ paused ? 'Continuar Grabación' : 'Pausar Grabación' }} </v-btn>
            <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
            <div v-if="timeRemaining">Tiempo restante: {{ timeRemaining }} segundos</div>
            <div class="photos">
              <img v-for="(photo, index) in photos" :key="index" :src="photo.data" class="photo"/>
            </div>
            <audio v-if="audioURL" :src="audioURL" controls class="audio"></audio>
            <v-btn v-if="photos.length === 5 && !recording" @click="processRecording" class="bg-green-darken-4 input" dark block>Procesar</v-btn>
            <v-btn @click="cancel" class="bg-blue-grey-darken-4 input" dark block>Cancelar</v-btn>
            <div v-if="audioEmotions">
            <h4>Emoción del Audio</h4>
            <p>{{ audioEmotions }}</p>
            </div>
            <div v-if="photoEmotions">
            <h4>Emoción de las Fotos</h4>
            <p>{{ photoEmotions }}</p>
            </div>
            <div v-if="combinedEmotions">
            <h4>Emoción Combinada</h4>
            <p>{{ combinedEmotions }}</p>
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
const timeRemaining = ref(10);
const totalRecordingTime = ref(0);
const audioURL = ref('');
const recordingCompleted = ref(false);
let photoInterval = null;
let countdownInterval = null;

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const video = document.querySelector('video');
    video.srcObject = stream;
    video.play();
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      clearInterval(countdownInterval);
      const blob = new Blob(recordedChunks.value, { type: 'audio/wav' });
      audioURL.value = URL.createObjectURL(blob);
    };

    mediaRecorder.value.start();
    recording.value = true;
    paused.value = false;

    totalRecordingTime.value = 0; 

    countdownInterval = setInterval(() => {
      totalRecordingTime.value += 1; 
      timeRemaining.value = 10 - totalRecordingTime.value; 

      if (totalRecordingTime.value >= 10) {
        stopRecording(); 
      }

      // Toma fotos en los segundos específicos
      if ([2, 4, 6, 8, 10].includes(totalRecordingTime.value)) {
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
  timeRemaining.value = 10;
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
      timeRemaining.value = 10 - totalRecordingTime.value; 

      // Toma fotos en los segundos específicos
      if ([2, 4, 6, 8, 10].includes(totalRecordingTime.value)) {
        takePhoto();
      }

      if (totalRecordingTime.value >= 10) {
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
    const photoName = `photo_${photos.value.length + 1}.png`;
    photos.value.push({ name: photoName, data: canvas.toDataURL('image/png') });
};

const processRecording = async () => {
  loading.value = true;
  const blob = new Blob(recordedChunks.value, { type: 'audio/wav' });
  const formData = new FormData();
  formData.append('audio', blob, 'audio_recording.wav');

  try {
    // Petición 1: Enviar solo el audio
    const audioResponse = await emotionApi.post('/predict_audio', formData, {
      headers: {
        'Content-Type': 'null',
      },
    });
    console.log(audioResponse.data);
    const maxAudioEmotion = audioResponse.data.predictions.reduce((max, emotion) => emotion.probability > max.probability ? emotion : max);

    // Petición 2: Enviar solo las fotos
    const photosFormData = new FormData();
    photos.value.forEach((photo) => {
      photosFormData.append(photo.name, photo.data);
    });

    const photosResponse = await emotionApi.post('/predict_image', photosFormData);
    console.log(photosResponse.data);
    const maxPhotoEmotion = photosResponse.data.predictions.reduce((max, emotion) => emotion.probability > max.probability ? emotion : max);

    photos.value.forEach((photo) => {
    formData.append(photo.name, photo.data);
  });

    // Petición 3: Enviar el audio y las fotos
    const combinedResponse = await emotionApi.post('/predict_mult', formData);
    console.log(combinedResponse);
    const maxCombinedEmotion = combinedResponse.data.predictions.reduce((max, emotion) => emotion.probability > max.probability ? emotion : max);

    audioEmotions.value = maxAudioEmotion.label;
    photoEmotions.value = maxPhotoEmotion.label;
    combinedEmotions.value = maxCombinedEmotion.label;

    console.log('Audio emociones:', audioEmotions.value);
    console.log('Fotos emociones:', photoEmotions.value);
    console.log('Combinado emociones:', combinedEmotions.value);
  } catch (error) {
    console.error('Error en la clasificación de emociones:', error);
  } finally {
    loading.value = false;
    recordedChunks.value = [];
    photos.value = [];
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
  loading.value = false; 
  recording.value = false; 
  paused.value = true; 
  timeRemaining.value = 10; 
  recordingCompleted.value = false;
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

</style>
