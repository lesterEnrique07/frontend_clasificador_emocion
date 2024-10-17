<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="display-2 text-center">About Us</h1>
                <v-card>
                    <v-card-text>¡Bienvenido a nuestro proyecto de clasificación de emociones! Este innovador sistema
                        fue desarrollado por un apasionado estudiante de la Universidad Central "Marta Abreu" de
                        Las Villas (UCLV) como parte de su tarea final de culminación de estudios. Con dedicación
                        y entusiasmo, creo una solución integral para satisfacer las necesidades de detectar las emociones de 
                        personas a través del rostro y la voz en cualquier contexto.</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h2 class="headline text-center mt-5">Equipo de Trabajo</h2>
                <v-divider class="mx-auto" width="50%"></v-divider>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="member in teamMembers" :key="member.name" cols="12">
                <v-card>
                    <v-card-title class="headline">{{ member.name }}</v-card-title>
                    <v-card-subtitle>{{ member.role }}</v-card-subtitle>
                    <v-card-text>{{ member.description }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2 class="headline text-center mt-5">Nuestra Historia</h2>
                <v-divider class="mx-auto" width="50%"></v-divider>
                <v-card>
                    <v-card-text>
                        Este proyecto nació como parte de nuestra formación académica en la UCLV. Guiados por la pasión por
                        la programación web y la resolución de problemas, nos propusimos crear una herramienta que
                        simplificara la detección de emociones. A lo largo del proceso, enfrentamos desafíos,
                        aprendimos lecciones valiosas y, finalmente, entregamos una solución que esperamos que sea útil para
                        empresas de diferentes ámbitos.
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2 class="headline text-center mt-5">Nuestra Misión</h2>
                <v-divider class="mx-auto" width="50%"></v-divider>
                <v-card>
                    <v-card-text>
                        En el corazón de nuestro proyecto está el deseo de facilitar el proceso de detección de emociones. 
                        Creemos en la importancia del aprendizaje continuo y estamos
                        comprometidos a contribuir al crecimiento y desarrollo de las empresas a través de nuestra
                        aplicación.
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            teamMembers: [
                {
                    name: 'Lester Enrique Perez Carballedo',
                    role: 'Desarrollador Web',
                    description: 'Lester no solo ideó el concepto sino que también construyó cada componente con meticuloso detalle. Desde el diseño hasta la implementación de toda la lógica, su dedicación y habilidad transformaron una idea innovadora en una poderosa herramienta para la clasificación de emociones.',
                },
            ],
        };
    },
};
</script>
  
<style scoped></style>
  