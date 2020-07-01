<template>
  <div style="height: 75vh">
      <permisosPendientesGrid
          v-model="permisosPendientes"
          />

      <div class="row justify-center q-ma-xs">
        <q-btn 
          round
          size="lg"
          color="primary"
          icon="add"
          @click="nuevoPermiso = !nuevoPermiso"/>
      </div>

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
    permisosPendientesGrid: require('components/Permisos/permisosPendientesGrid.vue').default,
    permisosAdd: require('components/Permisos/permisosAdd.vue').default
  }
}
</script>