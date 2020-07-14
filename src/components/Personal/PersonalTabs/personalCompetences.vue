<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <q-table
      dense
      class="personalGrid-header-table"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="name"
      :data="data"
      :columns="columns"
      table-style="max-height: 65vh; max-width: 96vw"
    >
    <template v-slot:bottom>
        <div>
          {{ data.length }} Filas
        </div>
      </template>
    </q-table>
    
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { urlFotos } from 'boot/axios.js'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      expanded: false,
      regper: {},
      urlF: urlFotos,
      rowId: '',
      columns: [
        {
          name: 'codCompetencia',
          required: true,
          label: 'Cod.',
          align: 'left',
          field: row => row.idpk.codCompetencia,
          sortable: true,
          style: 'width: 20px; whiteSpace: normal'
        },
        { name: 'descripcion', align: 'left', label: 'Descripcion', field: row => row.datosCompetencia.descripcion, sortable: true, style: 'min-width: 200px; whiteSpace: normal' },
        { name: 'tipoCompetencia', align: 'left', label: 'Tipo', field: row => row.datosCompetencia.tipoCompetencia, sortable: true },
        { name: 'fechaAdquisicion', align: 'left', label: 'Fecha Adq.', field: 'fechaAdquisicion', format: val => date.formatDate(date.extractDate(val,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY') },
        { name: 'fechaCompromiso', align: 'left', label: 'Fecha Compromiso', field: 'fechaCompromiso' },
        { name: 'comentarios', align: 'left', label: 'Comentarios', field: 'comentarios' }
       ],
      data: []     
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user']),
   
  },
  methods: {
    ...mapActions('empleados', ['loadCompetencias']),
    getCompetencias(){
      this.loadCompetencias()
          .then(response => {
            console.log(response)
            this.data = response.data
          })
          .catch(error => {
            this.$q.dialog({ title: 'Error', message: error.response.statusText })
            this.desconectarLogin()
          })
    } 
  },
  mounted(){
    this.getCompetencias()
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