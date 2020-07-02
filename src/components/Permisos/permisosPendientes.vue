<template>
  <div style="height: 75vh">
      <!-- <permisosPendientesGrid
          v-model="permisosPendientes"
          /> -->

      <q-separator spaced/>

      <div class="text-center q-ma-sm no-pointer-events row justify-center">
        <q-btn 
          rounded
          dense
          size="md"
          color="primary"
          label="Solicitar nuevo permiso"
          icon="add"
          @click="nuevoPermiso = !nuevoPermiso"
          class="col-8 all-pointer-events"/>
      </div>

      <!-- <q-separator spaced/> -->

      <permisosPendientesList
      v-model="permisosPendientes"
      class="q-mb-lg"
      />


    <q-dialog v-model="nuevoPermiso"  >
        <!-- formulario con campos de filtro -->
        <permisosAdd
          @close="nuevoPermiso = !nuevoPermiso"
        />
      </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      nuevoPermiso: false,
    }
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes'])
  },
  components: {
    // permisosPendientesGrid: require('components/Permisos/permisosPendientesGrid.vue').default,
    permisosAdd: require('components/Permisos/permisosAdd.vue').default,
    permisosPendientesList: require('components/Permisos/PermisosPendientes/permisosPendientesList.vue').default
  }
}
</script>