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
        <q-tr :class="(parseaJSON(props.row.observaciones).jugadores.length>3?'bg-red-2':'bg-green-1')" :props="props" :key="`m_${props.row.id}`" @mouseover="rowId=`m_${props.row.id}`">
           <q-td>
            <!-- columna de acciones: editar, borrar, etc -->
            <div style="max-width: 70px">
            <!--edit icon . Decomentamos si necesitamos accion especifica de edicion -->
            <q-btn flat v-if="rowId===`m_${props.row.id}` && (props.row.idpersonal == user.pers.idpersonal || [16, 33, 36, 37].includes(user.pers.area))"
              @click.stop="editarPartida(props.row, props.row.id)"
              round
              dense
              size="sm"
              color="primary"
              icon="edit">
              <q-tooltip>Editar Partida</q-tooltip>
            </q-btn>
            <q-btn flat v-if="rowId===`m_${props.row.id}` && (props.row.idpersonal == user.pers.idpersonal || [16, 33, 36, 37].includes(user.pers.area))"
              @click.stop="anularPartida(props.row, props.row.id)"
              round
              dense
              size="sm"
              color="red"
              icon="delete">
              <q-tooltip>Anular Partida</q-tooltip>
            </q-btn>
            <q-btn flat v-if="rowId===`m_${props.row.id}` && parseaJSON(props.row.observaciones).jugadores.length<4"
              @click.stop="apuntarJugador(props.row, props.row.id)"
              round
              dense
              size="sm"
              color="primary"
              icon="add">
              <q-tooltip>Apuntarme</q-tooltip>
            </q-btn>
            <q-btn flat v-if="rowId===`m_${props.row.id}`"
              @click.stop="listarJugadores(props.row, props.row.id)"
              round
              dense
              size="sm"
              color="green"
              icon="list">
              <q-tooltip>Listar Jugadores</q-tooltip>
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
        <div class="absolute-bottom q-mb-sm" style="left: 45vw">
          <q-btn
            @click.stop="abrirPartida"
            round
            dense
            color="primary"
            size="20px"
            icon="add">
            <q-tooltip>Abrir partida</q-tooltip>
          </q-btn>
        </div>
        <div>
          {{ value.length }} Filas
        </div>
      </template>

      <template v-slot:no-data>
        <div class="absolute-bottom q-mb-sm" style="left: 45vw">
          <q-btn
            @click.stop="abrirPartida"
            round
            dense
            color="primary"
            size="20px"
            icon="add">
            <q-tooltip>Abrir partida</q-tooltip>
          </q-btn>
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

      <q-dialog v-model="dialogSalaR1" >
        <q-card class="q-dialog-plugin">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Datos de partida</div>
          </q-card-section>
          <q-form class="q-gutter-y-xs">
             <q-input outlined clearable label="Fecha Desde" stack-label :value="formateaFecha(fechaDesde)" @input="val => fechaDesde=val" >
              <template v-slot:append>
                  <q-icon name="event" class="cursos-pointer">
                    <q-popup-proxy ref="qFechaDesde1">
                      <wgDate @input="$refs.qFechaDesde1.hide()" v-model="fechaDesde" />
                    </q-popup-proxy>
                  </q-icon>
              </template>
            </q-input>
            <q-input 
              label="Hora inicio"
              outlined 
              clearable
              @input="v => fechaDesde = v"
              :value="formatTime(fechaDesde)">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy ref="qSal41" transition-show="scale" transition-hide="scale">
                    <q-time
                        @input="v => { $refs.qSal41.hide() }"
                        v-model="fechaDesde"
                        :hour-options="[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                        :minute-options="[0, 30]"
                        mask="YYYY-MM-DDTHH:mm:ss"
                        format24h />
                    </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              label="Duracion"
              stack-label
              outlined
              clearable
              v-model="filterRecord.duracion"
              :options="[60, 90]"
            />
            <q-input outlined clearable label="Nivel" v-model="filterRecord.nivel" />
            <q-input outlined clearable label="Jugador1" v-model="filterRecord.jug1" />
            <q-input outlined clearable label="Jugador2" v-model="filterRecord.jug2" />
            <q-input outlined clearable label="Jugador3" v-model="filterRecord.jug3" />
            <q-input outlined clearable label="Jugador4" v-model="filterRecord.jug4" />
          </q-form>
          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="reservaPadelOk" />
            <q-btn color="primary" label="Cancel" @click="dialogSalaR1=false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { urlFotos } from 'boot/axios.js'
