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
          <q-card-section v-for="reserva in this.datosReserva" :key="reserva.fechaReserva" class=" row bg-orange text-white">
            <div class="col"  style="width: 300px" >
            <div class="text-h8">Fecha: {{reserva.fechaReserva}}{{reserva.calculada?'*':''}} {{reserva.sala.substring(0,3) === 'reu' ? `- Duración: ${reserva.duracion}'` : ''}}</div>
            <div class="text-h8">Mesa: {{reserva.idMesa}}</div>
            <div class="text-h8">Persona: {{reserva.idPersonalEmpleado}} - {{reserva.nombreEmpleado }}</div>
            <div v-if="reserva.observaciones!==''" class="text-h8">Observaciones: {{reserva.observaciones}}</div>
            <div class="text-h8">Email: {{reserva.emailEmpleado}}</div>
            <div class="text-h8">Área: {{reserva.nombreArea}} - Grupo: {{ reserva.etmEmpleado }}</div>
            </div>
            <q-img class="col" style="max-width:60px" :src="`${urlF}${reserva.fotoEmpleado}&auth=${authFoto}&attach=true`"/>
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

      <q-dialog v-model="dialogSalaR" >
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
              :options="[60, 120, 180, 240, 300, 480]"
            />
            <q-input outlined clearable label="Observaciones" v-model="filterRecord.observaciones" />
          </q-form>
          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="reservaSalaReunionesOk" />
            <q-btn color="primary" label="Cancel" @click="dialogSalaR = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogReserva">
        <q-card class="q-dialog-plugin"  style="width:100%">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Datos de reserva</div>
          </q-card-section>
          <q-form class="q-gutter-y-xs">
            <div class="row">
              <q-input class="col" label="Desde" outlined readonly :value="formateaFecha(formReserva.fechaDesde)"/>
              <q-input class="col" label="Hasta" outlined readonly :value="!formReserva.reservaPermanente?formateaFecha(formReserva.fechaHasta):'FIN'"/> 
            </div>
            <q-select
              label="Permanente"
              stack-label
              outlined
              v-model="formReserva.reservaPermanente"
              :options="listaBoolean"
              option-value="id"
              option-label="desc"
              emit-value
              map-options
            />
            <div v-if="formReserva.idMesap!=='' && formReserva.idMesap!==formReserva.idMesa && formReserva.reservaPermanente" class="text-caption text-red">{{'Ya tiene una reserva permanente en la mesa ' + formReserva.idMesap+'. Se modificará'}}</div>
            <div v-if="!formReserva.reservaPermanente" class="text-caption text-red">{{'Sólo se creará para dias sin reserva permanente'}}</div>
            <div v-if="formReserva.reservaPermanente && formReserva.diasSemanaArr.length<5" class="text-caption text-red">{{'Los días no reservados se entiende que opta por TELETRABAJO y debe aceptar condiciones'}}</div>
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
            <div v-if="formReserva.reservaPermanente && formReserva.diasSemanaArr.length<5">
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
            <q-btn color="primary" label="Cancel" @click="dialogReserva = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
