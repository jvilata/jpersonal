  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
  <div style="height: 100vh">
      <q-item clickable v-ripple @click="expanded = !expanded" class=" q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-btn dense icon="find_replace" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <!-- poner un campo de fiterRecord que exista en este filtro -->
            <small>{{ Object.keys(filterRecord).length > 1 ? filterRecord : 'Pulse para definir filtro' }}</small>
          </q-item-label>
        </q-item-section>
        <q-item-section >
          <q-item>
            <q-btn
            @click.stop="vbleStyle = vbleStyle - 100"
            dense
            icon="zoom_in"/>
            <q-btn
            @click.stop="vbleStyle = vbleStyle + 100"
            dense
            icon="zoom_out"/>
          </q-item>
        </q-item-section>
        <q-item-section side>
          <q-btn
          @click="$emit('close')"
          flat
          round
          dense
          icon="close"/>
        </q-item-section>
      </q-item>

      <q-tooltip v-if="showReserva" v-model="showReserva" anchor="top middle"  >
        <q-card class=" q-pr-xs q-gutter-xs">
          <q-card-section v-for="reserva in this.datosReserva" :key="reserva.fechareserva" class=" row bg-orange text-white">
            <div class="col"  style="width: 300px" >
            <div class="text-h8">Fecha: {{reserva.fechareserva}} {{reserva.sala.substring(0,3) === 'reu' ? `- Duración: ${reserva.duracion}'` : ''}}</div>
            <div class="text-h8">Mesa: {{reserva.idmesa}}</div>
            <div class="text-h8">Persona: {{reserva.idpersonal}} - {{reserva.nompersona }}</div>
            <div class="text-h8">Email: {{reserva.email}}</div>
            <div class="text-h8">Área: {{reserva.nomarea}} - Grupo: {{ reserva.grupoetm }}</div>
            </div>
            <q-img class="col" style="max-width:60px" :src="`${urlF}${reserva.idpersonal}.jpg`"/>
          </q-card-section>
        </q-card>
      </q-tooltip>

      <InlineSvg
        :key="refresh"
        width="2000"
        :viewBox="`0 0 ${vbleStyle} ${vbleStyle}`"
        :src="require(`../../assets/${this.listaSalas.find(row => row.codElemento===this.filterRecord.sala).valor1}`)"
        @loaded="svgLoaded($event)"
        @unloaded="svgUnloaded()"
        @error="svgLoadError($event)"
        id="svg"
        @click="handleStateClick"
        @mouseover="handleStateHover">
      </InlineSvg>

      <q-dialog v-model="expanded"  >
        <!-- formulario con campos de filtro -->
        <planosFilter
          :filtro="filterRecord"
          @input="(value) => Object.assign(filterRecord, value)"
          @getRecords="getRecords"
          @close="expanded = !expanded; $emit('close')"
        />
      </q-dialog>

      <q-dialog ref="dialogSalaR" >
        <q-card class="q-dialog-plugin">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Datos de reserva</div>
          </q-card-section>
          <q-form class="q-gutter-y-xs">
            <q-input 
              label="Hora inicio"
              outlined 
              clearable
              @input="v => filterRecord.fechaDesde = v"
              :value="formatTime(filterRecord.fechaDesde)">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy ref="qSal4" transition-show="scale" transition-hide="scale">
                    <q-time
                        @input="v => { $refs.qSal4.hide() }"
                        v-model="filterRecord.fechaDesde"
                        :hour-options="[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]"
                        :minute-options="[0, 30]"
                        mask="YYYY-MM-DD HH:mm"
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
              :options="[60, 120, 180, 240, 300, 480]"
            />
          </q-form>
          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="reservaSalaReunionesOk" />
            <q-btn color="primary" label="Cancel" @click="$refs.dialogSalaR.hide()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
