<template>
    <div>
        <q-item class="q-pa-xs bg-indigo-1 text-grey-8">
              <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
              <q-item-section avatar>
                <q-icon name="headset_mic" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">
                  TELETRABAJO
                </q-item-label>
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
        <q-card flat>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                <div class="col-xs-4">Fecha Desde</div>
                <div class="col-xs-8">
                    <q-input 
                        clearable
                        outlined
                        stack-label
                        :value="formatDate(recordToSubmit.teletrabajoFechaDesde)"
                        @blur="fechasCorrectas()"
                        :rules="[val => !!val || 'Campo obligatorio']">
                    <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qFechaDesde">
                            <wgDate 
                                @input="$refs.qFechaDesde.hide()"
                                v-model="recordToSubmit.teletrabajoFechaDesde" />
                        </q-popup-proxy>
                        </q-icon>  
                    </template>
                    </q-input>
                </div>
            </div>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                 <div class="col-xs-4">Fecha Hasta</div>
                 <div class="col-xs-8">
                    <q-input 
                        clearable
                        outlined 
                        stack-label 
                        @blur="fechasCorrectas()"
                        :value="formatDate(recordToSubmit.teletrabajoFechaHasta)"
                        :rules="[val => !!val || 'Campo obligatorio']">
                    <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qFechaHasta">
                            <wgDate 
                            @input="$refs.qFechaHasta.hide()"
                            v-model="recordToSubmit.teletrabajoFechaHasta" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                    
                    </q-input>
                 </div>
            </div>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                 <div class="col-xs-4">Pais Teletrabajo</div>
                 <div class="col-xs-8">
                    <q-select 
                        outlined
                        clearable
                        :value="recordToSubmit.paisTeletrabajo" 
                        @input="v => recordToSubmit.paisTeletrabajo = v"
                        :rules="[val => !!val || 'Campo obligatorio']"
                        :options="listaPaisesFilter"
                        @filter="filterPaises"
                        option-value="codigo"
                        option-label="descripcion"
                        emit-value
                        map-options
                        behavior="menu">
                        <template v-slot:prepend>
                        <q-icon name="place" @click.stop />
                        </template>
                    </q-select>
                 </div>
            </div>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                 <q-input 
                    outlined 
                    v-model="recordToSubmit.domicilioTeletrabajo" 
                    label="Domicilio Teletrabajo" 
                    clearable 
                    :rules="[val => !!val || 'Campo obligatorio']"
                    class="col-xs-12" />
            </div>
            <div class="row q-pa-sm" >
                <div class="col-xs-12">
                <q-input v-model="recordToSubmit.teletrabajoObservaciones" label="Motivo Teletrabajo" clearable autogrow @keyup.enter.stop />
                </div>
            </div>
        </q-card>
     <q-card flat>
        <div class="q-px-xs">

            <div class="row items-baseline">
                 <div class="col-xs-1">
                    <q-checkbox
                        v-model="val1"
                        color="primary"
                        />
                </div>
                <div class="col-xs-11 q-pl-xs">
                    <span>He leído y acepto las</span>
                    <span 
                    @click="abrirURL('https://documentacion.edicom.es/share/proxy/alfresco/api/node/content/workspace/SpacesStore/58bed1d9-38fb-465c-bf1f-eb0a2e89ccdd/SGSI%20Procedimiento%20de%20Teletrabajo.pdf')" 
                    class="text-primary text-left q-pl-sm">condiciones de Teletrabajo </span>
                </div>
            </div>
            <div class="row items-baseline q-my-md">
                <div class="col-xs-1">
                <q-checkbox
                    v-model="val2"
                    color="primary"
                    />
                </div>
                <div class="col-xs-11 q-pl-xs">
                    <span>Cumplo en mi domicilio con las condiciones de seguridad y salud que se indican en el apartado 1.3 del</span>
                    <span 
                        @click="abrirURL('https://documentacion.edicom.es/share/proxy/alfresco/api/node/content/workspace/SpacesStore/58bed1d9-38fb-465c-bf1f-eb0a2e89ccdd/SGSI%20Procedimiento%20de%20Teletrabajo.pdf')" 
                        class="text-primary text-align-right q-pl-sm">procedimiento de Teletrabajo </span>
                </div>
            </div>
            <div class="row items-baseline q-my-md">
                <div class="col-xs-1">
                <q-checkbox
                    v-model="val3"
                    color="primary"
                    />
                </div>
                <div class="col-xs-11 q-pl-xs">
                    <span>Asumo responsabilidades por accidente o baja por enfermedad común</span>
                    <span 
                        @click="confirm1" 
                        class="text-primary text-align-right q-pl-sm">Leer más</span>
                </div>
            </div>
            <div class="row items-baseline q-my-md">
                <div class="col-xs-1">
                <q-checkbox
                    v-model="val4"
                    color="primary"
                    />
                </div>
                <div class="col-xs-11 q-pl-xs">
                    <span>Ambas partes acuerdan que todos los costes indirectos derivados</span>
                    <span 
                        @click="confirm2" 
                        class="text-primary text-align-right q-pl-sm">Leer más</span>
                </div>
            </div>
            <div class="row q-pb-md justify-center" >
                <div class="col-xs-10 q-mt-sm" style="max-width: 150px">
                    <q-btn @click="solicitarTeletrabajo" :disabled="!val1 || !val2 || !val3 || !val4 ? !disabled : disabled" color="primary" label="Solicitar Teletrabajo" style="max-height: 50px"/>
                </div>
            </div>
        </div>
    </q-card>
    </div>
