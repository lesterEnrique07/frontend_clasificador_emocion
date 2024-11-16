<template>
    <div>
        <!-- nav-bar -->
        <v-app-bar app>
      <div v-if="authStore.user" class="menu-icon">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
      <div v-if="authStore.user" class="nav-bar-items">
        <v-btn to="/">{{ $t("Home") }}</v-btn>
        <v-btn to="/clasificacion">{{ $t("Clasificación") }}</v-btn>
        <v-btn to="/registros">{{ $t("Registros") }}</v-btn>
        <v-btn to="/estadisticas">{{ $t("Estadísiticas") }}</v-btn>
        <v-btn to="/perfil">{{ $t("Perfil") }}</v-btn>
        <v-btn to="/about">{{ $t("Sobre nosotros") }}</v-btn>
      </div>
      <v-toolbar-title class="title">{{ $t("Clasificador de Emociones") }}</v-toolbar-title>
      <div @click="toggleLanguageMenu" class="flag-button">
        <img :src="currentFlag" alt="Current language flag" class="flag-icon" />
      </div>
      <div v-if="showLanguageMenu" class="language-menu">
        <img :src="require('@/assets/flag-spain.png')" @click="setLanguage('es')" alt="Spanish flag" class="flag-icon" />
        <img :src="require('@/assets/flag-uk.png')" @click="setLanguage('en')" alt="UK flag" class="flag-icon" />
      </div>
      <v-btn class="bg-green-darken-4" v-if="authStore.user" @click="authStore.logout" prepend-icon="mdi-logout">
        <span class="logout">{{ $t("CERRAR SESIÓN") }}</span>
      </v-btn>
    </v-app-bar>

    <!--Menu lateral-->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item title="SGC"></v-list-item>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
        <v-list-item to="/clasificacion" title="Clasificación" value="clasificacion"></v-list-item>
        <v-list-item to="/registros" title="Registros" value="registros"></v-list-item>
        <v-list-item to="/estadisticas" title="Estadísticas" value="edition"></v-list-item>
        <v-list-item to="/perfil" title="Perfil" value="perfil"></v-list-item>
        <v-list-item to="/about" prepend-icon="mdi-information-variant" title="About Us" value="about"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const authStore = useAuthStore();
const drawer = ref(false);
const showLanguageMenu = ref(false);
const currentFlag = ref(require('@/assets/flag-spain.png')); // bandera predeterminada en español

const { locale } = useI18n();

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
};

const setLanguage = (lang) => {
  locale.value = lang;
  currentFlag.value = lang === 'es' ? require('@/assets/flag-spain.png') : require('@/assets/flag-uk.png');
  showLanguageMenu.value = false;
};
</script>

<style>
.title {
  margin: 0 6rem !important;
}

.menu-icon {
  pointer-events: none;
  visibility: hidden;
}

.flag-button {
  cursor: pointer;
}

.flag-icon {
  width: 35px; /* Adjust the size here */
  height: 24px;
  display: inline-block;
  border-radius: 10%; /* Optional: makes the flag appear circular */
  object-fit: cover;
  margin-right: 8px; /* Space between icons if needed */
}

@media (max-width: 860px) {
  .logout {
    display: none;
  }
  .nav-bar-items {
    display: none;
  }

  .v-spacer {
    display: none;
  }

  .menu-icon {
    pointer-events: auto;
    visibility: visible;
  }

  .title {
    margin: 0 1rem !important;
  }
}
</style>
