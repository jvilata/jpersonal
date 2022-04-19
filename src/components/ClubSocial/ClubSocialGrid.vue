<template>
  <div>
    <q-item class="row q-ma-xs q-pa-xs">
      <q-checkbox class="col-2" v-model="filterR.ordenar" @input="ordenarFichajes" label="Ordenar" />
      <q-checkbox class="col-2" v-model="filterR.incumplem3" @input="filtrarFichajes" label="Incumple>3" />
      <q-checkbox class="col-2" v-model="filterR.desfasem60" @input="filtrarFichajes" label="Desfase>60m" />
      <q-input class="col-3" clearable label="Nombre" v-model="filterR.nombre" @input="filtrarFichajes" />
    </q-item>
  <q-item class="row q-ma-xs q-pa-xs">
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      class="personalGrid-header-table"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :data="listaFichajesFilter"
      :columns="columns"
      table-style="max-height: 60vh; max-width: 96vw"
    >

      <template v-slot:header="props">
        <!-- CABECERA DE LA TABLA -->
        <q-tr :props="props">
          <q-th >
            <div style="max-width: 20px"></div>
          </q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
          <div :style="col.style">
            {{ col.label }}
          </div>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.id}`" @mouseover="rowId=`m_${props.row.id}`">
          <q-td>
            <!-- columna de acciones: editar, borrar, etc -->
            <div style="max-width: 20px">
            <!--edit icon . Decomentamos si necesitamos accion especifica de edicion -->
            <q-btn flat v-if="rowId===`m_${props.row.id}`"
              @click.stop="editRecord(props.row, props.row.id)"
              round
              dense
              size="sm"
              color="primary"
              icon="list">
              <q-tooltip>Detalle</q-tooltip>
            </q-btn>
            </div>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div :style="col.style">
              <div v-if="!['foto'].includes(col.name)">{{ col.value }}</div>
              <q-img @click="ampliarImagen(props.row)" v-if="col.name==='foto'" :src="`${urlF}${props.row.idpersonal}.jpg`"/>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        <div>
          {{ value.length }} Filas
        </div>
      </template>

    </q-table>
    <q-dialog  v-model="mostrarDetalle"  >
      <q-card  class="q-pr-xs q-gutter-xs">
        <q-card-section class="row items-center q-pb-none">
          <div ><b>Turno1:</b> {{ substring(personaHorarios.horaEntrada1, 5)+' - '+  substring(personaHorarios.horaSalida1, 5)}} / <b>Turno2:</b> {{ substring(personaHorarios.horaEntrada2, 5)+' - '+  substring(personaHorarios.horaSalida2, 5)}}</div>
        </q-card-section>
        <fichajesDetalleGrid
          :value="listaFichajesDetalleFilter"
        />
        <q-card-actions align="right">
          <q-btn  flat label="Close" color="primary" @click="mostrarDetalle=false"/><!-- lo captura accionesMain -->
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-item>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { urlFotos } from 'boot/axios.js'
import { date } from 'quasar'
import fichajesDetalleGrid from 'components/Fichajes/fichajesDetalleGrid.vue' 

export default {
  props: ['value', 'listaFichajesDetalle','listaPersonasHorariosAcum'], // en 'value' tenemos los registrosSeleccionados cargados del personalMain (datos de la tabla)
  data () {
    return {
      expanded: false,
      regper: {},
      urlF: urlFotos,
      mostrarDetalle: false,
      listaFichajesFilter: [],
      listaFichajesDetalleFilter: [],
      personaHorarios: {},
      filterR: {
        ordenar: false,
        incumplem3: false,
        desfasem60: false,
        nombre: ''
      },
      rowId: '',
      columns: [
        // { name: 'foto', align: 'left', label: 'foto', field: 'foto' },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'empleado', sortable: true, style: 'width: 330px; whiteSpace: normal' },
        { name: 'idpersonal', label: 'IdPersonal', align: 'left', field: 'idPersonal', sortable: true, style: 'width: 20px' },
        // { name: 'areaNombre', align: 'left', label: 'Area', field: 'nomarea', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        // { name: 'extension', align: 'left', label: 'Extension', field: 'extension', sortable: true },
        // { name: 'equipoETM', align: 'left', label: 'equipoETM', field: 'grupoetm', sortable: true },
        { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
        { name: 'cumple', align: 'left', label: 'Cumple', field: 'cumple', sortable: true },
        { name: 'olvido', align: 'left', label: 'Olvido', field: 'olvido', sortable: true },
        { name: 'desfase', align: 'left', label: 'Desfase (min)', field: 'desfase', sortable: true, format: val => this.$numeral(parseFloat(val * 60)).format('0,0') }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    substring (s, len) {
      if (s !== undefined) return s.substring(0, len)
      else return ''
    },
    editRecord (row, id) {
      this.mostrarDetalle = true
      this.personaHorarios = this.listaPersonasHorariosAcum.find(horario => horario.idPersonal === row.idPersonal && (row.fecha === undefined || horario.fecha.substring(0,10) === row.fecha))
      this.listaFichajesDetalleFilter = this.listaFichajesDetalle.filter(fichaje => fichaje.idPersonal === row.idPersonal && (row.fecha === undefined || fichaje.fecha.substring(0,10) === row.fecha.substring(6,10)+'-'+row.fecha.substring(3,5)+'-'+row.fecha.substring(0,2)))
      this.listaFichajesDetalleFilter.sort((a, b) => a.fecha < b.fecha ? -1 : 1)
    },
    ampliarImagen (record) {
      this.regper = record
      this.expanded = true
    },
    ordenarFichajes () {
      this.filterR.ordenar = true
      this.listaFichajesFilter.sort((a, b) => a.empleado + a.fecha.substring(6,10) + a.fecha.substring(3,5) + a.fecha.substring(0,2) < b.empleado + b.fecha.substring(6,10) + b.fecha.substring(3,5) + b.fecha.substring(0,2) ? -1 : 1)
    },
    filtrarFichajes (val) {
      this.listaFichajesFilter = this.value
      console.log(this.filterR.nombre)
      if (this.filterR.nombre !== null && this.filterR.nombre !== '') this.listaFichajesFilter = this.listaFichajesFilter.filter(row => row.empleado.toLowerCase().includes(this.filterR.nombre.toLowerCase()))
      if (!this.filterR.ordenar) this.ordenarFichajes()
      if (!this.filterR.incumplem3 && !this.filterR.desfasem60) return // no hay nada que hacer

      var listTemp = this.listaFichajesFilter
      this.listaFichajesFilter = []
      var empAnt = ''
      var idAnt = 0
      var desfaseAcum = 0
      var numIncumple = 0
      var numOlvidos = 0
      listTemp.forEach(row => {
        if (empAnt !== row.empleado) {
          if (empAnt !== '') {
            if ((!this.filterR.incumplem3 || this.filterR.incumplem3 && numIncumple >=3) && (!this.filterR.desfasem60 || this.filterR.desfasem60 && Math.abs(desfaseAcum) >= 1) ) {
              this.listaFichajesFilter.push({
                id: Math.random() * 100000, // key
                idPersonal: idAnt,
                empleado: empAnt,
                cumple: -numIncumple,
                olvido: numOlvidos,
                desfase: desfaseAcum
              })
            }
          }
          empAnt = row.empleado
          idAnt = row.idPersonal,
          desfaseAcum = 0
          numIncumple = 0
          numOlvidos = 0
        }
        desfaseAcum += row.desfase
        if (!row.cumple) numIncumple++
        if (row.olvido ) numOlvidos++
      })
      if ((!this.filterR.incumplem3 || this.filterR.incumplem3 && numIncumple >=3) && (!this.filterR.desfasem60 || this.filterR.desfasem60 && Math.abs(desfaseAcum) >= 1)) {
        this.listaFichajesFilter.push({
          id: Math.random() * 100000, // key
          idPersonal: idAnt,
          empleado: empAnt,
          cumple: numIncumple,
          olvido: numOlvidos,
          desfase: desfaseAcum
        })
      }
    },
    mostrarDatosPieTabla () {
      return this.value.length + ' Filas'
    }
  },
  mounted () {
    this.listaFichajesFilter = this.value    
  },
  components: {
    fichajesDetalleGrid: fichajesDetalleGrid
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
