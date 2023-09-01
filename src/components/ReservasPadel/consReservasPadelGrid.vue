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
            <q-btn flat v-if="rowId===`m_${props.row.id}` && (props.row.idPersonalEmpleado == user.pers.idpersonal || [16, 33, 36, 37].includes(user.pers.area))"
              @click.stop="editarPartida(props.row)"
              round
              dense
              size="sm"
              color="primary"
              icon="edit">
              <q-tooltip>Editar Partida</q-tooltip>
            </q-btn>
            <q-btn flat v-if="rowId===`m_${props.row.id}` && (props.row.idPersonalEmpleado == user.pers.idpersonal || [16, 33, 36, 37].includes(user.pers.area))"
              @click.stop="anularPartida(props.row)"
              round
              dense
              size="sm"
              color="red"
              icon="delete">
              <q-tooltip>Anular Partida</q-tooltip>
            </q-btn>
            <q-btn flat v-if="rowId===`m_${props.row.id}` && parseaJSON(props.row.observaciones).jugadores.length<4"
              @click.stop="apuntarJugador(props.row)"
              round
              dense
              size="sm"
              color="primary"
              icon="add">
              <q-tooltip>Apuntarme</q-tooltip>
            </q-btn>
            <q-btn flat v-if="rowId===`m_${props.row.id}`"
              @click.stop="listarJugadores(props.row)"
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
              <q-img @click="ampliarImagen(props.row)" v-if="col.name==='foto'" :src="`${urlF}${props.row.fotoEmpleado}&auth=${authFoto}&attach=true`"/>
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
          <q-img :src="`${urlF}${regper.fotoEmpleado}&auth=${authFoto}&attach=true`" />
        </q-card-section>
      </q-card>
    </q-dialog>

      <!--Formulario para la creación y edición de partida -->
      <q-dialog v-model="dialogPartidaForm" >
        <q-card class="q-dialog-plugin">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Datos de partida</div>
          </q-card-section>
          <q-form class="q-gutter-y-xs">
             <q-input outlined clearable label="Fecha Desde" stack-label :value="formateaFecha(formPartida.fechaReserva)" @input="val => formPartida.fechaReserva=val" >
              <template v-slot:append>
                  <q-icon name="event" class="cursos-pointer">
                    <q-popup-proxy ref="qFechaDesde1">
                      <wgDate @input="$refs.qFechaDesde1.hide()" v-model="formPartida.fechaReserva" />
                    </q-popup-proxy>
                  </q-icon>
              </template>
            </q-input>
            <q-input  
              label="Hora inicio"
              outlined
              clearable
              @input="v => formPartida.fechaReserva = v"
              :value="formatTime(formPartida.fechaReserva)">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy ref="qSal41" transition-show="scale" transition-hide="scale">
                    <q-time
                        @input="v => { $refs.qSal41.hide() }"
                        v-model="formPartida.fechaReserva"
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
              v-model="formPartida.duracion"
              :options="[60, 90]"
            />
            <q-input outlined clearable label="Nivel" v-model="formPartida.nivel" />
            <q-input outlined clearable label="Jugador1" v-model="formPartida.jug1" />
            <q-input outlined clearable label="Jugador2" v-model="formPartida.jug2" />
            <q-input outlined clearable label="Jugador3" v-model="formPartida.jug3" />
            <q-input outlined clearable label="Jugador4" v-model="formPartida.jug4" />
          </q-form>
          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="doSavePadelForm" />
            <q-btn color="primary" label="Cancel" @click="dialogPartidaForm=false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

  </q-item>
</template>

