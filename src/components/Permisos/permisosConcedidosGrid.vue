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
      table-style="max-height: 60vh; max-width: 96vw">

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
              <div>{{ col.value }}</div>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        <div>
          Permisos concedidos: {{ value.length }}
        </div>
      </template>
    </q-table>

    <q-banner v-else class="bg-white text-grey-8 col text-center">
      No hay permisos concedidos.
    </q-banner>
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
        { name: 'id', label: 'Id', align: 'center', field: 'id', sortable: true},
        { name: 'ejercicio', align: 'center', label: 'Ejercicio', field: 'ejercicio', sortable: true , style: 'width: 20px'},
        { name: 'fechaDesde', align: 'center', label: 'Fecha Desde', field: 'fechaDesde', sortable: true, format: val => date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY')},
        { name: 'fechaHasta', label: 'Fecha Hasta', align: 'center', field: 'fechaHasta', sortable: true, format: val => date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY')},
        { name: 'numJornadas', label: 'N. Jornadas', align: 'center', field: 'numJornadas', sortable: true},
        { name: 'tipoJornadaLibre', label: 'Tipo Jorn Libre', align: 'center', field: 'tipoJornadaLibre', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'observaciones', align: 'center', label: 'Observaciones', field: 'observaciones', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'sustituto', align: 'center', label: 'Sustituto', field: 'sustituto', sortable: true, style: 'width: 110px; whiteSpace: normal' },
        { name: 'sustFDesde', align: 'center', label: 'Sust FDesde', field: 'sustFDesde', sortable: true, format: val => val === undefined ? '' : date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY')},
        { name: 'sustFHasta', label: 'Sust FHasta', align: 'center', field: 'sustFHasta', sortable: true, format: val => val === undefined ? '' : date.formatDate(date.extractDate(val, 'YYYY-MM-DD HH:mm:ss'), 'DD-MM-YYYY')},
        { name: 'justValidados', label: 'Just. Validados', align: 'center', field: 'justValidados', sortable: true},
        { name: 'justNoValid', label: 'Just. No Valid.', align: 'center', field: 'justNoValid', sortable: true},
        { name: 'autSinDoc', label: 'Aut. Sin Doc', align: 'center', field: 'autSinDoc', sortable: true},

      ],
      pagination: { rowsPerPage: 0 }
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