import { date } from 'quasar'
import wgDate from 'components/General/wgDate.vue'
export default {
  props: ['value', 'filter'], // en 'value' tenemos los registrosSeleccionados cargados del personalMain (datos de la tabla)
  data () {
    return {
      expanded: false,
      dialogSalaR1: false,
      filterRecord: { nivel: 0, duracion: 60, jug1: '', jug2: '', jug3: '', jug4: ''},
      fechaDesde: '',
      regper: {},
      urlF: urlFotos,
      rowId: '',
      jsonp: '{ "nivel": 3, "jugadores": [{"jug": "jvilata"},{"jug": "adarder"},{"jug": "santi"}, {"jug": "raul"}] }',
      columns: [
        { name: 'foto', align: 'left', label: 'foto', field: 'foto' },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nompersona', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'idpersonal', label: 'IdPersonal', align: 'left', field: 'idpersonal', sortable: true, style: 'width: 20px' },
        { name: 'areaNombre', align: 'left', label: 'Area', field: 'nomarea', sortable: true, style: 'width: 130px; whiteSpace: normal' },
        { name: 'extension', align: 'left', label: 'Extension', field: 'extension', sortable: true },
        { name: 'equipoETM', align: 'left', label: 'equipoETM', field: 'grupoetm', sortable: true },
        { name: 'nivel', align: 'left', label: 'Nivel', field: 'observaciones', sortable: true, format: v => { const obj = this.parseaJSON(v); return obj.nivel } },
        { name: 'apuntados', align: 'left', label: 'Apuntados', field: 'observaciones', sortable: true, format: v => { const obj = this.parseaJSON(v); return obj.jugadores.length } },
        { name: 'fechareserva', align: 'left', label: 'Fecha Reserva', field: 'fechareserva', sortable: true },
        { name: 'duracion', align: 'left', label: 'Duracion', field: 'duracion', sortable: true }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    parseaJSON(v) {
      var obj = { nivel: 3, jugadores: []}
      try {
        obj = JSON.parse(v)
      }
      catch (e) {}
      return obj
    },
    formatTime(time){
      if(time !== null && time !== '') return date.formatDate(date.extractDate(time,'YYYY-MM-DDTHH:mm:ss'), 'HH:mm')
    },
    formateaFecha (datestr) {
      return date.formatDate(date.extractDate(datestr,'YYYY-MM-DD'),'DD-MM-YYYY')
    },
    ampliarImagen (record) {
      this.regper = record
      this.expanded = true
    },
    mostrarDatosPieTabla () {
      return this.value.length + ' Filas'
    },
    anularPartida(objFilter) {
      const fres = date.extractDate(objFilter.fechareserva,'DD/MM/YYYY H:mm:ss') // OJO CON ESTO, si se cambia el backend igual esto cambia
      objFilter.fechaDesde = date.formatDate(fres, 'YYYY-MM-DD HH:mm:ss')
      objFilter.fechaHasta = objFilter.fechaDesde
      this.$q.dialog({
        title: 'Confirmar',
        message: `¿ Desea anular su reserva de padel del ${objFilter.fechareserva} y duración ${objFilter.duracion}?`,
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$axios.get(`bd_reservaMesas.asp?action=anularMesa&auth=${this.user.auth}`, { params: objFilter }) // pasar e.target.id y la mesaAnterior para quitar reserva
          .then(response => {
            this.$emit('getRecords', { sala: objFilter.sala, fechaDesde: objFilter.fechaDesde.substring(0,10) })
          })
      })
    },
    abrirPartida () {
      delete this.filterRecord.id
      this.filterRecord.idpersonal = this.user.pers.idpersonal
      this.filterRecord.fechaDesde = date.formatDate(new Date(), 'YYYY-MM-DD') + 'T09:00:00'
      this.fechaDesde = this.filterRecord.fechaDesde
      // this.filterRecord.fechaHasta = this.filterRecord.fechaDesde
      this.filterRecord.duracion = 60
      this.filterRecord.nivel = 3
      this.filterRecord.observaciones = '' // aqui guardaremos el JSON con datos adicionales: nivel, jugadores
      this.filterRecord.idmesa = 'padel'
      this.filterRecord.sala = 'padel'
      this.filterRecord.jug1 = this.user.pers.nombre
      this.dialogSalaR1 = true
      // this.$refs.dialogSalaR1.show()
    },
    editarPartida (objFilter) {
      Object.assign(this.filterRecord, objFilter)
      const fres = date.extractDate(objFilter.fechareserva,'DD/MM/YYYY H:mm:ss') // OJO CON ESTO, dpenedera del backend
      this.filterRecord.fechaDesde = date.formatDate(fres, 'YYYY-MM-DDTHH:mm:ss')
      this.fechaDesde = this.filterRecord.fechaDesde
      const obj = this.parseaJSON(this.filterRecord.observaciones)
      this.filterRecord.nivel = obj.nivel
      if (obj.jugadores.length > 0) this.filterRecord.jug1 = obj.jugadores[0].jug
      else this.filterRecord.jug1 = ''
      if (obj.jugadores.length > 1) this.filterRecord.jug2 = obj.jugadores[1].jug
      else this.filterRecord.jug2 = ''
      if (obj.jugadores.length > 2) this.filterRecord.jug3 = obj.jugadores[2].jug
      else this.filterRecord.jug3 = ''
      if (obj.jugadores.length > 3) this.filterRecord.jug4 = obj.jugadores[3].jug
      else this.filterRecord.jug4 = ''
      this.dialogSalaR1 = true
      // this.$refs.dialogSalaR1.show()
    },
    apuntarJugador (objFilter) {
      Object.assign(this.filterRecord, objFilter)
      const fres = date.extractDate(objFilter.fechareserva,'DD/MM/YYYY H:mm:ss') // OJO CON ESTO, dpenedera del backend
      this.filterRecord.fechaDesde = date.formatDate(fres, 'YYYY-MM-DDTHH:mm:ss')
      this.fechaDesde = this.filterRecord.fechaDesde
      const obj = this.parseaJSON(this.filterRecord.observaciones)
      this.filterRecord.nivel = obj.nivel
      if (obj.jugadores.length > 0) this.filterRecord.jug1 = obj.jugadores[0].jug
      else this.filterRecord.jug1 = this.user.pers.nombre
      if (obj.jugadores.length > 1) this.filterRecord.jug2 = obj.jugadores[1].jug
      else this.filterRecord.jug2 = (obj.jugadores.length === 1 ? this.user.pers.nombre : '' ) 
      if (obj.jugadores.length > 2) this.filterRecord.jug3 = obj.jugadores[2].jug
      else this.filterRecord.jug3 = (obj.jugadores.length === 2 ? this.user.pers.nombre : '' ) 
      if (obj.jugadores.length > 3) this.filterRecord.jug4 = obj.jugadores[3].jug
      else this.filterRecord.jug4 = (obj.jugadores.length === 3 ? this.user.pers.nombre : '' ) 
      this.reservaPadelOk()
      this.$q.dialog({ title: 'Aviso', message: 'Apuntado' })
    },
    listarJugadores (objFilter) {
      Object.assign(this.filterRecord, objFilter)
      const obj = this.parseaJSON(this.filterRecord.observaciones)
      var str1 = ''
      for (var i = 0; i < obj.jugadores.length; i++) {
        if (str1.length > 0) str1 += ' -- '
        str1 = str1 + obj.jugadores[i].jug
      }
      this.$q.dialog({ title: 'Jugadores', message: str1 })
    },
    reservaPadelOk () {
      this.filterRecord.fechaDesde = this.fechaDesde
      const fsol = date.extractDate(this.filterRecord.fechaDesde + ':00','YYYY-MM-DDTHH:mm:ss')
      this.dialogSalaR1 = false
      // this.$refs.dialogSalaR1.hide()
      if (![16, 33, 36, 37].includes(this.user.pers.area) && (fsol > date.addToDate(new Date(), { days: 7 }))) {
        this.$q.dialog({ title: 'Aviso', message: 'No puede reservar pista a más de 7 días vista' })
        return
      }
      var solapa = false
      this.value.forEach(valor => {
        const fres = date.extractDate(valor.fechareserva,'DD/MM/YYYY H:mm:ss') // OJO CON ESTO, si se cambia el backend igual esto cambia
        if (valor.id !== this.filterRecord.id && valor.sala.substring(0,3) === 'pad' &&
          date.formatDate(fres, 'YYYY-MM-DD').substring(0,10) === this.filterRecord.fechaDesde.substring(0, 10) &&
          ((fres.getTime() == fsol.getTime()) || (fres < fsol && date.addToDate(fres, { minutes: parseInt(valor.duracion) }) > fsol) ||
           (fsol < fres && date.addToDate(fsol, { minutes: parseInt(this.filterRecord.duracion) }) > fres))) {
          // es sala de reun y es la misma fecha y (una reserva anterior se solapa con la solic o la solic se solapa con una posterior)
          this.$q.dialog({ title: 'Aviso', message: 'Esta reserva se solapa con otra ya existente: ' + valor.fechareserva + ' (' + valor.duracion + '\')' })
          this.$emit('getRecords', {})
          solapa = true
          return
        }
      })
      if (!solapa) {
        var objfilter = this.filterRecord
        objfilter.fechaDesde = date.formatDate(fsol, 'YYYY-MM-DD HH:mm')
        objfilter.fechaHasta = objfilter.fechaDesde
        var str1 = ''
        str1 = (objfilter.jug1 !== null && objfilter.jug1.length>0 ? '{ "jug": "' + objfilter.jug1 + '"}': '')
        str1 = str1 + (objfilter.jug2 !== null && objfilter.jug2.length>0 ? (str1.length>0 ? ', ': '') + '{ "jug": "' + objfilter.jug2 + '"}': '')
        str1 = str1 + (objfilter.jug3 !== null && objfilter.jug3.length>0 ? (str1.length>0 ? ', ': '') + '{ "jug": "' + objfilter.jug3 + '"}': '')
        str1 = str1 + (objfilter.jug4 !== null && objfilter.jug4.length>0 ? (str1.length>0 ? ', ': '') + '{ "jug": "' + objfilter.jug4 + '"}': '')
        objfilter.observaciones = '{ "nivel": "' + objfilter.nivel + '", "jugadores": ['+ str1 + '] }'
        objfilter.observaciones = btoa(objfilter.observaciones) // para que no altere los acentos
        return this.$axios.get(`bd_reservaMesas.asp?action=reservarMesa&auth=${this.user.auth}`, { params: objfilter }) // pasar e.target.id y la mesaAnterior para quitar reserva
          .then(response => {
            this.$emit('getRecords', {})
          })
          .catch(error => {
            this.$q.dialog({ title: 'Error', message: error })
          })
      }
    }
  },
  components: {
    wgDate: wgDate
  },
  mounted ()  {
    // this.filterRecord = this.filter
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
