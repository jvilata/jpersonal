<template>
  <div style="height: calc(100vh - 263px)">
      <permisosConcedidosList
        v-model="permisosConcedidos"
        @refresh="$emit('refresh')"
      />

      <div class="row q-mb-lg">
        <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Dias Baja" :value="value.empleadoP.diasConcedidos.tdiasBaja"/>
        <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Dias Especiales" :value="value.empleadoP.diasConcedidos.tdiasEspeciales"/>
        <q-input class="col-4 q-pa-sm" dense readonly outlined stack-label type="number" label="Días Vacaciones" :value="value.empleadoP.diasConcedidos.tdiasVacaciones"/>
      </div>
  </div>

</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
    }
  },
  methods: {
    ...mapActions('permisos', ['getPermisosConcedidos'])
  },
  computed: {
    ...mapState('permisos', ['permisosConcedidos']),
    ...mapState('login', ['user', 'screen'])
  },
  components: {
    // permisosConcedidosGrid: require('components/Permisos/permisosConcedidosGrid.vue').default,
    permisosConcedidosList: require('components/Permisos/PermisosConcedidos/permisosConcedidosList.vue').default
  }
}
</script>

<style lang="scss">
  
  .fullScreen {
    height: calc(100vh - 188px);
  }

  .sqScreen {
    height: calc(100vh - 128px);
}

</style>