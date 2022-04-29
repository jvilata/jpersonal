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
            <div class="text-h8">Fecha: {{reserva.fechareserva}}{{reserva.calculada==='1'?'*':''}} {{reserva.sala.substring(0,3) === 'reu' ? `- Duración: ${reserva.duracion}'` : ''}}</div>
            <div class="text-h8">Mesa: {{reserva.idmesa}}</div>
            <div class="text-h8">Persona: {{reserva.idpersonal}} - {{reserva.nompersona }}</div>
            <div v-if="reserva.observaciones!==''" class="text-h8">Observaciones: {{reserva.observaciones}}</div>
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
            <div class="row">
              <q-input class="col" label="Desde" outlined readonly :value="formateaFecha(filterRecord.fechaDesde)"/>
              <q-input class="col" label="Hasta" outlined readonly :value="formateaFecha(filterRecord.fechaHasta)"/> 
            </div>
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
            <q-input outlined clearable label="Observaciones" v-model="filterRecord.observaciones" />
          </q-form>
          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="reservaSalaReunionesOk" />
            <q-btn color="primary" label="Cancel" @click="$refs.dialogSalaR.hide()" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog ref="dialogReserva">
        <q-card class="q-dialog-plugin"  style="width:100%">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Datos de reserva</div>
          </q-card-section>
          <q-form class="q-gutter-y-xs">
            <div class="row">
              <q-input class="col" label="Desde" outlined readonly :value="formateaFecha(formReserva.fechaDesde)"/>
              <q-input class="col" label="Hasta" outlined readonly :value="formReserva.reservaPermanente==='0'?formateaFecha(formReserva.fechaHasta):'FIN'"/> 
            </div>
            <q-select
              label="Permanente"
              stack-label
              outlined
              v-model="formReserva.reservaPermanente"
              :options="listaSINO"
              option-value="id"
              option-label="desc"
              emit-value
              map-options
            />
            <div v-if="formReserva.idmesap!=='' && formReserva.idmesap!==formReserva.idMesa && formReserva.reservaPermanente==='1'" class="text-caption text-red">{{'Ya tiene una reserva permanente en la mesa ' + formReserva.idmesap+'. Se modificará'}}</div>
            <div v-if="formReserva.reservaPermanente==='0'" class="text-caption text-red">{{'Sólo se creará para dias sin reserva permanente'}}</div>
            <div v-if="formReserva.reservaPermanente==='1' && formReserva.diasSemanaArr.length<5" class="text-caption text-red">{{'Los días no reservados se entiende que opta por TELETRABAJO y debe aceptar condiciones'}}</div>
            <div class='row'>
              <q-option-group
                name="accepted_genres"
                v-model="formReserva.diasSemanaArr"
                :options="diasSemana"
                type="checkbox"
                color="primary"
                inline
              />
            </div>
            <div v-if="formReserva.reservaPermanente==='1' && formReserva.diasSemanaArr.length<5">
              <q-option-group
                name="accepted_tele"
                class="text-caption"
                v-model="formReserva.aceptaTeletrabajoArr"
                :options="teletrabajoOpc"
                type="checkbox"
                color="primary"
                inline
              />
              <div class="row" >
                <q-select 
                    class="col-4 text-caption"
                    label="País Teletrabajo"
                    outlined
                    :value="formReserva.paisTeletrabajo" 
                    @input="v => formReserva.paisTeletrabajo = v"
                    :options="listaPaisesFilter"
                    @filter="filterPaises"
                    option-value="codigo"
                    option-label="descripcion"
                    emit-value
                    map-options>
                </q-select>
                <q-input class="col-8 text-caption" outlined v-model="formReserva.domicilioTeletrabajo" label="Domicilio Teletrabajo" clearable/>
                <q-input class="col-12 text-caption" outlined v-model="formReserva.teletrabajoObservaciones" label="Motivo Teletrabajo" clearable />
              </div>
            </div>
          </q-form>
          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="guardaReservaPermanente"
             :disabled="activarOKReserva(formReserva)" />
            <q-btn color="primary" label="Cancel" @click="$refs.dialogReserva.hide()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