// npm install vue-inline-svg
import { headerFormData, urlFotos } from 'boot/axios.js'
import { mapState, mapActions } from 'vuex'
import InlineSvg from 'vue-inline-svg'
import planosFilter from 'components/Planos/planosFilter.vue'
import { date } from 'quasar'
export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: true,
      dialogSalaR: false,
      dialogReserva: false,
      listaPaisesFilter: [],
      refresh: 0,
      urlF: urlFotos,
      authFoto : '',
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
      diasSemana: [{label: 'L',value: '2'},{label: 'M',value: '3'},{label: 'X',value: '4'},{label: 'J',value: '5'},{label: 'V',value: '6'},{label: 'S',value: '7'},{label: 'D',value: '1'}],
      teletrabajoOpc: [{
          label: 'He leído y acepto las condiciones de Teletrabajo',
          value: 'aceptaTeletrabajo'
        },{
          label: 'Cumplo en mi domicilio con las condiciones de seguridad y salud que se indican en el apartado 1.3 del procedimiento de teletrabajo',
          value: 'cumploDomicilio'
        },{
          label: 'Como empleado de EDICOM, si causara baja por enfermedad común o accidente, o cualquier otra causa que me impidiera trabajar, me doy por enterado, tal cual consta en las Normas de Conducta, que soy responsable de comunicar mi baja médica a tiempo y de aportar la documentación exigible por organismos oficiales y/o por la empresa. Y de no hacerlo, no recibiré mi nómina durante ese periodo. Además me hago responsable de asumir todos los gastos que la enfermedad o baja me ocasionara. Si estoy en Europa me aseguraré de tener en vigor la tarjeta sanitaria europea. Acepto además mantener la legislación laboral del país del que me ha contratado.',
          value: 'cumploBaja'
        },{
          label: 'Ambas partes acuerdan que todos los costes indirectos derivados de la prestación de dicho servicio (electricidad, costes de comunicación, etc.) correrán a cargo del Trabajador en modalidad de teletrabajo salvo que hayan sido expresamente autorizado por escrito por la Empresa con anterioridad a su realización.',
          value: 'aceptoCostes'
      }],
      filterRecord: {
        fechaDesde: date.formatDate(new Date(), 'YYYY-MM-DD'),
        fechaHasta: date.formatDate(new Date(), 'YYYY-MM-DD'),
        sala: '7',
        duracion: ''
      },
      formReserva: {
        reservaPermanente: false,
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
    activarOKReserva (f) {
      return (f.reservaPermanente) && (f.diasSemanaArr.length<5) && (f.aceptaTeletrabajoArr.length<4 || f.domicilioTeletrabajo==='' || f.teletrabajoObservaciones==='')
    },
    formatTime(time){
      if(time !== null && time !== '') return date.formatDate(date.extractDate(time,'YYYY-MM-DDTHH:mm:ss'), 'HH:mm')
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
    getMesaReservada(id){
      let indexMio = this.listaIDsReservados.findIndex(valor => valor.idMesa === id && valor.idPersonalEmpleado == this.user.pers.idpersonal);
      let index = this.listaIDsReservados.findIndex(valor => valor.idMesa === id);
      
      if(indexMio != -1)
        return this.listaIDsReservados[indexMio];

      return index != -1 ? this.listaIDsReservados[index] : null;
    },
    
    handleStateHover (e) {
      if(e.target.tagName !== 'rect') return;
      if ((this.mesaActiva === null || e.target.id !== this.mesaActiva.target.id)
            && this.listaIDsReservados.findIndex(valor => valor.idMesa === e.target.id) < 0 && this.mesaSeleccionada !== e.target.id) {
        this.showReserva = false
        this.datosReserva = null
        if (this.mesaActiva !== null) this.mesaActiva.target.style = this.colorLibre
        this.mesaActiva = e
        e.target.style = 'fill:green;opacity:0.2;'
      } else {
        let reservas = this.listaIDsReservados.filter(valor => valor.idMesa === e.target.id)
        if (reservas.length >= 0) {
          this.showReserva = true
          this.datosReserva = reservas
        }
      }
    },
    handleStateClick (e) {
      if(e.target.tagName !== 'rect') return;
      const sala = this.listaSalas.find(row => row.codElemento===this.filterRecord.sala)
      let mesa = this.getMesaReservada(e.target.id);
      
      // Comprobamos que la sala está abierta
      if (this.filterRecord.fechaDesde < sala.valor3) { // valor3 es fecha desde apertura sala yyyy-mm-dd
        this.$q.dialog({ title: 'Aviso', message: 'Esta sala se abrirá el próximo ' + this.formateaFecha(sala.valor3) +'. Puede reservar a partir de esa fecha'})
        return
      }

      // Si la mesa no es permanente  y nos pertence y está reservada entonces se quita
      if(mesa != null && mesa.idPersonalEmpleado === this.user.pers.idpersonal && !mesa.calculada){
        return this.doDeleteReserva(e);
      }

      // Primero vemos si es una reunion 
      if(this.filterRecord.sala.startsWith('reu'))
        return this.doOpenReunionForm(e);

      if(mesa != null && mesa.idPersonalEmpleado !== this.user.pers.idpersonal ){
        this.$q.dialog({ title: 'Aviso', message: 'Esta mesa ya está reservada por otra persona' })
        return;
      } 

      this.$axios.get(`bd_jpersonal.asp?action=reserva/mesas/permanente&auth=${this.user.auth}`, { params: this.filterRecord })
      .then(response => {
        // No tenemos reserva permanente
        Object.assign(this.formReserva, this.filterRecord)
        if(typeof response.data == 'string'){
          delete this.formReserva.id
          this.formReserva.idMesap = ''
          this.formReserva.idMesa = e.target.id
          this.formReserva.reservaPermanente = false
          this.formReserva.diasSemanaArr = ['2', '3', '4', '5', '6'],
          this.formReserva.aceptaTeletrabajoArr = [],
          this.formReserva.aceptaTeletrabajo = '',
          this.formReserva.paisTeletrabajo = 'ES',
          this.formReserva.domicilioTeletrabajo = '',
          this.formReserva.teletrabajoObservaciones = ''
        }else{
          this.formReserva.id = response.data.id
          this.formReserva.idMesap = response.data.idMesa
          this.formReserva.idMesa = e.target.id
          this.formReserva.reservaPermanente = response.data.reservaPermanente
          this.formReserva.diasSemanaArr = (response.data.diasSemana !== null ? response.data.diasSemana.split(',') : null)
          const obj = this.parseaDatosExtraJSON(response.data.datosExtras)
          this.formReserva.paisTeletrabajo = obj.paisTeletrabajo
          this.formReserva.domicilioTeletrabajo = obj.domicilioTeletrabajo
          this.formReserva.teletrabajoObservaciones = obj.teletrabajoObservaciones
          // Formato de teletrabajo
          if(obj.aceptaTeletrabajo !== null){
            if(obj.aceptaTeletrabajo.startsWith(',')) obj.aceptaTeletrabajo = obj.aceptaTeletrabajo.substring(1)
            this.formReserva.aceptaTeletrabajoArr =  obj.aceptaTeletrabajo.split(',')
          }
        }
          this.dialogReserva = true

      })
    },

    getDatosExtrasTeletrabjo (){
      let str = '{ "aceptaTeletrabajo": "' + this.formReserva.aceptaTeletrabajo + '", "domicilioTeletrabajo": "' + this.formReserva.domicilioTeletrabajo + '", "paisTeletrabajo": "' +
        this.formReserva.paisTeletrabajo + '", "teletrabajoObservaciones": "' + this.formReserva.teletrabajoObservaciones + '" }';

      return btoa(str);
    },

    guardaReservaPermanente () {
      // Convertimos los arrays
      this.formReserva.diasSemana = (this.formReserva.diasSemanaArr !== null ? this.formReserva.diasSemanaArr.join() : null) // paso de array a concatenacion de strings (join)
      this.formReserva.aceptaTeletrabajo = (this.formReserva.aceptaTeletrabajoArr !== null ? this.formReserva.aceptaTeletrabajoArr.join() : null) // paso de array a concatenacion de strings (join)

      let data = {
        id : this.formReserva.id,
        fechaDesde : this.formReserva.fechaDesde,
        fechaHasta : this.formReserva.fechaHasta,
        sala : this.formReserva.sala,
        idMesa : this.formReserva.idMesa,
        diasSemana: this.formReserva.diasSemana,
        reservaPermanente : this.formReserva.reservaPermanente,
        datosExtras : this.getDatosExtrasTeletrabjo()
      }
      
      this.$q.loading.show() 
      return this.$axios.post(`bd_jpersonal.asp?action=reserva/mesas/form&auth=${this.user.auth}`, data, headerFormData) // pasar e.target.id y la mesaAnterior para quitar reserva
        .then(response => {
          this.$q.loading.hide()
          this.$q.dialog({ title:!response.data.success ? 'Error' : 'Reserva', message: response.data.msg });
          
          if(!response.data.success)
                return;

          this.dialogReserva = false;
          this.mesaActiva = null
          this.getRecords(this.filterRecord)
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    },

    doDeleteReserva(e){
      let data = {
        fechaDesde : this.filterRecord.fechaDesde,
        fechaHasta : this.filterRecord.fechaHasta,
        idMesa : e.target.id
      }
      this.$q.dialog({
          title: 'Confirmar',
          message: `¿ Desea anular su reserva de mesa ${e.target.id} del ${this.formateaFecha(this.filterRecord.fechaDesde)} al ${this.formateaFecha(this.filterRecord.fechaHasta)}?`,
          ok: true,
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.$q.loading.show();
          this.$axios.get(`bd_jpersonal.asp?http_method=DELETE&action=reserva/mesas/form&auth=${this.user.auth}`, { params: data }) 
            .then(response => {
              this.$q.loading.hide()
              // Si no podemos crear reserva mostramos el error
              if(!response.data.success){
                this.$q.dialog({ title:'Error', message: response.data.msg });
                return;
              }
              this.mesaActiva = null
              this.getRecords(this.filterRecord);            
            })
        })
    },

    doOpenReunionForm (e){
      console.log('Hemos pasado por openReunion')
      this.filterRecord.fechaDesde = date.formatDate(this.filterRecord.fechaDesde, 'YYYY-MM-DD') + 'T09:00:00'
      this.filterRecord.duracion = 60
      this.mesaActiva = e
      this.filterRecord.observaciones = ''
      this.dialogSalaR = true;
      console.log(this.filterRecord);
    },

    reservaSalaReunionesOk () {
      let data = {
        id : null,
        fechaDesde : this.filterRecord.fechaDesde,
        fechaHasta: this.filterRecord.fechaHasta,
        duracion : this.filterRecord.duracion,
        observaciones : this.filterRecord.observaciones,
        sala : this.filterRecord.sala,
        idMesa : this.mesaActiva.target.id
      }

      this.$q.loading.show();
      return this.$axios.post(`bd_jpersonal.asp?action=reservas/reunion/form&auth=${this.user.auth}`, data, headerFormData) // pasar e.target.id y la mesaAnterior para quitar reserva
      .then(response => {
        this.$q.loading.hide()
        // Si no podemos crear reserva mostramos el error
        if(!response.data.success){
          this.$q.dialog({ title:'Error', message: response.data.msg });
          return;
        }
        // Limpiamos el objFilter par
        this.filterRecord.fechaDesde =  date.formatDate(this.filterRecord.fechaDesde, 'YYYY-MM-DD') + 'T00:00:00'
        
        this.dialogSalaR = false;
        this.getRecords(this.filterRecord)
        this.mesaActiva = null
      })
      .catch(error => {
        this.$q.loading.hide()
        this.$q.dialog({ title: 'Error', message: error })
      })
    },

    svgLoaded (e) {
      this.svgFile = e
      this.listaIDsReservados.forEach(valor => {
        if (e.getElementById(valor.idMesa) !== null) e.getElementById(valor.idMesa).style = this.colorOcupado
      })
      this.vbleStyle = 3000
    },
    parseaDatosExtraJSON(v) {
      let obj = { teletrabajoFechaDesde: '', teletrabajoFechaHasata: '', aceptaTeletrabajo: '', paisTeletrabajo: 'ES', domicilioTeletrabajo: '', teletrabajoObservaciones: '' }
      try {
        obj = JSON.parse(atob(v))
      }
      catch (e) {}
      return obj
    },

    getRecords (filter) {
      let objFilter = {
        fechaHasta : date.formatDate(filter.fechaHasta, 'YYYY-MM-DD'),
        fechaDesde : date.formatDate(filter.fechaDesde, 'YYYY-MM-DD'),
        sala : filter.sala
      }

      return this.$axios.get(`bd_jpersonal.asp?action=reserva/mesas/lst&auth=${this.user.auth}`, { params: objFilter })
      .then(response => {
        if(typeof response.data !== 'object'){
          this.$q.dialog({ title: 'Aviso', message: 'No se pueden cargar tantos datos, por favor busca un periodo más corto' })
          return;
        }
        this.registrosSeleccionados = response.data
        this.registrosSeleccionados.sort(function (a, b) { // ordeno el array por etiquetavalor
          return (a.idPersonalEmpleado + a.fechaReserva.substring(6, 10) + a.fechaReserva.substring(3, 5) + a.fechaReserva.substring(0, 2)).localeCompare(b.idPersonalEmpleado + b.fechaReserva.substring(6, 10) + b.fechaReserva.substring(3, 5) + b.fechaReserva.substring(0, 2))
        })
        this.listaIDsReservados.forEach(valor => {
          if (this.svgFile.getElementById(valor.idMesa) !== null) this.svgFile.getElementById(valor.idMesa).style = this.colorLibre
        })
        this.listaIDsReservados = []
        let valAnt = { idPersonalEmpleado: '', fechaReserva: '' }
        this.registrosSeleccionados.forEach(valor => {
          if (valAnt.idPersonalEmpleado === valor.idPersonalEmpleado && valAnt.fechaReserva === valor.fechaReserva) {}
          else {
            this.listaIDsReservados.push(valor)
            if (this.svgFile.getElementById(valor.idMesa) !== null) this.svgFile.getElementById(valor.idMesa).style = this.colorOcupado
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
    this.authFoto = this.user.auth;
   },

  computed: {
    ...mapState('login', ['user']), // importo state.user desde store-login
    ...mapState('tablasAux', ['listaSalas', 'listaBoolean']),
    ...mapState('empleados', ['listaPaises'])
  },
  components: {
    InlineSvg,
    planosFilter
  }
}
</script>