// npm install vue-inline-svg
import { mapState } from 'vuex'
import InlineSvg from 'vue-inline-svg'
import planosFilter from 'components/Planos/planosFilter.vue'
import { date } from 'quasar'
import { urlFotos } from 'boot/axios.js'
export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: true,
      refresh: 0,
      urlF: urlFotos,
      visible: '',
      vbleStyle: 100,
      mesaActiva: null,
      listaIDsReservados: [],
      colorOcupado: 'fill:red;opacity:0.2;',
      colorLibre: 'opacity:0;fill:#0000ff;fill-rule:evenodd',
      showReserva: false,
      datosReserva: null,
      svgFile: null,
      nomFormulario: 'Reservar',
      registrosSeleccionados: [],
      filterRecord: {
        fechaDesde: date.formatDate(new Date(), 'YYYY-MM-DD'),
        fechaHasta: date.formatDate(new Date(), 'YYYY-MM-DD'),
        sala: '7',
        duracion: ''
      }
    }
  },
  methods: {
    formatTime(time){
      if(time !== null && time !== '') return date.formatDate(date.extractDate(time,'YYYY-MM-DD HH:mm'), 'HH:mm')
    },
    ajustarFechaHora(pdate){
      var d1 = date.extractDate(pdate,'YYYY-MM-DD HH:mm')
      d1 = new Date(2008,0,1, d1.getHours(), d1.getMinutes()) // el backend trabaja con 2008-1-1 HH:mm
      return date.formatDate(d1, 'YYYY-MM-DD HH:mm:ss')
    },
    formateaFecha (datestr) {
      return date.formatDate(date.extractDate(datestr,'YYYY-MM-DD'),'DD-MM-YYYY')
    },
    handleStateHover (e) {
      if (e.target.tagName === 'rect' && (this.mesaActiva === null || e.target.id !== this.mesaActiva.target.id) &&
        this.listaIDsReservados.findIndex(valor => valor.idmesa === e.target.id) < 0 && this.mesaSeleccionada !== e.target.id) {
        this.showReserva = false
        this.datosReserva = null
        if (this.mesaActiva !== null) this.mesaActiva.target.style = this.colorLibre
        this.mesaActiva = e
        e.target.style = 'fill:green;opacity:0.2;'
      } else {
        const reservas = this.listaIDsReservados.filter(valor => valor.idmesa === e.target.id)
        if (reservas.length >= 0) {
          this.showReserva = true
          this.datosReserva = reservas
        }
      }
    },
    handleStateClick (e) {
      const objfilter = this.filterRecord
      objfilter.idMesa = e.target.id
      objfilter.idPersonal = this.user.pers.idpersonal
      const sala = this.listaSalas.find(row => row.codElemento===this.filterRecord.sala)
      if (this.filterRecord.fechaDesde < date.formatDate(new Date(), 'YYYY-MM-DD')) {
        this.$q.dialog({ title: 'Aviso', message: 'No se pueden modificar reservas pasadas' })
        return
      }
      if (this.filterRecord.fechaDesde < sala.valor3) { // valor3 es fecha desde apertura sala yyyy-mm-dd
        this.$q.dialog({ title: 'Aviso', message: 'Esta sala se abrirá el próximo ' + this.formateaFecha(sala.valor3) +'. Puede reservar a partir de esa fecha'})
        return
      }
      if (e.target.tagName === 'rect') { // reservas de esta mesa si no esta esta persona
        if (this.listaIDsReservados.findIndex(valor => valor.idmesa === e.target.id && parseInt(valor.idpersonal) === this.user.pers.idpersonal) >= 0) { // lo queremos quitar
          this.$q.dialog({
            title: 'Confirmar',
            message: `¿ Desea anular su reserva de mesa ${e.target.id} del ${this.formateaFecha(this.filterRecord.fechaDesde)} al ${this.formateaFecha(this.filterRecord.fechaHasta)}?`,
            ok: true,
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$axios.get(`bd_reservaMesas.asp?action=anularMesa&auth=${this.user.auth}`, { params: objfilter }) // pasar e.target.id y la mesaAnterior para quitar reserva
              .then(response => {
                this.mesaActiva = null
                this.getRecords({ sala: this.filterRecord.sala, fechaDesde: this.filterRecord.fechaDesde, fechaHasta: this.filterRecord.fechaHasta })
              })
          })
        } else {
          if (this.listaIDsReservados.findIndex(valor => valor.sala.substring(0,3) !== 'reu' && valor.idmesa === e.target.id) >= 0) { // ya está reservada
            this.$q.dialog({ title: 'Aviso', message: 'Esta mesa ya está reservada por otra persona' })
          } else {
            const reservadas = this.listaIDsReservados.filter(valor => valor.sala.substring(0,3) !== 'reu' && parseInt(valor.idpersonal) === this.user.pers.idpersonal)
            if (this.filterRecord.sala.substring(0,3) !== 'reu' && reservadas.length > 0) {
              this.$q.dialog({ title: 'Aviso', message: 'Ya tiene reservada mesa en este periodo. Anule primero: Mesa: ' + reservadas.reduce((a, b) => a + b.idmesa + ',', '') })
            } else {
              if (this.filterRecord.sala.substring(0,3) === 'reu') {
                this.filterRecord.fechaDesde = this.filterRecord.fechaDesde.substring(0, 10) + ' 09:00'
                this.filterRecord.duracion = 60
                this.mesaActiva = e
                this.$refs.dialogSalaR.show()
              } else {
                this.$q.dialog({
                  title: 'Confirmar',
                  message: `¿ Desea reservar la mesa ${e.target.id} del ${this.formateaFecha(this.filterRecord.fechaDesde)} al ${this.formateaFecha(this.filterRecord.fechaHasta)}?`,
                  ok: true,
                  cancel: true,
                  persistent: true
                }).onOk(() => {
                  return this.$axios.get(`bd_reservaMesas.asp?action=reservarMesa&auth=${this.user.auth}`, { params: objfilter }) // pasar e.target.id y la mesaAnterior para quitar reserva
                    .then(response => {
                      this.mesaActiva = null
                      this.getRecords({ sala: this.filterRecord.sala, fechaDesde: this.filterRecord.fechaDesde, fechaHasta: this.filterRecord.fechaHasta })
                    })
                    .catch(error => {
                      this.$q.dialog({ title: 'Error', message: error })
                    })
                })
              }
            }
          }
        }
      }
    },
    reservaSalaReunionesOk () {
      this.$refs.dialogSalaR.hide()
      var solapa = false
      this.listaIDsReservados.forEach(valor => {
        const fsol = date.extractDate(this.filterRecord.fechaDesde + ':00','YYYY-MM-DD HH:mm:ss')
        const fres = date.extractDate(valor.fechareserva,'DD/MM/YYYY HH:mm:ss') // OJO CON ESTO, si se cambia el backend igual esto cambia
        if (valor.sala.substring(0,3) === 'reu' && valor.idmesa === this.mesaActiva.target.id &&
          date.formatDate(fres, 'YYYY-MM-DD').substring(0,10) === this.filterRecord.fechaDesde.substring(0, 10) &&
          ((fres < fsol && date.addToDate(fres, { minutes: parseInt(valor.duracion) }) > fsol) ||
           (fsol < fres && date.addToDate(fsol, { minutes: parseInt(this.filterRecord.duracion) }) > fres))) {
          // es sala de reun y es la misma fecha y (una reserva anterior se solapa con la solic o la solic se solapa con una posterior)
          this.$q.dialog({ title: 'Aviso', message: 'Esta reserva se solapa con otra ya existente: ' + valor.fechareserva + ' (' + valor.duracion + '\')' })
          solapa = true
          return
        }
      })
      if (!solapa) {
        const objfilter = this.filterRecord
        objfilter.idMesa = this.mesaActiva.target.id
        objfilter.idPersonal = this.user.pers.idpersonal
        return this.$axios.get(`bd_reservaMesas.asp?action=reservarMesa&auth=${this.user.auth}`, { params: objfilter }) // pasar e.target.id y la mesaAnterior para quitar reserva
          .then(response => {
            this.getRecords({ sala: this.filterRecord.sala, fechaDesde: this.filterRecord.fechaDesde, fechaHasta: this.filterRecord.fechaHasta })
          })
          .catch(error => {
            this.$q.dialog({ title: 'Error', message: error })
          })
      }
      this.mesaActiva = null
    },
    svgLoaded (e) {
      this.svgFile = e
      this.listaIDsReservados.forEach(valor => {
        if (e.getElementById(valor.idmesa) !== null) e.getElementById(valor.idmesa).style = this.colorOcupado
      })
      this.vbleStyle = 3000
    },
    getRecords (filter) {
      var objFilter = {
        fechaDesde: filter.fechaDesde,
        fechaHasta: filter.fechaHasta
      }
      return this.$axios.get(`bd_reservaMesas.asp?action=findReservaMesas&auth=${this.user.auth}`, { params: objFilter })
        .then(response => {
          this.registrosSeleccionados = response.data
          this.listaIDsReservados.forEach(valor => {
            if (this.svgFile.getElementById(valor.idmesa) !== null) this.svgFile.getElementById(valor.idmesa).style = this.colorLibre
          })
          this.listaIDsReservados = []
          this.registrosSeleccionados.forEach(valor => {
            this.listaIDsReservados.push(valor)
            if (this.svgFile.getElementById(valor.idmesa) !== null) this.svgFile.getElementById(valor.idmesa).style = this.colorOcupado
          })
          this.expanded = false
          this.refresh++
        })
        .catch(error => {
          console.log(error)
          this.$q.dialog({ title: 'Error', message: error })
        })
    }
  },
  computed: {
    ...mapState('login', ['user']), // importo state.user desde store-login
    ...mapState('tablasAux', ['listaSalas'])
  },
  components: {
    InlineSvg,
    planosFilter
  }
}
</script>
