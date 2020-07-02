<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      v-if="value.length > 0"
      class="personalGrid-header-table"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :data="value"
      :columns="columns"
      table-style="max-height: 57vh; max-width: 96vw">

      <template v-slot:header="props">
        <!-- CABECERA DE LA TABLA -->
          <q-tr :props="props">
            <q-th auto-width align>
              <q-btn-dropdown dropdown-icon="more_vert" size="sm" unelevated dense no-icon-animation>
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label>Exportar</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label>Opción 2</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label>Opción 3</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-th>

            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :style="col.style">
              {{ col.label }}
            </q-th>
          </q-tr>
      </template>

      <template v-slot:body="props">
        
        <q-tr :props="props" 
          :key="`m_${props.row.id}`" 
          @mouseover="rowId=`m_${props.row.id}`" 
          clickable
          @click="props.expand = !props.expand">
          <q-td align="center">
            <!-- columna de acciones: editar, borrar, etc -->
            <div style="max-width: 10px">
            <!--edit icon . Decomentamos si necesitamos accion especifica de edicion -->
            <!-- <q-btn flat v-if="rowId===`m_${props.row.id}`"
              @click.stop="editRecord(props.row, props.row.id)"
              round
              dense
              size="sm"
              color="primary"
              icon="edit">
              <q-tooltip>Editar</q-tooltip>
            </q-btn> -->
            <q-btn flat v-if="rowId===`m_${props.row.id}`"
              @click.stop="deleteP(props.row.id)"
              round
              dense
              size="sm"
              color="red"
              icon="delete">
              <q-tooltip>Borrar</q-tooltip>
            </q-btn>
            </div>
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            align="left "
          >
            <div :style="col.style">
              <div>{{ formatDate(props.row.fechaDesde) }} hasta {{ formatDate(props.row.fechaHasta) }}</div>
            </div>
          </q-td>
        </q-tr>

        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%" class="bg-grey-2">
            <div>
              <permisoMoreInfo :permiso="props.row"/>
            </div>
          </q-td>
        </q-tr>

      </template>

      <template v-slot:bottom>
        <div>
          Permisos pendientes: {{ value.length }}
        </div>
      </template>

    </q-table>
    <q-banner v-else class="bg-white text-grey-8 col text-center">
      No hay permisos solicitados.
    </q-banner>

    <q-dialog v-model="eliminarPermiso"  >
        <!-- formulario con campos de filtro -->
        <permisosDelete
          @close="eliminarPermiso = !eliminarPermiso"
        />
    </q-dialog>

  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      rowId: '',
      columns: [
        { name: 'permisosPendientes', align: 'left', label: 'Permisos Pendientes', field: 'fechaDesde', sortable: false , style: 'width: 70vw'},
        // { name: 'fechaDesde', align: 'center', label: 'Fecha Desde', field: 'fechaDesde', sortable: true, format: val => date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY')},
        // { name: 'fechaHasta', label: 'Fecha Hasta', align: 'center', field: 'fechaHasta', sortable: true, format: val => date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY')},
        // { name: 'numJornadas', label: 'N. Jornadas', align: 'center', field: 'numJornadas', sortable: true, style: '' },
        // { name: 'tipoJornadaLibre', label: 'Tipo Jorn Libre', align: 'center', field: 'tipoJornadaLibre', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        // { name: 'observaciones', align: 'center', label: 'Observaciones', field: 'observaciones', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        // { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
      ],
      pagination: { rowsPerPage: 0 },
      eliminarPermiso: false
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
  },
  components: {
    permisoMoreInfo: require('components/Permisos/PermisosPendientes/permisoPendienteInfo.vue').default
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    ...mapActions('permisos', ['deletePermiso']),
    deleteP(id) {
      this.$q.dialog({
        title: 'Eliminar permiso',
        message: '¿Desea eliminar el permiso?',
        cancel: {
          color: 'primary',
          flat: true
        },
        ok: {
          label: 'Eliminar',
          flat: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        this.deletePermiso(id)
      })
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
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