<script>
import { mapState} from 'vuex'
import { headerFormData, urlFotos } from 'boot/axios.js'
import { date } from 'quasar'
import wgDate from 'components/General/wgDate.vue'
import querystring from 'querystring'
export default {
  props: ['value', 'filter'], // en 'value' tenemos los registrosSeleccionados cargados del personalMain (datos de la tabla)
  data () {
    return {
      expanded: false,
      dialogPartidaForm: false,
      formPartida: { id: null, fechaReserva: '', nivel: 0, duracion: 60, jug1:'', jug2: '', jug3: '', jug4: ''},
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
        { name: 'equipoETM', align: 'left', label: 'equipoETM', field: 'etmEmpleado', sortable: true },
        { name: 'nivel', align: 'left', label: 'Nivel', field: 'observaciones', sortable: true, format: v => { const obj = this.parseaJSON(v); return obj.nivel } },
        { name: 'apuntados', align: 'left', label: 'Apuntados', field: 'observaciones', sortable: true, format: v => { const obj = this.parseaJSON(v); return obj.jugadores.length } },
        { name: 'fechareserva', align: 'left', label: 'Fecha Reserva', field: 'fechaReserva', sortable: true, format: v => {return date.formatDate(v,'DD/MM/YYYY H:mm:ss')} },
        { name: 'duracion', align: 'left', label: 'Duracion', field: 'duracion', sortable: true }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
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
    cleanFormPartida (){
      this.formPartida = { id: null, fechaReserva: '', nivel: 0, duracion: 60, jug1:'', jug2: '', jug3: '', jug4: ''}
    },

    anularPartida(objFilter) {
      this.$q.dialog({
        title: 'Confirmar',
        message: `¿ Desea anular su reserva de padel del ${objFilter.fechaReserva} y duración ${objFilter.duracion}?`,
        ok: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$axios.get(`bd_jpersonal.asp?http_method=DELETE&action=reservas/padel/form/${objFilter.id}&auth=${this.user.auth}`, {}) // pasar e.target.id y la mesaAnterior para quitar reserva
          .then(response => {
            this.$emit('getRecords', {})
          })
      })
    },

    abrirPartida () {
      this.cleanFormPartida();
      delete this.formPartida.id
      this.formPartida.fechaReserva = date.formatDate(new Date(), 'YYYY-MM-DD') + 'T09:00:00'
      this.formPartida.nivel = 3
      this.formPartida.jug1 = this.user.pers.nombre
      this.dialogPartidaForm = true
    },

    editarPartida (objFilter) {
       this.cleanFormPartida();
      Object.assign(this.formPartida, objFilter)
      const obj = this.parseaJSON(objFilter.observaciones)
      this.formPartida.nivel = obj.nivel
      if (obj.jugadores.length > 0) this.formPartida.jug1 = obj.jugadores[0].jug
      if (obj.jugadores.length > 1) this.formPartida.jug2 = obj.jugadores[1].jug
      if (obj.jugadores.length > 2) this.formPartida.jug3 = obj.jugadores[2].jug
      if (obj.jugadores.length > 3) this.formPartida.jug4 = obj.jugadores[3].jug
      this.dialogPartidaForm = true
    },

    apuntarJugador (objFilter) {
        this.$q.loading.show()
        this.$axios.post(`bd_jpersonal.asp?action=reservas/padel/apuntar&auth=${this.user.auth}`, querystring.stringify({idPartida: objFilter.id}), headerFormData)
        .then(result => {
          this.$q.loading.hide()
          this.$q.dialog({ title: result.data.success ? 'Apuntado' : 'Error', message: result.data.msg });
          this.$emit('getRecords', {});
        })
        .catch(error => { console.log(error.message) })
    },

    listarJugadores (objFilter) {
      const obj = this.parseaJSON(objFilter.observaciones)
      var str1 = ''
      for (var i = 0; i < obj.jugadores.length; i++) {
        if (str1.length > 0) str1 += ' -- '
        str1 = str1 + obj.jugadores[i].jug
      }
      this.$q.dialog({ title: 'Jugadores', message: str1 })
    },

    doSavePadelForm(){
        // montamos el model
        let data = {
          id: this.formPartida.id,
          fechaReserva : this.formPartida.fechaReserva,
          nivel : this.formPartida.nivel,
          duracion : this.formPartida.duracion,
          jugadores: this.formPartida.jug1 + ',' + this.formPartida.jug2 + ',' + this.formPartida.jug3 + ',' + this.formPartida.jug4
        }

        this.$q.loading.show()
        return this.$axios.post(`bd_jpersonal.asp?action=reservas/padel/form&auth=${this.user.auth}`, data, headerFormData) // pasar e.target.id y la mesaAnterior para quitar reserva
        .then(response => {
          this.$q.loading.hide()
          // Si no podemos crear reserva mostramos el error
          if(!response.data.success){
            this.$q.dialog({ title:'Error', message: response.data.msg });
            return;
          }
          this.dialogPartidaForm = false
          this.$emit('getRecords', {})
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.dialog({ title: 'Error', message: error })
        })

    }
  },

  components: {
    wgDate: wgDate
  },
  mounted ()  {
    this.authFoto = this.user.auth;
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
