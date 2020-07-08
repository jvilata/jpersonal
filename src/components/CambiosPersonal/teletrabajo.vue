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
                    <q-input filled :value="formatDate(recordToSubmit.dateDesde)">
                    <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="recordToSubmit.dateDesde" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>  
                    </template>
                    <template v-slot:append>
                        <q-icon name="close" @click.stop="model = ''" class="cursor-pointer" />
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                 <div class="col-xs-4">Fecha Hasta</div>
                 <div class="col-xs-8">
                    <q-input filled :value="formatDate(recordToSubmit.dateHasta)">
                    <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="recordToSubmit.dateHasta" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                    <template v-slot:append>
                        <q-icon name="close" @click.stop="model = ''" class="cursor-pointer" />
                    </template>
                    
                    </q-input>
                 </div>
            </div>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                 <div class="col-xs-4">Pais Teletrabajo</div>
                 <div class="col-xs-8">
                    <q-select filled v-model="model" bottom-slots :options="options" :dense="dense" :options-dense="denseOpts">
                        <template v-slot:prepend>
                        <q-icon name="place" @click.stop />
                        </template>
                        <template v-slot:append>
                        <q-icon name="close" @click.stop="model = ''" class="cursor-pointer" />
                        </template>
                    </q-select>
                 </div>
            </div>
            <div class="row q-pa-sm items-baseline" style="max-width: 360px">
                 <q-input outlined v-model="domicilioTeletrabajo" label="Domicilio Teletrabajo" class="col-xs-12" />
            </div>
            <div class="row q-pa-sm" >
                <div class="col-xs-12">
                <q-input v-model="motivoTeletrab" label="Motivo Teletrabajo" autogrow @keyup.enter.stop />
                </div>
            </div>
        </q-card>
     <q-card flat>
        <div>

            <div class="row items-baseline">
                 <div class="col-xs-1">
                    <q-checkbox
                        v-model="val1"
                        color="primary"
                        />
                </div>
                <div class="col-xs-11">
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
                <div class="col-xs-11">
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
                <div class="col-xs-11">
                    <span>Asumo responsabilidades por accidente o baja por enfermedad común</span>
                    <span 
                        @click="confirm" 
                        class="text-primary text-align-right q-pl-sm">Leer más</span>
                </div>
            </div>
            <div class="row q-pb-md justify-center" >
                <div class="col-xs-10 q-mt-sm" style="max-width: 150px">
                    <q-btn @click="solicitarTeletrabajo" :disabled="!val1 || !val2 || !val3 ? !disabled : disabled" color="primary" label="Solicitar Teletrabajo" style="max-height: 50px"/>
                </div>
            </div>
        </div>
    </q-card>
    </div>
</template>

<script>
import { date, openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
    props: ['value', 'id', 'keyValue'], 
    data () {
        return {
            recordToSubmit: {
                dateDesde: '',
                dateHasta: ''
            },
            model: null,
            options: [
                'ESPAÑA', 'MEXICO', 'ITALIA', 'ALEMANIA', 'ARGENTINA'
            ],
            val1: false,
            val2: false,
            val3: false,
            dense: false,
            denseOpts: false,
            motivoTeletrab: '',
            domicilioTeletrabajo: '',
            disabled: false
        }
    }, 
    computed:{
    ...mapState('login', ['user'])
    },
    methods: {
        ...mapActions('empleados', ['calculaResponsable']),
      confirm () {
      this.$q.dialog({
        title: 'Aceptación conciliación laboral',
        message: 'Como empleado de EDICOM, si causara baja por enfermedad común o accidente, o cualquier otra causa que me impidiera trabajar, me doy por enterado, tal cual consta en las Normas de Conducta, que soy responsable de comunicar mi baja médica a tiempo y de aportar la documentación exigible por organismos oficiales y/o por la empresa. Y de no hacerlo, no recibiré mi nómina durante ese periodo. Además me hago responsable de asumir todos los gastos que la enfermedad o baja me ocasionara. Si estoy en Europa me aseguraré de tener en vigor la tarjeta sanitaria europea. Acepto además mantener la legislación laboral del país del que me ha contratado.',
        cancel: true,
        persistent: true
      }).onOk(() => {
       this.val3 = true
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
        val = true
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
    formatDate (pdate) {
        return date.formatDate(pdate, 'DD/MM/YYYY')
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
          console.log('resultdata', result.data)
          /* devuelve esto
          { msg: "{"emailAut":["jvilata@edicom.es"],"idResp":[140]}"
            success: true
           }    */
        })
        .catch(error => { console.log(error.message) })
    }
  },
  mounted(){
        this.recordToSubmit.dateDesde = this.user.pers.teletrabajofechadesde
        this.recordToSubmit.dateHasta = this.user.pers.teletrabajofechahasta
        //this.recordToSubmit.motivoTeletrab = this.user.pers.teletrabajoobservaciones

    } 
}
</script>