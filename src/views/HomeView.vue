<template>
  <v-app>
    <!-- Principal Container -->
    <v-container class="container" fluid>
      <v-row>
        <v-col cols="12">
          <!-- Contenido de la hero section -->
          <v-row class="hero-section section" align="center" justify="center">
            <v-col class="d-flex text-center justify-center" cols="6">
            </v-col>
            <v-col cols="6">
              <v-card class="card-text">
                <v-card-text>
                  <h2>Hola &#x1F44B;</h2>
                  <p class="abstract">Bienvenido a nuestro innovador sistema de clasificación de emociones a través del rostro y la voz. 
                    Aquí, descubrirás potentes herramientas diseñadas para analizar y comprender las emociones humanas con precisión y eficiencia.
                    ¡Prepárate para transformar la manera en que entiendes y gestionas las emociones!</p>
                  <v-btn @click="scrollToElement">
                    Ver Más
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Sección de clasificacion -->
    <v-container id="clasificacion" class="container" fluid>
      <v-row>
        <v-col cols="12">
          <v-row class="clasificacion-section section" align="center" justify="center">
            <v-col cols="6">
            </v-col>
            <v-col cols="6">
              <v-card class="card-text">
                <v-card-text>
                  <h2>Clasificación</h2>
                  <p class="abstract">Explora nuestra avanzada sección para grabar audios y tomar fotos, diseñada para la clasificación precisa de emociones. 
                    Aquí, los usuarios pueden capturar tanto su voz como expresiones faciales, proporcionando datos ricos que permiten a nuestro sistema analizar y 
                    determinar sus emociones con alta precisión.</p>
                  <v-btn to="/clasificacion">
                    Ver más
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Sección de registros -->
    <v-container class="container" fluid>
      <v-row>
        <v-col cols="12">
          <v-row class="registros-section section" align="center" justify="center">
            <v-col cols="6">
            </v-col>
            <v-col cols="6">
              <v-card class="card-text">
                <v-card-text>
                  <h2>Registros</h2> 	
                  <p class="abstract">Sumérgete en esta detallada sección, donde encontrarás audios y fotos ya clasificados listos para ser revisados. 
                    Aquí, los usuarios pueden acceder a sus grabaciones de voz y capturas faciales, permitiendo una revisión minuciosa de las emociones 
                    previamente analizadas.</p>
                  <v-btn to="/registros">Ver más</v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Sección de ediciones -->
    <v-container class="container" fluid>
      <v-row>
        <v-col cols="12">
          <v-row class="estadisticas-section section" align="center" justify="center">
            <v-col cols="6">
            </v-col>
            <v-col cols="6">
              <v-card class="card-text">
                <v-card-text>
                  <h2>Estadísticas</h2>
                  <p class="abstract">Revisa esta sección donde los datos recopilados de tus registros se transforman 
                    en información valiosa. Aquí, los usuarios pueden acceder a detallados datos estadísticos sobre sus emociones, generados a partir 
                    de las grabaciones de voz y capturas faciales clasificadas.</p>
                  <v-btn to="/estadisticas">Ver más</v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

  </v-app>
</template>

<script>

export default {
  name: 'HomeView',
  methods: {
    scrollToElement() {
      // Utiliza JavaScript para desplazarse hasta al elemento
      const element = document.getElementById('clasificacion');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
}
</script>

<style scoped>
/**
   */
.container {
  padding: 0.9rem 0rem !important;
  background-color: rgb(211, 211, 211);
}

.hero-section {
  background-image: url('../assets/emociones_home.jpg');
}

.clasificacion-section {
  background-image: url('../assets/emociones_home_clasif.jpg');
}

.registros-section {
  background-image: url('../assets/emocion_home_reg.jpg');
}

.estadisticas-section {
  background-image: url('../assets/emocion_home_est.jpg');
}

.section {
  background-size: cover;
  background-position: center;
  height: 100vh;
  background-color: #e0e0e0;
}

.card-text {
  margin-right: 1rem !important;
}

.card-text:hover {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
}

.abstract {
  margin: 0.4rem 0rem;
}

@media(max-width:860px) {
  .section {
    background-size: 200%;
    height: 60vh;
  }

}
</style>
