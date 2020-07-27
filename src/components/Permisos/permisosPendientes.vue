<template>
  <div :class="screen">
  <!-- <div style="height: calc(100vh - 268px)"> -->
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

        <permisosPendientesList
          v-model="permisosPendientes"
          @refresh="$emit('refresh')">
        </permisosPendientesList>

        <div class="row q-mb-xl">
          <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Dias Libres" :value="value.empleadoP.diasPendientes.tdiaslibres"/>
          <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Dias Vacaciones" :value="value.empleadoP.diasPendientes.tdiasvacaciones"/>
          <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Días Pendientes" :value="value.empleadoP.diasPendientes.tdiaspendientes"/>

        </div>

    <q-dialog v-model="nuevoPermiso"  >
      <permisosAdd
        @close="nuevoPermiso = !nuevoPermiso"
        @refresh="$emit('refresh')"
        @ok="showDone"
        :value="value"
        :empleadoP="value.empleadoP"
      />
    </q-dialog>

    <q-dialog v-model="done">
      <q-icon name="check_circle_outline" color="green" size="100px"/>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      nuevoPermiso: false,
      done: false,
    }
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes']),
    ...mapState('login', ['screen'])
  },
  methods: {
    showDone() {
      this.done = true
      this.timer = setTimeout(() => {
        this.done = false
      }, 800)
    }
  },
  components: {
    permisosAdd: require('components/Permisos/permisosAdd.vue').default,
    permisosPendientesList: require('components/Permisos/PermisosPendientes/permisosPendientesList.vue').default
  }
}
</script>

<style lang="scss">
  
  .fullScreen {
    max-height: calc(100vh - 184px); 
  }

  .sqScreen {
    max-height: calc(100vh - 128px); 
  }

  .android {
    max-height: calc(100vh - 107px);
  }
  

</style>