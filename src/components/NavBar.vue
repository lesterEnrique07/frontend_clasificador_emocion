<template>
    <div>
        <!-- nav-bar -->
        <v-app-bar app>
            <div v-if="authStore.user" class="menu-icon">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </div>
            <div v-if="authStore.user" class="nav-bar-items">
                <v-btn to="/">Home</v-btn>
                <v-btn to="/clasificacion">Clasificación</v-btn>
                <v-btn to="/registros">Registros</v-btn>
                <v-btn to="/estadisticas">Estadísiticas</v-btn>
                <v-btn to="/perfil">Perfil</v-btn>
                <v-btn to="/about">About Us</v-btn>
            </div>
            <v-toolbar-title class="title">Clasificador de Emociones</v-toolbar-title>
            <v-btn class="bg-green-darken-4" v-if="authStore.user" @click="authStore.logout"
                prepend-icon="mdi-logout"><span class="logout">LOGOUT</span></v-btn>
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
import { ref } from 'vue';

const authStore = useAuthStore();
const drawer = ref(null);
</script>  
<style>
.title {
    margin: 0 6rem !important;
}

.menu-icon {
    pointer-events: none;
    visibility: hidden;
}

@media (max-width: 860px) {
    .logout{
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
