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
                  <h2>{{ $t("Hola") }} &#x1F44B;</h2>
                  <p class="abstract">{{ $t("Bienvenido") }}</p>
                  <v-btn @click="scrollToElement">
                    {{ $t("Ver Más") }}
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
                  <h2>{{ $t("Clasificación") }}</h2>
                  <p class="abstract">{{ $t("Explora") }}</p>
                  <v-btn to="/clasificacion">
                    {{ $t("Ver Más") }}
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
                  <h2>{{ $t("Registros") }}</h2> 	
                  <p class="abstract">{{ $t("Sumérgete") }}</p>
                  <v-btn to="/registros">{{ $t("Ver Más") }}</v-btn>
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
                  <h2>{{ $t("Estadísticas") }}</h2>
                  <p class="abstract">{{ $t("Revisa") }}</p>
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
