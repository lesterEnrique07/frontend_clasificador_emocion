<template>
  <v-container class="mt-5">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="border border-success">
          <v-card-title class="bg-success text-white">{{ $t("INICIAR SESIÓN") }}</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field 
                v-model="form.email" 
                :label="$t('Correo electrónico')" 
                outlined 
                prepend-icon="mdi-at"
                autofocus 
                class="input" 
                required
              ></v-text-field>
              
              <v-text-field 
                v-model="form.password" 
                :label="$t('Contraseña')" 
                outlined 
                prepend-icon="mdi-key"
                type="password" 
                class="input" 
                required
              ></v-text-field>
              
              <v-btn 
                type="submit" 
                class="bg-blue-grey-darken-4 input" 
                dark 
                block
              >{{ $t("Iniciar sesión") }}</v-btn>
              
              <v-btn 
                to="/register" 
                class="bg-blue-grey-darken-4 input" 
                dark 
                block
              >{{ $t("Registrarse") }}</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import useLoginViewModel from '@/views/LoginViewModel';

const { form, login } = useLoginViewModel();
</script>

<style scoped>
.input {
  margin-top: 1rem;
}
</style>