<!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div>
        <q-item class="q-pa-xs bg-indigo-1 text-grey-8">
              <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
              <q-item-section avatar>
                <q-icon name="schedule" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">
                  {{ nomFormulario }}
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
        <q-form @submit="submitRecord" @keyup.esc="$emit('close')">   
        <q-card flat>
                <div class="q-pa-sm q-mt-md">
                    <div class="q-gutter-md">
                        <div class="text-subtitle1 text-bold text-center"> Horario de Lunes - Jueves:</div>
                            <div class="row q-mb-sm">
                                <div class="col q-mb-sm text-subtitle2">Hora Entrada 1
                                    <q-input filled v-model="recordToSubmit.horaEntrada1" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt1" transition-show="scale" transition-hide="scale">
                                            <q-time 
                                                @input="$refs.qEnt1.hide()"
                                                v-model="recordToSubmit.horaEntrada1"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                format24h />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 1
                                    <q-input filled v-model="recordToSubmit.horaSalida1">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal1" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal1.hide()"
                                                v-model="recordToSubmit.horaSalida1"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                
                            </div>
                            <div class="row q-mb-sm">
                            <div class="col q-mb-sm text-subtitle2">Hora Entrada 2
                                    <q-input filled v-model="recordToSubmit.horaEntrada2" onkeyup="dif30minDesc(recordToSubmit.horaEntrada2)" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt2" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qEnt2.hide()"
                                                v-model="recordToSubmit.horaEntrada2"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 2
                                    <q-input filled v-model="recordToSubmit.horaSalida2">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal2" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal2.hide()"
                                                v-model="recordToSubmit.horaSalida2"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="q-pa-sm">
                    <div class="q-gutter-md">
                        <div class="text-subtitle1 text-bold text-center">Horario de Viernes:</div>
                            <div class="row q-mb-sm">
                                <div class="col q-mb-sm text-subtitle2">Hora Entrada 3
                                    <q-input filled v-model="recordToSubmit.horaEntrada3" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt3" transition-show="scale" transition-hide="scale">
                                            <q-time 
                                                @input="$refs.qEnt3.hide()"
                                                v-model="recordToSubmit.horaEntrada3"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                format24h />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 3
                                    <q-input filled v-model="recordToSubmit.horaSalida3">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal3" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal3.hide()"
                                                v-model="recordToSubmit.horaSalida3"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                            <div class="row q-mb-sm">
                            <div class="col q-mb-sm text-subtitle2">Hora Entrada 4
                                    <q-input filled v-model="recordToSubmit.horaEntrada4" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt4" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qEnt4.hide()"
                                                v-model="recordToSubmit.horaEntrada4"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 4
                                    <q-input filled v-model="recordToSubmit.horaSalida4">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal4" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal4.hide()"
                                                v-model="recordToSubmit.horaSalida4"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="q-pa-sm q-pl-xs q-pr-xs">
                    <div class="row items-baseline q-my-sm">
                        <div class="col-xs-9">
                            <q-checkbox
                                @input="calculoHorasSem"
                                v-model="recordToSubmit.aceptaCambioHorario"
                                color="primary"
                                label="Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento..."
                                />
                        </div>
                        <div class="col-xs-3">
                            <span @click="confirm" class="text-primary text-align-right q-pl-sm">Leer Más</span>
                        </div>
                    </div>
                <div class="row justify-center" style="max-height: 70px">
                    <div class="column q-pr-sm q-mt-sm" style="max-width: 150px">
                        <q-input filled v-model="sumaHoras" label="Horas Semanales"></q-input>
                    </div>
                    <div class="column q-mt-sm" style="max-width: 150px">
                        <q-btn @click="solicitarCambioHorario" :disabled="!recordToSubmit.aceptaCambioHorario ? !disabled : disabled" color="primary" label="Solicitar Cambio Horario" style="max-height: 50px"/>
                    </div>
                </div>
            </div>
        </q-card>
    </q-form>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
    props: ['value', 'id', 'keyValue'], 
  data () {
    return {
        nomFormulario: 'CAMBIO HORARIO',
        recordToSubmit: {
            horaEntrada1: '',
            horaSalida1: '',
            horaEntrada2: '',
            horaSalida2: '',
            horaEntrada3: '',
            horaSalida3: '',
            horaEntrada4: '',
            horaSalida4: '',
            aceptaCambioHorario: false,
            aceptaComer30m: null
        },
        hourOptions: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ],
        minuteOptions: [ 0, 30 ],
        secondOptions: [ 0, 10, 20, 30, 40, 50 ],
        sumaHoras: 0,
        openDialog: false,
        disabled: false
    }
  },
  methods: {
      ...mapActions('tabs', ['addTab']),
      ...mapActions('empleados', ['calculaResponsable']),
    openForm (link) {
      this.addTab([link.name, link.label, {}, 1])
    },
    confirm () {
    this.$q.dialog({
    title: 'Aceptación conciliación laboral',
    message: 'Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento, y para que surta efecto es indispensable obtener la correspondiente autorización de su responsable. Acepto que por la misma razón, también es el responsable del departamento quien puede establecer los límites de aplicación con carácter general en su ámbito, así como modificar, revocar o suspender las autorizaciones existentes cuando así lo considere con la debida antelación.',
    cancel: true,
    persistent: true
    }).onOk(() => {
    this.recordToSubmit.aceptaCambioHorario = true
    }).onOk(() => {
    this.recordToSubmit.aceptaCambioHorario = true
    }).onCancel(() => {
    }).onDismiss(() => {
    })
    },
    calculoHorasSem() {
        this.sumaHoras = 0;
        var horasArray = [this.recordToSubmit.horaEntrada1, this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada2, this.recordToSubmit.horaSalida2, this.recordToSubmit.horaEntrada3, this.recordToSubmit.horaSalida3, this.recordToSubmit.horaEntrada4, this.recordToSubmit.horaSalida4 ];
        var horasArrayNumerico = [];
        var i;
        var j=1;
        for( i = 0; j < horasArray.length; i+=2 ) {
            horasArrayNumerico[i] = parseInt(horasArray[i], 10);
            horasArrayNumerico[j] = parseInt(horasArray[j], 10);
            this.sumaHoras += horasArrayNumerico[j] - horasArrayNumerico[i];
            j += 2
        }
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        this.sumaHoras = horasArrayNumerico.reduce(reducer);
        
    },
    submitRecord(d){
        console.log('result.data de cambioH', d)
    },
    solicitarCambioHorario(){
        //Llamada POST 
         // {"horaEntrada1":"2008-01-01T08:30:00","horaSalida1":"2008-01-01T14:00:00","horaEntrada2":"2008-01-01T15:00:00","horaSalida2":"2008-01-01T17:30:00","horaEntrada3":"2008-01-01T09:00:00","horaSalida3":"2008-01-01T14:00:00","horaEntrada4":"2008-01-01T15:00:00","horaSalida4":"2008-01-01T18:00:00","aceptaCambioHorario":true,"aceptaComer30m":false}"
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
            tipoSolicitud: 'CAMBIO HORARIO'
        }
        // this.calculaResponsable(this.user.pers.id),
        this.$axios.post(`bd_jpersonal.asp?action=soldias&auth=${this.user.auth}`, data)
        .then(result => {
            submitRecord(result.data)
          console.log(result.data)
          /* devuelve esto
          { msg: "{"emailAut":["jvilata@edicom.es"],"idResp":[140]}"
            success: true
           }    */
        })
        .catch(error => { console.log(error.message) })
    },
    dif30minDesc(horaEnt){
        if(horaEnt == this.recordToSubmit.horaEntrada2) {
            var diff =(this.recordToSubmit.horaEntrada2 - this.recordToSubmit.horaSalida1) / 1000;
            diff /= 60;
            console.log(Math.abs(Math.round(diff)));
  
        }
    }
  },
  beforeMount () {
      console.log(this.user.pers.horaentrada1)
   this.recordToSubmit.horaEntrada1 = this.user.pers.horaentrada1.substring(10,16)
   this.recordToSubmit.horaSalida1 = this.user.pers.horasalida1.substring(10,16)
   this.recordToSubmit.horaEntrada2 = this.user.pers.horaentrada2.substring(10,16)
   this.recordToSubmit.horaSalida2 = this.user.pers.horasalida2.substring(10,16)
   this.recordToSubmit.horaEntrada3 = this.user.pers.horaentrada3.substring(10,16)
   this.recordToSubmit.horaSalida3 = this.user.pers.horasalida3.substring(10,16)
   this.recordToSubmit.horaEntrada4 = this.user.pers.horaentrada4.substring(10,16)
   this.recordToSubmit.horaSalida4 = this.user.pers.horasalida4.substring(10,16)
   
  },
  mounted(){
      this.$router.replace({ name: 'cambioHorario', params: { id: this.id, value: this.value } })
      
  },
  computed:{
    ...mapState('login', ['user']),
    
  }
}
</script>