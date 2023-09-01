<template>
  <div :style="screen=='sqScreen' ? 'height: calc(100vh - 227px)' : screen=='fullScreen' ? 'height: calc(100vh - 283px)' : 'height: calc(100vh - 207px)'">
    <q-item class="row q-ma-xs q-pa-xs">
      <q-table
        dense
        class="personalGrid-header-table"
        virtual-scroll
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      expanded: false,
      regper: {},
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
        { name: 'fechaAdquisicion', align: 'left', label: 'F.Adquisición', field: 'fechaAdquisicion', format: val => ((val !== null) ? date.formatDate(date.extractDate(val,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY'): '') },
        { name: 'fechaCompromiso', align: 'left', label: 'F.Compromiso', field: 'fechaCompromiso', format: val => ((val !== null) ? date.formatDate(date.extractDate(val,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY'): '') },
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
            this.timer = setTimeout(() => {
              this.$q.loading.hide()
              this.timer = void 0
            }, 250) 
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
  },
  beforeMount(){
    this.$q.loading.show() 
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