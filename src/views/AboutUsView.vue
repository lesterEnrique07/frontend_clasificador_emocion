<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="display-2 text-center">{{ $t("Sobre nosotros") }}</h1>
                <v-card>
                    <v-card-text>{{ $t("Bienvenido a nuestro proyecto") }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h2 class="headline text-center mt-5">{{ $t("Equipo de Trabajo") }}</h2>
                <v-divider class="mx-auto" width="50%"></v-divider>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title class="headline">Lester Enrique Pérez Carballedo</v-card-title>
                    <v-card-subtitle>{{ $t("Desarrollador Web") }}</v-card-subtitle>
                    <v-card-text>{{ $t("Lester no solo") }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2 class="headline text-center mt-5">{{ $t("Nuestra Historia") }}</h2>
                <v-divider class="mx-auto" width="50%"></v-divider>
                <v-card>
                    <v-card-text>
                        {{ $t("Este proyecto nació") }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2 class="headline text-center mt-5">{{ $t("Nuestra Misión") }}</h2>
                <v-divider class="mx-auto" width="50%"></v-divider>
                <v-card>
                    <v-card-text>
                        {{ $t("En el corazón") }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>

</script>
  
<style scoped></style>
  