<template>
  <div style="height: 75vh">
      <!-- <permisosConcedidosGrid
        v-model="permisosConcedidos"
      /> -->
      <permisosConcedidosList
        v-model="permisosConcedidos"
      />
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
    ...mapState('permisos', ['permisosConcedidos'])
  },
  components: {
    // permisosConcedidosGrid: require('components/Permisos/permisosConcedidosGrid.vue').default,
    permisosConcedidosList: require('components/Permisos/PermisosConcedidos/permisosConcedidosList.vue').default
  },
  mounted() {
    this.getPermisosConcedidos()
  }
}
</script>