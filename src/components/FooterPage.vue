<template>
  <div class="principal">
    <v-container>
      <v-row column="3">
        <v-col md="6" sm="12">
          <div class="contact-info">
            <h4>{{ $t("Contactos:") }}</h4>
            <p>{{ contactInfo.cellPhone }}</p>
            <p>{{ contactInfo.personalEmail }}</p>
            <p>{{ contactInfo.homePhone }}</p>
            <p>{{ contactInfo.institutionalEmail }}</p>
          </div>
        </v-col>

        <v-col md="6" sm="12">
          <div class="contact-info">
            <h4>{{ $t("Equipo de desarrollo") }}</h4>
            <ul style="list-style-type: none;">
              <li v-for="(member, index) in team" :key="index">
                <p>{{ member }}</p>
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-col>
          <p class="text-center">© {{ currentYear }} {{ $t("Clasificador de Emociones. Todos los derechos reservados.") }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'FooterPage',
  computed: {
    // Propiedad computada para traducir los datos de contacto
    contactInfo() {
      return {
        cellPhone: this.$t("Teléfono celular:"),
        personalEmail: this.$t("Email personal:"),
        homePhone: this.$t("Teléfono casa:"),
        institutionalEmail: this.$t("Email institucional:")
      };
    },
    // Año actual para el pie de página
    currentYear() {
      return new Date().getFullYear();
    },
    // Propiedad computada para el equipo de desarrollo (esto es opcional, pero sigue la misma lógica)
    team() {
      return [
        this.$t("Lester Enrique Pérez Carballedo")
      ];
    }
  }
};
</script>

<style scoped>
.contact-info {
  margin-bottom: 20px;
  color: #302f2f;
}

.principal {
  background-color: rgb(211, 211, 211);
  width: 100%;
  padding: 2rem 0;
}

p.text-center {
  color: #302f2f;
}
</style>

  