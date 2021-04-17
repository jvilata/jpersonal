<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      class="personalGrid-header-table"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :data="value"
      :columns="columns"
      table-style="max-height: 60vh; max-width: 96vw"
    >

      <template v-slot:header="props">
        <!-- CABECERA DE LA TABLA -->
        <q-tr :props="props">
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
    <q-dialog v-model="expanded"  >
      <q-card style="width: 60vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h7 text-primary">{{ regper.nombre}}</div>
          <q-space />
          <q-btn flat icon="close" color="primary" @click="expanded = false"/>
        </q-card-section>
        <q-card-section>
          <q-img :src="`${urlF}${regper.idpersonal}.jpg`" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { urlFotos } from 'boot/axios.js'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos los registrosSeleccionados cargados del personalMain (datos de la tabla)
  data () {
    return {
      expanded: false,
      regper: {},
      urlF: urlFotos,
      rowId: '',
      columns: [
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'idpersonal', label: 'IdPersonal', align: 'left', field: 'idPersonal', sortable: true, style: 'width: 20px' },
        { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true, format: val => date.formatDate(date.extractDate(val, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'), 'DD/MM/YYYY HH:mm') },
        { name: 'horaEntrada1', align: 'left', label: 'Hora Ent1', field: 'horaEntrada1', sortable: true, format: val => val.substring(0, 5) },
        { name: 'horaSalida1', align: 'left', label: 'Hora Sal1', field: 'horaSalida1', sortable: true, format: val => val.substring(0, 5) },
        { name: 'horaEntrada2', align: 'left', label: 'Hora Ent2', field: 'horaEntrada2', sortable: true, format: val => val.substring(0, 5) },
        { name: 'horaSalida2', align: 'left', label: 'HOra Sal2', field: 'horaSalida2', sortable: true, format: val => val.substring(0, 5) }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    ampliarImagen (record) {
      this.regper = record
      this.expanded = true
    },
    mostrarDatosPieTabla () {
      return this.value.length + ' Filas'
    }
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
