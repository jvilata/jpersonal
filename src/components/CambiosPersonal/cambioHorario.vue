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
        <q-form @keyup.esc="$emit('close')">   
        <q-card flat>
                <div class="q-pa-sm q-mt-md">
                    <div class="q-gutter-md">
                        <div class="text-subtitle1 text-bold text-center"> Horario de Lunes - Jueves:</div>
                            <div class="row q-mb-sm">
                                <div class="col q-mb-sm text-subtitle2">Hora Entrada 1
                                    <q-input 
                                        @blur="calculoHorasSem()"
                                        outlined
                                        clearable
                                        stack-label  
                                        :value="formatTime(recordToSubmit.horaEntrada1)" 
                                        @input="v => recordToSubmit.horaEntrada1 = v"
                                        class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt1" transition-show="scale" transition-hide="scale">
                                            <q-time 
                                                @input="v => { $refs.qEnt1.hide(); recordToSubmit.horaEntrada1 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaEntrada1"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                mask="YYYY-MM-DDTHH:mm"
                                                format24h />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 1
                                    <q-input 
                                        outlined 
                                        clearable 
                                        :value="formatTime(recordToSubmit.horaSalida1)"
                                        @blur="calculoHorasSem()"
                                        @input="v => recordToSubmit.horaSalida1 = v">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal1" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="v => { $refs.qSal1.hide(); recordToSubmit.horaSalida1 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaSalida1"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" 
                                                mask="YYYY-MM-DDTHH:mm"
                                                format24h/>
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                
                            </div>
                            <div class="row q-mb-sm">
                            <div class="col q-mb-sm text-subtitle2">Hora Entrada 2
                                    <q-input 
                                        outlined 
                                        clearable 
                                        :value="formatTime(recordToSubmit.horaEntrada2)" 
                                        @blur="calculoHorasSem()"
                                        @input="v => recordToSubmit.horaEntrada2 = v"
                                        class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt2" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="v => { $refs.qEnt2.hide(); recordToSubmit.horaEntrada2 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaEntrada2"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                mask="YYYY-MM-DDTHH:mm" 
                                                format24h/>
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 2
                                    <q-input 
                                        outlined 
                                        clearable 
                                        :value="formatTime(recordToSubmit.horaSalida2)"
                                        @blur="calculoHorasSem()"
                                         @input="v => recordToSubmit.horaSalida2 = v">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal2" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="v => { $refs.qSal2.hide(); recordToSubmit.horaSalida2 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaSalida2"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" 
                                                mask="YYYY-MM-DDTHH:mm"
                                                format24h/>
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
                                    <q-input 
                                        outlined 
                                        clearable 
                                        :value="formatTime(recordToSubmit.horaEntrada3)" 
                                        @blur="calculoHorasSem()"
                                        @input="v => recordToSubmit.horaEntrada3 = v"
                                        class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt3" transition-show="scale" transition-hide="scale">
                                            <q-time 
                                                @input="v => { $refs.qEnt3.hide(); recordToSubmit.horaEntrada3 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaEntrada3"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                mask="YYYY-MM-DDTHH:mm"
                                                format24h />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 3
                                    <q-input 
                                        outlined 
                                        clearable 
                                        :value="formatTime(recordToSubmit.horaSalida3)"
                                        @blur="calculoHorasSem()"
                                        @input="v => recordToSubmit.horaSalida3 = v">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal3" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="v => { $refs.qSal3.hide(); recordToSubmit.horaSalida3 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaSalida3"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" 
                                                mask="YYYY-MM-DDTHH:mm"
                                                format24h/>
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                            <div class="row q-mb-sm">
                            <div class="col q-mb-sm text-subtitle2">Hora Entrada 4
                                    <q-input 
                                        outlined 
                                        clearable 
                                        :value="formatTime(recordToSubmit.horaEntrada4)" 
                                        @blur="calculoHorasSem()"
                                        @input="v => recordToSubmit.horaEntrada4= v"
                                        class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt4" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="v => { $refs.qEnt4.hide(); recordToSubmit.horaEntrada4 = ajustarFechaHora(v) }"
                                                :value="recordToSubmit.horaEntrada4"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                mask="YYYY-MM-DDTHH:mm" 
                                                format24h/>
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 4
                                    <q-input 
                                        outlined 
                                        clearable
                                        @input="v => recordToSubmit.horaSalida4 = v"
                                        :value="formatTime(recordToSubmit.horaSalida4)"
                                        @blur="calculoHorasSem()">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal4" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="v => { $refs.qSal4.hide(); recordToSubmit.horaSalida4 = ajustarFechaHora(v) }"
                                                v-model="recordToSubmit.horaSalida4"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions"
                                                mask="YYYY-MM-DDTHH:mm"
                                                format24h />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="q-px-xs">
                    <div class="row items-baseline q-my-sm">
                        <div class="col-xs-1">
                            <q-checkbox
                                v-model="recordToSubmit.aceptaCambioHorario"
                                color="primary"
                                @input="checkBut"
                                />
                            
                        </div>
                        <div class="col-xs-11 q-pl-xs">
                            <span> Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades</span>
                            <span @click="confirm1" class="text-primary text-align-right q-pl-sm">Leer Más</span>
                        </div>
                    </div>
                    <div class="row items-baseline q-my-sm" v-if="checkComer30">
                        <div class="col-xs-1">
                            <q-checkbox v-model="recordToSubmit.aceptaComer30m" @input="checkBut" />
                        </div>
                        <div class="col-xs-11 q-pl-xs">
                            <span>Solicito y acepto, al objeto de conciliar mi vida familiar, que el descanso a mitad de </span>
                            <span @click="confirm2" class="text-primary text-align-right q-pl-sm">Leer Más</span>
                        </div>
                    </div>
                <div class="row justify-center" style="max-height: 70px">
                    <div class="column q-pr-sm q-mt-sm" style="max-width: 150px">
                        <q-input filled v-model="sumaHoras" label="Horas Semanales"></q-input>
                    </div>
                    <div class="column q-mt-sm" style="max-width: 150px">
                        <q-btn @click="solicitarCambioHorario"  color="primary" label="Solicitar Cambio Horario" style="max-height: 50px" :disable="disableBut"/>
                    </div>
                    <q-dialog v-model="dialogMes" @click="$emit('close')" >
                        <!-- <q-card class="bg-indigo-1 text-black" style="width: 250px">
                            <q-card-section>
                                <div class="text-subtitle2">Solicitud registrada con éxito</div>
                            </q-card-section>
                            <q-card-actions align="center" class="bg-white">
                                <q-btn icon="done" flat size="lg" color="green" v-close-popup />
                            </q-card-actions>
                        </q-card>
                        <q-avatar color="green" text-color="green" icon="check_circle_outline" size="100px" /> -->
                        <q-icon color="green" name="check_circle" size="100px" />
                    </q-dialog>
                    <!-- :disabled="!recordToSubmit.aceptaComer30m || !condiciones || recordToSubmit.aceptaCambioHorario ? !disabled : disabled" -->
                    <q-btn @click="showLoading">BOTON PRUBEA</q-btn>
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
            aceptaComer30m: true
        },
        hourOptions: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ],
        minuteOptions: [ 0, 30 ],
        secondOptions: [ 0, 10, 20, 30, 40, 50 ],
        sumaHoras: 0,
        openDialog: false,
        checkComer30: false,
        jornadaEmpl: 0,
        disableBut: true,
        condiciones: false,
        dialogMes: false,
        responsable: 0
    }
  },
  methods: {
      ...mapActions('tabs', ['addTab']),
      ...mapActions('empleados', ['calcularResponsable', 'loadDetalleEmpleado']),
      ...mapActions('tablasAux', ['sendMail']),

    openForm (link) {
      this.addTab([link.name, link.label, {}, 1])
    },
    showLoading () {
      this.$q.loading.show()

      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.dialogMes = true
        this.timer = void 0
      }, 3000)
    },
    checkBut() {
        if (this.recordToSubmit.aceptaCambioHorario) {
            if (!this.checkComer30) {
                this.disableBut = false
            } else if (this.recordToSubmit.aceptaComer30m) {
                this.disableBut = false
            } else { this.disableBut = true }
        } else { this.disableBut = true }
    },
    //PRUEBA
    // confirm(){
    //   this.$q.dialog({
    //     transitionShow: 'slide-down',
    //     transitionHide: 'slide-up',
    //     color: 'primary',
    //     message: 'Se ha registrado su solicitud de cambio',
    //     persistent: true,
    //   }).onOk(() => {
    //   }).onOk(() => {
    //   }).onDismiss(() => {
    //   })
    // },//TERMINA LA PRUEBA

    confirm1 () {
    this.$q.dialog({
    title: 'Aceptación conciliación laboral',
    message: 'Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento, y para que surta efecto es indispensable obtener la correspondiente autorización de su responsable. Acepto que por la misma razón, también es el responsable del departamento quien puede establecer los límites de aplicación con carácter general en su ámbito, así como modificar, revocar o suspender las autorizaciones existentes cuando así lo considere con la debida antelación.',
    cancel: true,
    persistent: true
    }).onOk(() => {
    this.recordToSubmit.aceptaCambioHorario = true
    this.checkBut()
    }).onCancel(() => {
    }).onDismiss(() => {
    })
    },

    confirm2 () {
    this.$q.dialog({
    title: 'Descanso de 30 minutos',
    message: 'Solicito y acepto, al objeto de conciliar mi vida familiar, que la parada de descanso a mitad de jornada sea sólo de 30 minutos en lugar de 1 hora, no reclamando ni solicitando nada adicional a la empresa por este motivo',
    cancel: true,
    persistent: true
    }).onOk(() => {
    this.recordToSubmit.aceptaComer30m = true
    this.checkBut()
    }).onCancel(() => {
    }).onDismiss(() => {
    })
    },

    calculoHorasSem() {
        let diff = 0;
        this.sumaHoras = 0;
        if (this.recordToSubmit.horaEntrada1 === null || this.recordToSubmit.horaEntrada1 === '') this.recordToSubmit.horaEntrada1 = this.recordToSubmit.horaSalida1
        console.log(this.recordToSubmit)
        if (this.recordToSubmit.horaSalida1 === null  || this.recordToSubmit.horaSalida1 === '') this.recordToSubmit.horaSalida1 = this.recordToSubmit.horaEntrada1
        if (this.recordToSubmit.horaEntrada2 === null  || this.recordToSubmit.horaEntrada2 === '') this.recordToSubmit.horaEntrada2 = this.recordToSubmit.horaSalida2
        if (this.recordToSubmit.horaSalida2 === null  || this.recordToSubmit.horaSalida2 === '') this.recordToSubmit.horaSalida2 = this.recordToSubmit.horaEntrada2
        if (this.recordToSubmit.horaEntrada3 === null || this.recordToSubmit.horaEntrada3 === '') this.recordToSubmit.horaEntrada3 = this.recordToSubmit.horaSalida3
        if (this.recordToSubmit.horaSalida3 === null || this.recordToSubmit.horaSalida3 === '') this.recordToSubmit.horaSalida3 = this.recordToSubmit.horaEntrada3
        if (this.recordToSubmit.horaEntrada4 === null || this.recordToSubmit.horaEntrada4 === '') this.recordToSubmit.horaEntrada4 = this.recordToSubmit.horaSalida4
        if (this.recordToSubmit.horaSalida4 === null || this.recordToSubmit.horaSalida4 === '') this.recordToSubmit.horaSalida4 = this.recordToSubmit.horaEntrada4
        var horasArray = [this.recordToSubmit.horaEntrada1, this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada2, this.recordToSubmit.horaSalida2]
        var i;
        let unit = 'hours'
        for( i = 0; i < horasArray.length ; i+=2 ) {
            if(horasArray[i] !== null && horasArray[i] !== '') {
                if(horasArray[i] > horasArray[i+1]) { 
                    //si es horario de noche, la hora de entrada será mayor que la de salida -> hay que sumarle un dia para que la diferencia calculada sea correcta
                    horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) 
                }
                diff = date.getDateDiff(horasArray[i+1], horasArray[i], unit)
                this.sumaHoras += Math.abs(diff)

            }
        }
        this.sumaHoras *= 4 // *4 porque es de Lunes-Jueves con ese horario
        horasArray = [this.recordToSubmit.horaEntrada3, this.recordToSubmit.horaSalida3, this.recordToSubmit.horaEntrada4, this.recordToSubmit.horaSalida4 ]
        for( i = 0; i < horasArray.length ; i+=2 ) {
            if(horasArray[i] !== null && horasArray[i] !== '') {
                if(horasArray[i] > horasArray[i+1]) { horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) }
             diff = date.getDateDiff(horasArray[i+1], horasArray[i], unit)
             this.sumaHoras += Math.abs(diff)
            }
        } 
        //aceptar comer en 30 min
        var com1 = 0.0
        var com2 = 0.0
        unit = 'minutes'
        if (this.recordToSubmit.horaEntrada2 !== null && this.recordToSubmit.horaSalida1 !== null) 
            console.log(this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada2)
            com1 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada2, unit))
            console.log(com1, this.recordToSubmit.horaSalida1)
            // if(com1 <= 0) { this.alerta1('Alerta Descanso Mínimo:', 'No se permite ')} hora entrada 2 tiene que ser posterior a la hora salida (tiene que haber descanso)
        if (this.recordToSubmit.horaEntrada4 !== null && this.recordToSubmit.horaSalida3 !== null)    
            com2 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida3, this.recordToSubmit.horaEntrada4, unit))
        if ( (com1 > 0 && com1 <= 30) || (com2 > 0 && com2 <= 30)) {
            console.log(com1)
            this.checkComer30 = true
            this.recordToSubmit.aceptaComer30m = false
        }else { this.checkComer30 = false }

        var sum1 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada1, 'hours'))
        if(sum1 > 24) sum1 = 0
        var sum2 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida2, this.recordToSubmit.horaEntrada2, 'hours'))
        if(sum2 > 24) sum2 = 0
        var sum3 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida3, this.recordToSubmit.horaEntrada3, 'hours'))
        if(sum3 > 24) sum3 = 0
        var sum4 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida4, this.recordToSubmit.horaEntrada4, 'hours'))
        if(sum4 > 24) sum4 = 0

        if(this.jornadaEmpl >= ''){ //DEBERIA DE SER this.jornadaEmpl >= 100
            if (sum1 === 0 || sum2 === 0 || sum3 === 0) { 
                this.condiciones = false
            }
            else {
                // if (!acepta) result = false; 

                if (sum1 + sum2 > 9 || sum1 + sum2 < 8) {
                    this.alerta1('Atención: Jornada', 'No se permite una jornada laboral de Lunes a Jueves inferior a 8h ni superior a 9h');
                    this.condiciones = false
                } else
                    if (sum3 + sum4 > 9 || sum1 + sum2 < 5) {
                        this.alerta1('Atención: Jornada', 'No se permite una jornada laboral de Viernes inferior a 5h ni superior a 9h')
                        this.condiciones = false
                    } else
                        if ((sum1 + sum2)*4 + sum3 + sum4 > 40 || (sum1 + sum2)*4 + sum3 + sum4 < 30) {
                            this.alerta1('Atención: Jornada', 'No se permite jornada laboral semanal superior a 40h o inferior a 30h.')
                            this.condiciones = false
                        } else {
                            if (sum1 > 6 || sum2 > 6 || sum3 > 6 ||sum4 > 6) {
                                this.alerta1('Atención: Jornada', 'Para jornadas superiores a 6h hay que estipular una parada de al menos 15m. Consulta con tu responsable')
                                this.condiciones = false
                            }  
                            if ( (sum1 + sum2)*4 + sum3 + sum4 < 40) {
                                this.alerta1('Atención: Jornada', 'La jornada laboral es inferior a 40h. Comprueba que es correcto.')
                                this.condiciones = false
                            } else this.condiciones = true
                        }
            }
        } else{
            this.condiciones = true
        }
        console.log(this.recordToSubmit.aceptaCambioHorario)
        console.log(this.recordToSubmit.aceptaComer30m)
        console.log(this.condiciones)
        //     if (!acepta) result = false;
        // }
    },

    alerta1(tit, mens) {
        this.$q.dialog({
            title: tit,
            message: mens
        })
    },

    // comer30(){
    //     this.recordToSubmit.aceptaCambioHorario = false
    //     if(this.recordToSubmit.aceptaComer30m) {
    //         this.recordToSubmit.aceptaCambioHorario = true
    //         this.recordToSubmit.aceptaComer30m = true
    //     }
    // },

    solicitarCambioHorario(){
        if (!this.checkComer30) {
            this.recordToSubmit.aceptaComer30m = false
        }

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
            idAutorizadorOf: this.responsable,
            nuevaVersion: true,
            observaciones: '',
            sfechaDesde: null,
            sfechaHasta: null,
            tipoDiaLibre: 0,
            tipoSolicitud: 'CAMBIO HORARIO'
        }
        
        this.$axios.post(`bd_jpersonal.asp?action=soldias/&auth=${this.user.auth}`, data)
        .then(result => {
            this.$q.notify({
            color: 'primary',
            message: `Se ha solicitado un cambio de horario.`
      })
        })
        .catch(error => { console.log(error.message) })
        this.dialogMes = true

        let datos = {
          to: this.user.pers.emailAutorizador,
          from: 'edicom@edicom.es',
          subject: 'Nueva Solicitud de CAMBIO HORARIO de ' + this.user.pers.nombre,
          text: 'Nueva solicitud de CAMBIO HORARIO de: ' + this.user.pers.nombre + '\n\n' + 'Datos de Solicitud: \n Hora Entrada 1: ' + 
            date.formatDate(date.extractDate(this.recordToSubmit.horaEntrada1,'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
            ' Hora Salida 1: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaSalida1,'YYYY-MM-DDTHH:mm'), 'HH:mm') +
            '\n Hora Entrada 2: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaEntrada2,'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
            ' Hora Salida 2: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaSalida2,'YYYY-MM-DDTHH:mm'), 'HH:mm') +
            '\n Hora Entrada 3: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaEntrada3,'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
            ' Hora Salida 3: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaSalida3,'YYYY-MM-DDTHH:mm'), 'HH:mm') +
            '\n Hora Entrada 4: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaEntrada4,'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
            ' Hora Salida 4: ' + date.formatDate(date.extractDate(this.recordToSubmit.horaSalida4,'YYYY-MM-DDTHH:mm'), 'HH:mm') +
            '\n\nRevísala cuando puedas para su aprobación \nSaludos'
        }
        this.sendMail(datos)
        
    },

    formatTime(time){
        if(time !== null && time !== '') return date.formatDate(date.extractDate(time,'YYYY-MM-DDTHH:mm'), 'HH:mm')
    },

    ajustarFechaHora(pdate){
        var d1 = date.extractDate(pdate,'YYYY-MM-DDTHH:mm')
        d1 = new Date(2008,0,1, d1.getHours(), d1.getMinutes()) // el backend trabaja con 2008-1-1THH:mm
        return date.formatDate(d1, 'YYYY-MM-DDTHH:mm:ss')
    },
    
    cargarHoras(res){
        this.recordToSubmit.horaEntrada1 = res.horaEntrada1
        this.recordToSubmit.horaSalida1 = res.horaSalida1
        this.recordToSubmit.horaEntrada2 = res.horaEntrada2 
        this.recordToSubmit.horaSalida2 = res.horaSalida2
        this.recordToSubmit.horaEntrada3 = res.horaEntrada3 
        this.recordToSubmit.horaSalida3 = res.horaSalida3
        this.recordToSubmit.horaEntrada4 = res.horaEntrada4
        this.recordToSubmit.horaSalida4 = res.horaSalida4 
    }
  },

  mounted(){
      this.loadDetalleEmpleado(this.user.pers.id)
       .then(response => {
         this.jornadaEmpl = Object.assign({}, response.data.jornada) 
         this.cargarHoras(response.data)
         this.calculoHorasSem()
       })
        
       this.calcularResponsable({ id: this.user.pers.id, tipoSol: 2 })
       .then(response => {
        this.responsable = JSON.parse(response.data.msg).idResp[0]
        })
      .catch(error => {
        console.log('calcularResponsable', error);
      })
 },

  computed:{
    ...mapState('login', ['user'])
  }
}
</script>