</template>

<script>
import { date, openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'
import wgDate from 'components/General/wgDate.vue'

export default {
    props: ['value', 'id', 'keyValue'], 
    data () {
        return {
            recordToSubmit: {
                teletrabajoFechaDesde: '',
                teletrabajoFechaHasta: '',
                paisTeletrabajo: '',
                aceptaTeletrabajo: true,
                domicilioTeletrabajo: '',
                teletrabajoObservaciones: ''
            },
            model: null,
            val1: false,
            val2: false,
            val3: false,
            val4: false,
            dense: false,
            denseOpts: false,
            disabled: false,
            listaPaisesFilter: []
        }
    }, 
    computed:{
    ...mapState('login', ['user']),
    ...mapState('empleados', ['listaPaises'])
    },
    components: {
        wgDate: wgDate
    },
    methods: {
        ...mapActions('empleados', ['calculaResponsable', 'loadListaPaises']),
      confirm1 () {
      this.$q.dialog({
        title: 'Aceptación conciliación laboral',
        message: 'Como empleado de EDICOM, si causara baja por enfermedad común o accidente, o cualquier otra causa que me impidiera trabajar, me doy por enterado, tal cual consta en las Normas de Conducta, que soy responsable de comunicar mi baja médica a tiempo y de aportar la documentación exigible por organismos oficiales y/o por la empresa. Y de no hacerlo, no recibiré mi nómina durante ese periodo. Además me hago responsable de asumir todos los gastos que la enfermedad o baja me ocasionara. Si estoy en Europa me aseguraré de tener en vigor la tarjeta sanitaria europea. Acepto además mantener la legislación laboral del país del que me ha contratado.',
        cancel: true,
        persistent: true
      }).onOk(() => {
       this.val3 = true
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
        this.val3 = true
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    confirm2 () {
      this.$q.dialog({
        title: 'Cargo de los costes',
        message: 'Ambas partes acuerdan que todos los costes indirectos derivados de la prestación de dicho servicio (electricidad, costes de comunicación, etc.) correrán a cargo del Trabajador en modalidad de teletrabajo salvo que hayan sido expresamente autorizado por escrito por la Empresa con anterioridad a su realización.',
        cancel: true,
        persistent: true
      }).onOk(() => {
       this.val4 = true
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
        this.val4 = true
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    abrirURL (strUrl) {
         if (window.cordova === undefined) { // desktop
          openURL(strUrl)
        } else { // estamos en un disp movil
          window.cordova.InAppBrowser.open(strUrl, '_system') // openURL
        }     
    },

    formatDate (date1) {            
          return date.formatDate(date1, 'DD/MM/YYYY')
    },

    fechasCorrectas(){
        console.log(date.getDateDiff(this.recordToSubmit.teletrabajoFechaHasta, this.recordToSubmit.teletrabajoFechaDesde, 'days'))
        if( date.getDateDiff(this.recordToSubmit.teletrabajoFechaHasta, this.recordToSubmit.teletrabajoFechaDesde, 'days') < 0 ) {
            this.alerta1('Fechas erróneas', 'La fecha en la que empieza el teletrabajo no puede ser un día posterior a la fecha de fin')
        }
    },

    alerta1(tit, mens) {
        this.$q.dialog({
            title: tit,
            message: mens
        })
    },

    solicitarTeletrabajo(){
        var data = {
            consentimientos: '',
            datosSolicitud: JSON.stringify(this.recordToSubmit),
            denegada: false,
            diasEfectivos: 0,
            ejercicioAplicacion: 0,
            empleado: this.user.pers.id,
            estadoSolicitud: 1,
            estadoSolicitudDesc: '',
            fechaDesde: null,
            fechaHasta: null,
            fechaSolicitud: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
            idAutorizadorOf: 140,
            nuevaVersion: true,
            observaciones: '',
            sfechaDesde: null,
            sfechaHasta: null,
            tipoDiaLibre: 0,
            tipoSolicitud: 'TELETRABAJO'
        }
        this.$axios.post(`bd_jpersonal.asp?action=soldias&auth=${this.user.auth}`, data)
        .then(result => {
            //console.log(result.data)
          this.$q.notify({
          color: 'primary',
          message: `Se ha solicitado teletrabajo.`
          })
        })
        .catch(error => { console.log(error.message) })
    },
    filterPaises(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaPaisesFilter = this.listaPaises.filter(v => v.descripcion.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  beforeMount(){ 
        this.recordToSubmit.teletrabajoFechaDesde = this.user.pers.teletrabajoFechaDesde //new Date()
        console.log(this.recordToSubmit.teletrabajoFechaDesde)
        this.recordToSubmit.teletrabajoFechaHasta = this.user.pers.teletrabajoFechaHasta // new Date()
        this.recordToSubmit.paisTeletrabajo = this.user.pers.paisLaboral
        
  },
  mounted(){
      this.listaPaisesFilter = this.listaPaises
  }
}
</script>