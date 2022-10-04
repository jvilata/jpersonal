<template>
  <q-item class="row center" >
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      class="col dashboardGridPlanif-header-table"
      dense
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="tipo"
      :data="registrosSeleccionados"
      :columns="columns"
      table-style="max-height: 65vh; max-width: 93vw"
      hide-bottom
    >

      <template v-slot:header="props">
        <!-- CABECERA DE LA TABLA -->
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.tipo}`" @mouseover="rowId=`m_${props.row.tipo}`">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div :style="col.style">
              {{ col.value }}
            </div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['value', 'ltab'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      rowId: '',
      registrosSeleccionados: [],
      registrosPanelDatos: [],
      columns: [
        { name: 'tipo', required: true, label: 'tipo', align: 'right', field: 'tipo' },
        { name: 'numclientes', required: true, label: 'NºClientes', align: 'right', field: 'numClientes', format: val => this.$numeral(parseFloat(val)).format('0,0') },
        { name: 'nummensajes', required: true, label: 'NºMensajes', align: 'right', field: 'numMensajes', format: val => this.$numeral(parseFloat(val)).format('0,0') },
        { name: 'mensajesalmacenados', required: true, label: 'Almacenados', align: 'right', field: 'numMensajesAlmacenados', format: val => this.$numeral(parseFloat(val)).format('0,0') }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    getTiposClientes (objFilter) {
      // grid por tipos de activos inversion
      this.$q.loading.show()
      this.$axios.get(`bd_jpersonal.asp?action=dash/servicios/estadisticas&auth=${this.user.auth}`, { params: objFilter })
        .then(response => {
          this.registrosSeleccionados = []
          this.registrosSeleccionados.push(...response.data) // para que refresque lo antes posible
          this.$q.loading.hide()
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    },
    mostrarDatosPieTabla () {
      return this.registrosSeleccionados.length + ' Filas'
    }
  },
  mounted () {
    // cuando cambia de tab se dispara 2 veces con ltab el primer tab de la lista...
    if (this.ltab === 'gridClientes') this.getTiposClientes(this.value) // carga grid de activos Inversion
  }
}
</script>
<style lang="sass">
  .dashboardGridPlanif-header-table
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

    td:first-child
      background-color: $orange-1
    th:first-child
      position: sticky
      left: 0
      z-index: 3
    td:first-child
      position: sticky
      left: 0
      z-index: 0

    /* this is when the loading indicator appears */
    &.q-table--loading thead tr:last-child th
      /* height of all previous header rows */
      top: 48px
</style>
