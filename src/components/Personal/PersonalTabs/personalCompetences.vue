<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      dense
      class="personalGrid-header-table"
      virtual-scroll
      :virtual-scroll-sticky-size-start="48"
      row-key="name"
      :data="data"
      :columns="columns"
      table-style="max-height: 60vh; max-width: 96vw"
    >

    </q-table>
    
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { urlFotos } from 'boot/axios.js'

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
          label: 'Cod Comp.',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'descripcion', align: 'center', label: 'Descripcion', field: 'descripcion', sortable: true },
        { name: 'tipoCompetencia', label: 'Tipo', field: 'tipoCompetencia', sortable: true },
        { name: 'fechaAdquisicion', label: 'Fecha Adq.', field: 'fechaAdquisicion' },
        { name: 'fechaCompromiso', label: 'Fecha Compromiso', field: 'fechaCompromiso' },
        { name: 'comentarios', label: 'Comentarios', field: 'comentarios' }
       ],
      data: [
        {
          codCompetencia: 17,
          descripcion: 'Francés',
          tipoCompetencia: 'Idioma',
          fechaAdquisicion: '19/3/2015',
          fechaCompromiso: '',
          comentarios: ''
        }
        // {
        //   name: '58',
        //   descripcion: 'C2 Americano',
        //   tipoCompetencia: 'Idioma',
        //   fechaAdquisicion: '28/6/2019',
        //   fechaCompromiso: '',
        //   comentarios: ''
        // },
        // {
        //   name: '393',
        //   descripcion: 'Seguridad de la Info',
        //   tipoCompetencia: 'Curso',
        //   fechaAdquisicion: '19/3/2015',
        //   fechaCompromiso: '',
        //   comentarios: 'Aprobado curso Seg.INFO'
        // },
        // {
        //   name: '410',
        //   descripcion: 'Doble grado en Informática y ADE',
        //   tipoCompetencia: 'Estudios',
        //   fechaAdquisicion: '17/04/2020',
        //   fechaCompromiso: '',
        //   comentarios: 'Finalizando 3º Carrera'
        // }
      ]
     
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