// npm install vue-inline-svg
import { headerFormData } from 'boot/axios.js'
import { mapState, mapActions } from 'vuex'
import InlineSvg from 'vue-inline-svg'
import planosFilter from 'components/Planos/planosFilter.vue'
import { date } from 'quasar'
import { urlFotos } from 'boot/axios.js'
export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: true,
      listaPaisesFilter: [],
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
      diasSemana: [
        {
          label: 'L',
          value: '2'
        },
        {
          label: 'M',
          value: '3'
        },
        {
          label: 'X',
          value: '4'
        },
        {
          label: 'J',
          value: '5'
        },
        {
          label: 'V',
          value: '6'
        },
        {
          label: 'S',
          value: '7'
        },
        {
          label: 'D',
          value: '1'
        }
      ],
      teletrabajoOpc: [
        {
          label: 'He leído y acepto las condiciones de Teletrabajo',
          value: 'aceptaTeletrabajo'
        },
        {
          label: 'Cumplo en mi domicilio con las condiciones de seguridad y salud que se indican en el apartado 1.3 del procedimiento de teletrabajo',
          value: 'cumploDomicilio'
        },
        {
          label: 'Como empleado de EDICOM, si causara baja por enfermedad común o accidente, o cualquier otra causa que me impidiera trabajar, me doy por enterado, tal cual consta en las Normas de Conducta, que soy responsable de comunicar mi baja médica a tiempo y de aportar la documentación exigible por organismos oficiales y/o por la empresa. Y de no hacerlo, no recibiré mi nómina durante ese periodo. Además me hago responsable de asumir todos los gastos que la enfermedad o baja me ocasionara. Si estoy en Europa me aseguraré de tener en vigor la tarjeta sanitaria europea. Acepto además mantener la legislación laboral del país del que me ha contratado.',
          value: 'cumploBaja'
        },
        {
          label: 'Ambas partes acuerdan que todos los costes indirectos derivados de la prestación de dicho servicio (electricidad, costes de comunicación, etc.) correrán a cargo del Trabajador en modalidad de teletrabajo salvo que hayan sido expresamente autorizado por escrito por la Empresa con anterioridad a su realización.',
          value: 'aceptoCostes'
        },
      ],
      filterRecord: {
        fechaDesde: date.formatDate(new Date(), 'YYYY-MM-DD'),
        fechaHasta: date.formatDate(new Date(), 'YYYY-MM-DD'),
        sala: '7',
        duracion: ''
      },
      formReserva: {
        reservaPermanente: '0',
        diasSemanaArr: [],
        diasSemana: '',
        aceptaTeletrabajoArr: [],
        aceptaTeletrabajo: '',
        paisTeletrabajo: 'ES',
        domicilioTeletrabajo: '',
        teletrabajoObservaciones: ''
      }
    }
  },
  methods: {
    ...mapActions('empleados', ['calcularResponsable']),
    activarOKReserva (f) {
      var res = (f.reservaPermanente==='1') && (f.diasSemanaArr.length<5) && (f.aceptaTeletrabajoArr.length<4 || f.domicilioTeletrabajo==='' || f.teletrabajoObservaciones==='')
      return res
    },
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
    filterPaises(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaPaisesFilter = this.listaPaises.filter(v => v.descripcion.toLowerCase().indexOf(needle) > -1)
      })
    },
    getDiasTeletrabajo(diasSemanaArr){
      var diasSemana = "2,3,4,5,6"; 
      for (var i = 0; i < diasSemanaArr.length; i++){
        diasSemana = diasSemana.replace(diasSemanaArr[i], ''); // Eliminamos los días elegidos
      }
      return diasSemana;
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
        if (this.listaIDsReservados.findIndex(valor => valor.calculada === '0' && valor.idmesa === e.target.id && parseInt(valor.idpersonal) === this.user.pers.idpersonal) >= 0) { // lo queremos quitar          
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
          if (this.listaIDsReservados.findIndex(valor => valor.sala.substring(0,3) !== 'reu' && valor.idmesa === e.target.id && parseInt(valor.idpersonal) !== this.user.pers.idpersonal) >= 0) { // ya está reservada
            this.$q.dialog({ title: 'Aviso', message: 'Esta mesa ya está reservada por otra persona' })
          } else {
            const reservadas = this.listaIDsReservados.filter(valor => valor.calculada === '0' && valor.sala.substring(0,3) !== 'reu' && valor.sala.substring(0,3) !== 'pad' && parseInt(valor.idpersonal) === this.user.pers.idpersonal)
            if (this.filterRecord.sala.substring(0,3) !== 'reu' && reservadas.length > 0) {
              this.$q.dialog({ title: 'Aviso', message: 'Ya tiene reservada mesa en este periodo. Anule primero: Mesa: ' + reservadas.reduce((a, b) => a + b.idmesa + ',', '') })
            } else {
              if (this.filterRecord.sala.substring(0,3) === 'reu') {
                this.filterRecord.fechaDesde = this.filterRecord.fechaDesde.substring(0, 10) + ' 09:00'
                this.filterRecord.duracion = 60
                this.mesaActiva = e
                this.filterRecord.observaciones = ''
                this.$refs.dialogSalaR.show()
              } else {
                var valor = this.listaIDsReservados.find(valor => valor.calculada === '1'  && parseInt(valor.idpersonal) === this.user.pers.idpersonal)
                Object.assign(this.formReserva, this.filterRecord)
                this.formReserva.duracion = 0
                // this.mesaActiva = e
                this.formReserva.observaciones = ''
                this.formReserva.idPersonal = this.user.pers.idpersonal
                if (valor !== undefined) {
                  this.formReserva.id = valor.id
                  this.formReserva.idmesap = valor.idmesa
                  this.formReserva.salap = valor.sala
                  this.formReserva.idMesa = e.target.id
                  this.formReserva.reservaPermanente = valor.reservapermanente
                  this.formReserva.diasSemanaArr = (valor.diassemana !== null ? valor.diassemana.split(',') : null)
                  const obj = this.parseaDatosExtraJSON(valor.datosextra)
                  this.formReserva.paisTeletrabajo = obj.paisTeletrabajo
                  this.formReserva.aceptaTeletrabajoArr = (obj.aceptaTeletrabajo !== null ? obj.aceptaTeletrabajo.split(',') : null)
                  this.formReserva.domicilioTeletrabajo = obj.domicilioTeletrabajo
                  this.formReserva.teletrabajoObservaciones = obj.teletrabajoObservaciones
                } else {
                  delete this.formReserva.id
                  this.formReserva.idmesap = ''
                  this.formReserva.salap = ''
                  this.formReserva.reservaPermanente = '0'
                  this.formReserva.diasSemanaArr = ['2', '3', '4', '5', '6'],
                  this.formReserva.aceptaTeletrabajoArr = [],
                  this.formReserva.aceptaTeletrabajo = '',
                  this.formReserva.paisTeletrabajo = 'ES',
                  this.formReserva.domicilioTeletrabajo = '',
                  this.formReserva.teletrabajoObservaciones = ''
                }
                this.$refs.dialogReserva.show()
              }
            }
          }
        }
      }
    },
    guardaReservaPermanente () {
      this.$refs.dialogReserva.hide()
      var diasTeletrabajo = this.getDiasTeletrabajo(this.formReserva.diasSemanaArr);
      this.formReserva.diasSemana = (this.formReserva.diasSemanaArr !== null ? this.formReserva.diasSemanaArr.join() : null) // paso de array a concatenacion de strings (join)
      this.formReserva.aceptaTeletrabajo = (this.formReserva.aceptaTeletrabajoArr !== null ? this.formReserva.aceptaTeletrabajoArr.join() : null) // paso de array a concatenacion de strings (join)
      // if (this.formReserva.reservaPermanente === '0') delete this.formReserva.id // hago nuevas reservas
      this.formReserva.datosExtra = '{ "aceptaTeletrabajo": "' + this.formReserva.aceptaTeletrabajo + '", "domicilioTeletrabajo": "' + this.formReserva.domicilioTeletrabajo + '", "paisTeletrabajo": "' +
        this.formReserva.paisTeletrabajo + '", "teletrabajoObservaciones": "' + this.formReserva.teletrabajoObservaciones + '" }'
      this.formReserva.datosExtra = btoa(this.formReserva.datosExtra)
      
      var datosCambio = {
        teletrabajoFechaDesde:date.formatDate(this.formReserva.fechaDesde, 'YYYY-MM-DDT00:00:00'),
				teletrabajoFechaHasta: date.formatDate(new Date(2090,11,31), 'YYYY-MM-DDT00:00:00'),
				paisTeletrabajo:this.formReserva.paisTeletrabajo,
				aceptaTeletrabajo:this.formReserva.aceptaTeletrabajo,
				domicilioTeletrabajo: this.formReserva.domicilioTeletrabajo,
				teletrabajoObservaciones:this.formReserva.teletrabajoObservaciones,
        diasTeletrabajo: diasTeletrabajo
      };
      var data = {
        consentimientos : '', 
        datosSolicitud: JSON.stringify(datosCambio), 
        denegada: false, 
        diasEfectivos: 0,
        ejercicioAplicacion: 0,
        empleado: this.user.pers.id,
        estadoSolicitud: 1,
        estadoSolicitudDesc: '',
        fechaAplicacionCambio: null,
        fechaDesde: null,
        fechaHasta: null,
        fechaSolicitud: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
        idAutorizadorOf: this.responsable,
        nuevaVersion: true,
        observaciones: this.formReserva.teletrabajoObservaciones,
        sfechaDesde: null,
        sfechaHasta: null,
        tipoDiaLibre: 0,
        tipoSolicitud: 'TELETRABAJO'
      }
      return this.$axios.get(`bd_reservaMesas.asp?action=reservarMesa&auth=${this.user.auth}`, { params: this.formReserva }) // pasar e.target.id y la mesaAnterior para quitar reserva
        .then(response => {
          this.mesaActiva = null
          this.getRecords({ sala: this.filterRecord.sala, fechaDesde: this.filterRecord.fechaDesde, fechaHasta: this.filterRecord.fechaHasta })

          //Si tenemos el formulario de teletrabajo generamos una solicitud. 
          if(this.formReserva.reservaPermanente === '1' && this.formReserva.diasSemanaArr.length < 5){
            this.$axios.post(`bd_jpersonal.asp?action=soldias&auth=${this.user.auth}`, data, headerFormData)
            .then(result => {
              this.$q.notify({
                      message: `Se ha generado una solicitud de teletrabajo.`
              })
            })
            .catch(error =>{})
          }
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    },
    reservaSalaReunionesOk () {
      this.$refs.dialogSalaR.hide()
      // para cada dia
      for (var d = date.extractDate(this.filterRecord.fechaDesde + ':00','YYYY-MM-DD HH:mm:ss'); d <= date.extractDate(this.filterRecord.fechaHasta.substring(0,10) + ' 23:59:00','YYYY-MM-DD HH:mm:ss'); d.setDate(d.getDate() + 1)) {
        var solapa = false
        this.listaIDsReservados.forEach(valor => {
          const fsol = d // date.extractDate(this.filterRecord.fechaDesde + ':00','YYYY-MM-DD HH:mm:ss')
          const fres = date.extractDate(valor.fechareserva,'DD/MM/YYYY H:mm:ss') // OJO CON ESTO, si se cambia el backend igual esto cambia
          if (valor.sala.substring(0,3) === 'reu' && valor.idmesa === this.mesaActiva.target.id &&
            date.formatDate(fres, 'YYYY-MM-DD') === date.formatDate(d, 'YYYY-MM-DD') &&
            ((fres.getTime() == fsol.getTime()) || (fres < fsol && date.addToDate(fres, { minutes: parseInt(valor.duracion) }) > fsol) ||
            (fsol < fres && date.addToDate(fsol, { minutes: parseInt(this.filterRecord.duracion) }) > fres))) {
            // es sala de reun y es la misma fecha y (una reserva anterior se solapa con la solic o la solic se solapa con una posterior)
            this.$q.dialog({ title: 'Aviso', message: 'Esta reserva se solapa con otra ya existente: ' + valor.fechareserva + ' (' + valor.duracion + '\'). REVÍSELO, NO SE RESERVA ESTE DIA' })
            solapa = true
            // return
          }
        })
        if (!solapa) {
          var objfilter = {}
          Object.assign(objfilter, this.filterRecord)
          objfilter.fechaDesde = date.formatDate(d, 'YYYY-MM-DD HH:mm:ss')
          objfilter.fechaHasta = date.formatDate(d, 'YYYY-MM-DD HH:mm:ss')
          objfilter.idMesa = this.mesaActiva.target.id
          objfilter.idPersonal = this.user.pers.idpersonal
          objfilter.observaciones = btoa(objfilter.observaciones) // para que no altere los acentos
          this.$axios.get(`bd_reservaMesas.asp?action=reservarMesa&auth=${this.user.auth}`, { params: objfilter }) // pasar e.target.id y la mesaAnterior para quitar reserva
            .then(response => {              
            })
            .catch(error => {
              this.$q.dialog({ title: 'Error', message: error.message })
            })
        }
        if (date.formatDate(d, 'YYYY-MM-DD') === this.filterRecord.fechaHasta.substring(0, 10)) {
          setTimeout(this.getRecords, 500, { sala: this.filterRecord.sala, fechaDesde: this.filterRecord.fechaDesde, fechaHasta: this.filterRecord.fechaHasta.substring(0,10) + ' 23:59:00' })
        }
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
    parseaDatosExtraJSON(v) {
      var obj = { teletrabajoFechaDesde: '', teletrabajoFechaHasata: '', aceptaTeletrabajo: '', paisTeletrabajo: 'ES', domicilioTeletrabajo: '', teletrabajoObservaciones: '' }
      try {
        obj = JSON.parse(atob(v))
      }
      catch (e) {}
      return obj
    },
    getRecords (filter) {
      var objFilter = {
        fechaDesde: filter.fechaDesde,
        fechaHasta: filter.fechaHasta
      }
      return this.$axios.get(`bd_reservaMesas.asp?action=findReservaMesas&auth=${this.user.auth}`, { params: objFilter })
        .then(response => {
          if(typeof response.data !== 'object'){
            this.$q.dialog({ title: 'Aviso', message: 'No se pueden cargar tantos datos, por favor busca un periodo más corto' })
            return;
          }
          this.registrosSeleccionados = response.data
          this.registrosSeleccionados.sort(function (a, b) { // ordeno el array por etiquetavalor
            return (a.idpersonal + a.fechareserva.substring(6, 10) + a.fechareserva.substring(3, 5) + a.fechareserva.substring(0, 2)).localeCompare(b.idpersonal + b.fechareserva.substring(6, 10) + b.fechareserva.substring(3, 5) + b.fechareserva.substring(0, 2))
          })
          this.listaIDsReservados.forEach(valor => {
            if (this.svgFile.getElementById(valor.idmesa) !== null) this.svgFile.getElementById(valor.idmesa).style = this.colorLibre
          })
          this.listaIDsReservados = []
          var valAnt = { idpersonal: '', fechareserva: '' }
          this.registrosSeleccionados.forEach(valor => {
            if (valAnt.idpersonal === valor.idpersonal && valAnt.fechareserva === valor.fechareserva) {}
            else {
              this.listaIDsReservados.push(valor)
              if (this.svgFile.getElementById(valor.idmesa) !== null) this.svgFile.getElementById(valor.idmesa).style = this.colorOcupado
            }
            Object.assign(valAnt, valor)
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

  mounted(){
    console.log('calculamos responsable')
    this.calcularResponsable({ id: this.user.pers.id, tipoSol: 2 })
      .then(response => {
          this.responsable = JSON.parse(response.data.msg).idResp[0]
          })
      .catch(error => {
          console.log('calcularResponsable', error);
      })
  },

  computed: {
    ...mapState('login', ['user']), // importo state.user desde store-login
    ...mapState('tablasAux', ['listaSalas', 'listaSINO']),
    ...mapState('empleados', ['listaPaises'])
  },
  components: {
    InlineSvg,
    planosFilter
  }
}
</script>
