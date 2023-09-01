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
          <q-th></q-th>
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
            <div style="max-width: 70px">
            <!--edit icon . Decomentamos si necesitamos accion especifica de edicion -->
            <q-btn flat v-if="!props.row.calculada && rowId===`m_${props.row.id}`"
              @click.stop="borrarReserva(props.row)"
              round
              dense
              size="sm"
              color="red"
              icon="delete">
              <q-tooltip>Borrar Reserva</q-tooltip>
            </q-btn>
            </div>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div :style="col.style">
              <div v-if="!['foto'].includes(col.name)">{{ col.value }}{{col.name==='fechareserva' && props.row.calculada ?'*':''}}</div>
              <q-img @click="ampliarImagen(props.row)" v-if="col.name==='foto'" :src="`${urlF}${props.row.fotoEmpleado}&auth=${authFoto}&attach=true`"/>
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
          <q-img :src="`${urlF}${regper.fotoEmpleado}&auth=${authFoto}&attach=true`" />
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
  props: ['value', 'filterRecord'], // en 'value' tenemos los registrosSeleccionados cargados del personalMain (datos de la tabla)
  data () {
    return {
      expanded: false,
      regper: {},
      urlF: urlFotos,
      authFoto : '',
      rowId: '',
      columns: [
        { name: 'foto', align: 'left', label: 'Foto', field: 'fotoEmpleado' },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombreEmpleado', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'idpersonal', label: 'IdPersonal', align: 'left', field: 'idPersonalEmpleado', sortable: true, style: 'width: 20px' },
        { name: 'areaNombre', align: 'left', label: 'Area', field: 'nombreArea', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'extension', align: 'left', label: 'Extension', field: 'extensionEmpleado', sortable: true },
        { name: 'equipoETM', align: 'left', label: 'Equipo ETM', field: 'etmEmpleado', sortable: true },
        { name: 'mesa', align: 'left', label: 'Mesa', field: 'idMesa', sortable: true },
        { name: 'sala', align: 'left', label: 'Sala', field: 'sala', sortable: true },
        { name: 'fechareserva', align: 'left', label: 'Fecha Reserva', field: 'fechaReserva', sortable: true, format: v => {return date.formatDate(v,'DD/MM/YYYY H:mm:ss')} }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  mounted(){
    this.authFoto = this.user.auth
  },
  methods: {
    ampliarImagen (record) {
      this.regper = record
      this.expanded = true
    },
    borrarReserva (reserva) {
      this.$q.dialog({
        title: 'Confirmar',
        message: `¿ Desea anular su reserva de mesa ${reserva.id} del ${reserva.fechaReserva} ?`,
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$axios.get(`bd_jpersonal.asp?http_method=DELETE&action=reserva/mesas/form&auth=${this.user.auth}`, { params: { id: reserva.id } }) // pasar e.target.id y la mesaAnterior para quitar reserva
          .then(response => {
            if(!response.data.success){
              this.$q.dialog({ title:'Error', message: response.data.msg });
              return;
            }
            this.$emit('getRecords', this.filterRecord)
          })
      })
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
