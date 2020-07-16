<template>
  <div style="height: 75vh">
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
          class="q-mb-md"
          @refresh="getPermisos">
        </permisosPendientesList>

        <q-separator spaced/>

        <div class="row q-mb-xl">
          <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Dias Libres" :value="value.empleadoP.diasPendientes.tdiaslibres"/>
          <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Dias Vacaciones" :value="value.empleadoP.diasPendientes.tdiasvacaciones"/>
          <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Días Pendientes" :value="value.empleadoP.diasPendientes.tdiaspendientes"/>

        </div>

    <q-dialog v-model="nuevoPermiso"  >
      <permisosAdd
        @close="nuevoPermiso = !nuevoPermiso"
        @nuevo="getPermisos"
        @ok="done = true"
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
      done: false
    }
  },
  methods: {
    ...mapActions('permisos', ['getPermisosPendientes']),
    getPermisos() {
      this.getPermisosPendientes({ solIdEmpleado: this.value.filterRecord.empleado, solejercicio: this.value.filterRecord.ejercicioAplicacion })
    }
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes'])
  },
  components: {
    permisosAdd: require('components/Permisos/permisosAdd.vue').default,
    permisosPendientesList: require('components/Permisos/PermisosPendientes/permisosPendientesList.vue').default
  },
  mounted() {
    this.getPermisosPendientes({ solIdEmpleado: this.value.filterRecord.empleado, solejercicio: this.value.filterRecord.ejercicioAplicacion })
  }
}
</script>