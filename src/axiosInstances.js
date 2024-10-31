import axios from 'axios';

// Instancia para la API de gestión de Base de Datos 
const bdApi = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Instancia para la API de Clasificación de Emociones
const emotionApi = axios.create({
  baseURL: 'http://localhost:5000', // Cambia esto a la URL de tu API de emociones
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Instancia para la API de Clasificación de Emociones
const nubeApi = axios.create({
  baseURL: 'http://nube.emociones.cu/remote.php/dav/files/admin/', // Cambia esto a la URL de tu API de nube
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Exportar ambas instancias
export { bdApi, emotionApi, nubeApi };