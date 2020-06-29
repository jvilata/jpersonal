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
          <q-th>
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
              icon="edit">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <!--q-btn flat v-if="rowId===`m_${props.row.id}`"
              @click.stop="deleteRecord(props.row.id)"
              round
              dense
              size="sm"
              color="red"
              icon="delete">
              <q-tooltip>Borrar</q-tooltip>
            </q-btn-->
            </div>
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div :style="col.style">
              <div v-if="!['vigente', 'foto'].includes(col.name)">{{ col.value }}</div>
              <q-img @click="ampliarImagen(props.row)" v-if="col.name==='foto'" :src="`${urlF }${props.row.idpersonal}.jpg`" />
              <div v-if="col.name==='vigente'">
                <q-checkbox v-model="col.value" />
              </div>
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
          <div class="text-h7 text-primary">{{ regper.nombre}} </div>
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

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      expanded: false,
      regper: {},
      urlF: urlFotos,
      rowId: '',
      columns: [
        { name: 'foto', align: 'left', label: 'Foto', field: 'foto', sortable: true },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'id', label: 'IdEmpleado', align: 'left', field: 'id', sortable: true, style: 'width: 20px' },
        { name: 'idPersonal', label: 'IdPersonal', align: 'left', field: 'idpersonal', sortable: true, style: 'width: 20px' },
        { name: 'nombreArea', align: 'left', label: 'Area', field: 'nombrearea', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'extension', align: 'left', label: 'Extension', field: 'extension', sortable: true },
        { name: 'paisLaboral', align: 'left', label: 'Pais Lab', field: 'pais_laboral', sortable: true, style: 'width: 30px' },
        { name: 'paisTrabaja', align: 'left', label: 'Pais', field: 'pais', sortable: true, style: 'width: 20px' },
        { name: 'grupoetm', align: 'left', label: 'GrupoETM', field: 'grupoetm', sortable: true },
        { name: 'vehiculo', align: 'left', label: 'Vehiculo', field: 'vehiculo', sortable: true, style: 'width: 130px; whiteSpace: normal', format: val => val.substring(0, 30) },
        { name: 'fecha_de_alta', align: 'left', label: 'Fecha Alta', field: 'fecha_de_alta', sortable: true },
        { name: 'vigente', align: 'left', label: 'Vigente', field: 'vigente', sortable: true, format: val => val === 'Verdadero' }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    editRecord (rowChanges, id) { // no lo uso aqui pero lod ejo como demo
      this.addTab(['personalFormMain', 'Personal-' + rowChanges.id, rowChanges, rowChanges.id])
    },
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
