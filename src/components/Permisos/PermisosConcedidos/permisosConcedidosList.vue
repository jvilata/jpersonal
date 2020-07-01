<template>
  <q-item class="row q-ma-xs q-pa-xs">

    <q-list bordered separator class="rounded-borders col">
      <q-separator/>
        <q-item-label header dense class="bg-indigo-1 text-center text-grey-8"><b>Permisos concedidos</b></q-item-label>
          <permisoConcedido v-for="(permiso, key) in value"
            :key="key"
            :permiso="permiso"
            :id="key"> Permiso
          </permisoConcedido>
    </q-list>
    

    <!-- <q-banner class="bg-white text-grey-8 col text-center">
      No hay permisos concedidos.
    </q-banner> -->
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
    }
  },
  components: {
    permisoConcedido: require('components/Permisos/PermisosConcedidos/permisoConcedido.vue').default
  }
}

</script>
<style lang="sass">
  .personalGrid-header-table
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
      /* bg color is important for th; just specify one */
      background-color: $indigo-1

    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0

    /* this is when the loading indicator appears */
    &.q-table--loading thead tr:last-child th
      /* height of all previous header rows */
      top: 48px
</style>