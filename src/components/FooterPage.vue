<template>
  <div class="principal">
    <v-container>
      <v-row column="3">
        <v-col md="6" sm="12">
          <div class="contact-info">
            <h4>Contactos:</h4>
            <p>Teléfono celular: +5356100659</p>
            <p>Email personal: lesterenriquep7@gmail.com</p>
            <p>Teléfono casa: 42282458</p>
            <p>Email institucional: lpcarballedo@uclv.cu</p>
          </div>
        </v-col>

        <v-col md="6" sm="12">
          <div class="contact-info">
            <h4>Equipo de desarrollo</h4>
            <ul style="list-style-type: none;">
              <li><p>Lester Enrique Pérez Carballedo</p></li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-col>
          <p class="text-center">© <span id="year">2024</span> Clasificador de Emociones. Todos los derechos
            reservados.</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'FooterPage',
  methods: {
    setYear() {
      let fecha = new Date();
      document.querySelector('#year').innerHTML = fecha.getFullYear();
    }
  },
  mounted() {
    this.setYear();
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

}

p.text-center {
  color: #302f2f;
  /* Texto blanco */
}
</style>

  