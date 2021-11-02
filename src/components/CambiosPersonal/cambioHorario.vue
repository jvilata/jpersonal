<!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div :style="screen=='sqScreen' ? 'height: calc(100vh - 130px)' : screen=='fullScreen' ? 'height: calc(100vh - 186px)' : 'height: calc(100vh - 110px)'">
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
            <div class="text-subtitle1 text-bold text-center q-pt-sm">Lunes:</div>
            <div class="row q-mb-sm">
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada1)"
                    @input="v => recordToSubmit.horaEntrada1=v"
                    label="Hora Entrada 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida1)"
                    @input="v => recordToSubmit.horaSalida1=v"
                    label="Hora Salida 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada2)"
                    @input="v => recordToSubmit.horaEntrada2=v"
                    label="Hora Entrada 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                    <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida2)"
                    @input="v => recordToSubmit.horaSalida2=v"
                    label="Hora Salida 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
            </div>
            <div class="text-subtitle1 text-bold text-center q-pt-sm">Martes:</div>
            <div class="row q-mb-sm">
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada5)"
                    @input="v => recordToSubmit.horaEntrada5=v"
                    label="Hora Entrada 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qEnt5" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qEnt5.hide(); recordToSubmit.horaEntrada5 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaEntrada5"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida5)"
                    @input="v => recordToSubmit.horaSalida5=v"
                    label="Hora Salida 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qSal5" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qSal5.hide(); recordToSubmit.horaSalida5 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaSalida5"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada6)"
                    @input="v => recordToSubmit.horaEntrada6=v"
                    label="Hora Entrada 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qEnt6" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qEnt6.hide(); recordToSubmit.horaEntrada6 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaEntrada6"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida6)"
                    @input="v => recordToSubmit.horaSalida6=v"
                    label="Hora Salida 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qSal6" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qSal6.hide(); recordToSubmit.horaSalida6 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaSalida6"
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
            <div class="text-subtitle1 text-bold text-center q-pt-sm">Miércoles:</div>
            <div class="row q-mb-sm">
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada7)"
                    @input="v => recordToSubmit.horaEntrada7=v"
                    label="Hora Entrada 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qEnt7" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qEnt7.hide(); recordToSubmit.horaEntrada7 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaEntrada7"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida7)"
                    @input="v => recordToSubmit.horaSalida7=v"
                    label="Hora Salida 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qSal7" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qSal7.hide(); recordToSubmit.horaSalida7 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaSalida7"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada8)"
                    @input="v => recordToSubmit.horaEntrada8=v"
                    label="Hora Entrada 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qEnt8" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qEnt8.hide(); recordToSubmit.horaEntrada8 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaEntrada8"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida8)"
                    @input="v => recordToSubmit.horaSalida8=v"
                    label="Hora Salida 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qSal8" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qSal8.hide(); recordToSubmit.horaSalida8 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaSalida8"
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
             <div class="text-subtitle1 text-bold text-center q-pt-sm">Jueves:</div>
            <div class="row q-mb-sm">
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada9)"
                    @input="v => recordToSubmit.horaEntrada9=v"
                    label="Hora Entrada 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qEnt9" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qEnt9.hide(); recordToSubmit.horaEntrada9 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaEntrada9"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida9)"
                    @input="v => recordToSubmit.horaSalida9=v"
                    label="Hora Salida 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qSal9" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qSal9.hide(); recordToSubmit.horaSalida9 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaSalida9"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaEntrada10)"
                    @input="v => recordToSubmit.horaEntrada10=v"
                    label="Hora Entrada 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qEnt10" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qEnt10.hide(); recordToSubmit.horaEntrada10 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaEntrada10"
                                :hour-options="hourOptions"
                                :minute-options="minuteOptions"
                                :second-options="secondOptions"
                                mask="YYYY-MM-DDTHH:mm"
                                format24h />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input
                    @blur="calculoHorasSem()"
                    outlined
                    clearable
                    stack-label
                    :value="formatTime(recordToSubmit.horaSalida10)"
                    @input="v => recordToSubmit.horaSalida10=v"
                    label="Hora Salida 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
                    <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy ref="qSal10" transition-show="scale" transition-hide="scale">
                                <q-time
                                @input="v => { $refs.qSal10.hide(); recordToSubmit.horaSalida10 = ajustarFechaHora(v) }"
                                v-model="recordToSubmit.horaSalida10"
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
            <div class="text-subtitle1 text-bold text-center q-pt-sm">Viernes:</div>
            <div class="row q-mb-sm">
                <q-input 
                    outlined 
                    clearable 
                    :value="formatTime(recordToSubmit.horaEntrada3)" 
                    @blur="calculoHorasSem()"
                    @input="v => recordToSubmit.horaEntrada3 = v"
                    label="Hora Entrada 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                <q-input 
                    outlined 
                    clearable 
                    :value="formatTime(recordToSubmit.horaSalida3)"
                    @blur="calculoHorasSem()"
                    @input="v => recordToSubmit.horaSalida3 = v"
                     label="Hora Salida 1"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                <q-input 
                    outlined 
                    clearable 
                    :value="formatTime(recordToSubmit.horaEntrada4)" 
                    @blur="calculoHorasSem()"
                    @input="v => recordToSubmit.horaEntrada4= v"
                    label="Hora Entrada 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                <q-input 
                    outlined 
                    clearable
                    @input="v => recordToSubmit.horaSalida4 = v"
                    :value="formatTime(recordToSubmit.horaSalida4)"
                    @blur="calculoHorasSem()" 
                    label="Hora Salida 2"
                    class="col-xs-6 col-sm-3 q-pr-xs">
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
                <div class="row justify-center" style="max-height: 60px">
                    <div class="column q-pr-sm q-mt-sm" style="max-width: 150px">
                        <q-input filled v-model="sumaHoras" label="Horas Semanales"></q-input>
                    </div>
                    <div class="column q-mt-sm" style="max-width: 150px">
                        <q-btn @click="solicitarCambioHorario"  color="primary" label="Solicitar Cambio Horario" :disable="disableBut"/>
                    </div>
                    <q-dialog v-model="dialogMes" @click="$emit('close')" >
                        <q-icon color="green" name="check_circle" size="100px"  @click="$emit('close')" />
                    </q-dialog>
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
                horaEntrada5: '',
                horaSalida5: '',
                horaEntrada6: '',
                horaSalida6: '',
                horaEntrada7: '',
                horaSalida7: '',
                horaEntrada8: '',
                horaSalida8: '',
                horaEntrada9: '',
                horaSalida9: '',
                horaEntrada10: '',
                horaSalida10: '',
                aceptaCambioHorario: false,
                aceptaComer30m: true //inicializamos a true - más fácil (luego cuando el usuario introduce horas si el descanso es de 30min 
                //se visualizará el checkbox correspondiente (checkComer30) y se pone a false
            },
            hourOptions: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ],
            minuteOptions: [ 0, 30 ],
            secondOptions: [ 0, 10, 20, 30, 40, 50 ],
            sumaHoras: 0,
            checkComer30: false, //el checkbox de comer en 30m SOLO aparece si el usuario introduce un horario cuyo descanso es de 30 mins
            jornadaEmpl: 0,
            disableBut: true, //Boton de SOLICITAR CAMBIO HORA: inicialmente deshabilitado (no se puede pulsar)
            condiciones: true,
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

        checkBut() {
            //Me aseguro de que el botón estña deshabilitado hasta que los checks estén pulsados o se cumplan las condiciones de JORNADA
            this.disableBut = true
            if (this.recordToSubmit.aceptaCambioHorario && this.condiciones) {
                if (!this.checkComer30) { //Usuario no ha introducido diferencia de 30min (descanso superior) no se visulaiza check
                    this.disableBut = false
                } else if (this.recordToSubmit.aceptaComer30m) { //se visualiza el check entonces tenemos que comprobar si el usuario ha aceptado explícitamente
                    this.disableBut = false
                }
            }
        },

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
            this.condiciones = true;
            //Para que no hayan problemas al calcular diferencias entre horas inicializo todos los campos 
            if (this.recordToSubmit.horaEntrada1 === null || this.recordToSubmit.horaEntrada1 === '') this.recordToSubmit.horaEntrada1 = this.recordToSubmit.horaSalida1;
            if (this.recordToSubmit.horaSalida1 === null  || this.recordToSubmit.horaSalida1 === '') this.recordToSubmit.horaSalida1 = this.recordToSubmit.horaEntrada1;
            if (this.recordToSubmit.horaEntrada2 === null  || this.recordToSubmit.horaEntrada2 === '') this.recordToSubmit.horaEntrada2 = this.recordToSubmit.horaSalida2;
            if (this.recordToSubmit.horaSalida2 === null  || this.recordToSubmit.horaSalida2 === '') this.recordToSubmit.horaSalida2 = this.recordToSubmit.horaEntrada2;
            if (this.recordToSubmit.horaEntrada3 === null || this.recordToSubmit.horaEntrada3 === '') this.recordToSubmit.horaEntrada3 = this.recordToSubmit.horaSalida3;
            if (this.recordToSubmit.horaSalida3 === null || this.recordToSubmit.horaSalida3 === '') this.recordToSubmit.horaSalida3 = this.recordToSubmit.horaEntrada3;
            if (this.recordToSubmit.horaEntrada4 === null || this.recordToSubmit.horaEntrada4 === '') this.recordToSubmit.horaEntrada4 = this.recordToSubmit.horaSalida4;
            if (this.recordToSubmit.horaSalida4 === null || this.recordToSubmit.horaSalida4 === '') this.recordToSubmit.horaSalida4 = this.recordToSubmit.horaEntrada4;
            if (this.recordToSubmit.horaEntrada5 === null || this.recordToSubmit.horaEntrada5 === '') this.recordToSubmit.horaEntrada5 = this.recordToSubmit.horaSalida5;
            if (this.recordToSubmit.horaSalida5 === null  || this.recordToSubmit.horaSalida5 === '') this.recordToSubmit.horaSalida5 = this.recordToSubmit.horaEntrada5;
            if (this.recordToSubmit.horaEntrada6 === null  || this.recordToSubmit.horaEntrada6 === '') this.recordToSubmit.horaEntrada6 = this.recordToSubmit.horaSalida6;
            if (this.recordToSubmit.horaSalida6 === null  || this.recordToSubmit.horaSalida6 === '') this.recordToSubmit.horaSalida6 = this.recordToSubmit.horaEntrada6;
            if (this.recordToSubmit.horaEntrada7 === null || this.recordToSubmit.horaEntrada7 === '') this.recordToSubmit.horaEntrada7 = this.recordToSubmit.horaSalida7;
            if (this.recordToSubmit.horaSalida7 === null || this.recordToSubmit.horaSalida7 === '') this.recordToSubmit.horaSalida7 = this.recordToSubmit.horaEntrada7;
            if (this.recordToSubmit.horaEntrada8 === null || this.recordToSubmit.horaEntrada8 === '') this.recordToSubmit.horaEntrada8 = this.recordToSubmit.horaSalida8;
            if (this.recordToSubmit.horaSalida8 === null || this.recordToSubmit.horaSalida8 === '') this.recordToSubmit.horaSalida8 = this.recordToSubmit.horaEntrada8;
            if (this.recordToSubmit.horaEntrada9 === null || this.recordToSubmit.horaEntrada9 === '') this.recordToSubmit.horaEntrada9 = this.recordToSubmit.horaSalida9;
            if (this.recordToSubmit.horaSalida9 === null || this.recordToSubmit.horaSalida9 === '') this.recordToSubmit.horaSalida9 = this.recordToSubmit.horaEntrada9;
            if (this.recordToSubmit.horaEntrada10 === null || this.recordToSubmit.horaEntrada10 === '') this.recordToSubmit.horaEntrada10 = this.recordToSubmit.horaSalida10;
            if (this.recordToSubmit.horaSalida10 === null || this.recordToSubmit.horaSalida10 === '') this.recordToSubmit.horaSalida10 = this.recordToSubmit.horaEntrada10;


            let sum1 = 0
            let sum2 = 0
            let sum3 = 0
            let sum4 = 0
            let sum5 = 0
            let sum6 = 0
            let sum7 = 0
            let sum8 = 0
            let sum9 = 0
            let sum10 = 0
            let unit = 'minutes'
            // LUNES
            var horasArray = [this.recordToSubmit.horaEntrada1, this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada2, this.recordToSubmit.horaSalida2]
            for( var i = 0; i < horasArray.length ; i+=2 ) {
                if(horasArray[i] !== null && horasArray[i] !== '') {
                    if(horasArray[i] > horasArray[i+1]) { 
                        horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) 
                    }
                    diff = Math.abs(date.getDateDiff(horasArray[i+1], horasArray[i], unit))/60.0
                    if(diff > 24) diff = 0
                    if(i === 0) sum1 = diff //sum1 es mañana
                    if(i === 2) sum2 = diff //sum2 es tarde
                }
            }
            // MARTES
            horasArray = [this.recordToSubmit.horaEntrada5, this.recordToSubmit.horaSalida5, this.recordToSubmit.horaEntrada6, this.recordToSubmit.horaSalida6]
            for( var i = 0; i < horasArray.length ; i+=2 ) {
                if(horasArray[i] !== null && horasArray[i] !== '') {
                    if(horasArray[i] > horasArray[i+1]) { 
                        horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) 
                    }
                    diff = Math.abs(date.getDateDiff(horasArray[i+1], horasArray[i], unit))/60.0
                    if(diff > 24) diff = 0
                    if(i === 0) sum5 = diff //sum1 es mañana
                    if(i === 2) sum6 = diff //sum2 es tarde
                }
            }
             // MIERCOLES
            horasArray = [this.recordToSubmit.horaEntrada7, this.recordToSubmit.horaSalida7, this.recordToSubmit.horaEntrada8, this.recordToSubmit.horaSalida8]
            for( var i = 0; i < horasArray.length ; i+=2 ) {
                if(horasArray[i] !== null && horasArray[i] !== '') {
                    if(horasArray[i] > horasArray[i+1]) { 
                        horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) 
                    }
                    diff = Math.abs(date.getDateDiff(horasArray[i+1], horasArray[i], unit))/60.0
                    if(diff > 24) diff = 0
                    if(i === 0) sum7 = diff //sum1 es mañana
                    if(i === 2) sum8 = diff //sum2 es tarde
                }
            }
              // JUEVES
            horasArray = [this.recordToSubmit.horaEntrada9, this.recordToSubmit.horaSalida9, this.recordToSubmit.horaEntrada10, this.recordToSubmit.horaSalida10]
            for( var i = 0; i < horasArray.length ; i+=2 ) {
                if(horasArray[i] !== null && horasArray[i] !== '') {
                    if(horasArray[i] > horasArray[i+1]) { 
                        horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) 
                    }
                    diff = Math.abs(date.getDateDiff(horasArray[i+1], horasArray[i], unit))/60.0
                    if(diff > 24) diff = 0
                    if(i === 0) sum9 = diff //sum1 es mañana
                    if(i === 2) sum10 = diff //sum2 es tarde
                }
            }
            // VIERNES
            horasArray = [this.recordToSubmit.horaEntrada3, this.recordToSubmit.horaSalida3, this.recordToSubmit.horaEntrada4, this.recordToSubmit.horaSalida4 ]
            for(var  i = 0; i < horasArray.length ; i+=2 ) {
                if(horasArray[i] !== null && horasArray[i] !== '') {
                    if(horasArray[i] > horasArray[i+1]) { 
                        horasArray[i+1] = date.addToDate(horasArray[i+1], { days: 1}) 
                    }
                    diff = date.getDateDiff(horasArray[i+1], horasArray[i], unit)/60.0
                    if (diff > 24) diff = 0
                    if(i === 0) sum3 = diff //sum3 es mañana
                    if(i === 2) sum4 = diff //sum4 es tarde
                }
            } 
            this.sumaHoras += (sum1 + sum2 + sum3 + sum4 + sum5 + sum6 + sum7 + sum8 + sum9 + sum10) //Sumatorio de las horas.
            //aceptar comer en 30 min
            var com1 = Math.abs(date.getDateDiff(this.recordToSubmit.horaEntrada2, this.recordToSubmit.horaSalida1, unit))
            var com2 = Math.abs(date.getDateDiff(this.recordToSubmit.horaEntrada4, this.recordToSubmit.horaSalida3, unit))
            var com3 = Math.abs(date.getDateDiff(this.recordToSubmit.horaEntrada6, this.recordToSubmit.horaSalida5, unit))
            var com4 = Math.abs(date.getDateDiff(this.recordToSubmit.horaEntrada8, this.recordToSubmit.horaSalida7, unit))
            var com5 = Math.abs(date.getDateDiff(this.recordToSubmit.horaEntrada10, this.recordToSubmit.horaSalida9, unit))

           
             if (this.recordToSubmit.horaEntrada2 !== null && this.recordToSubmit.horaSalida1 !== null) 
             //diferencia entre horaEntrada2 y horaSalida1 --> DESCANSO PARA COMER
                com1 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida1, this.recordToSubmit.horaEntrada2, unit))
                if (com1 <= 0 || com5 <=0 || com3 <=0 || com4 <=0) { // no cumple descanso minimo (o no hay)
                     this.condiciones = false
                    this.alerta1('Alerta Descanso Mínimo:', 'Horario no permitido')
                } 
                else { this.condiciones = true }
            if (this.recordToSubmit.horaEntrada4 !== null && this.recordToSubmit.horaSalida3 !== null)    
                com2 = Math.abs(date.getDateDiff(this.recordToSubmit.horaSalida3, this.recordToSubmit.horaEntrada4, unit))
                if (com2 <= 0) { // no cumple descanso minimo (o no hay)
                     this.condiciones = false
                    this.alerta1('Alerta Descanso Mínimo:', 'Horario no permitido')
                } 
                else { this.condiciones = true }
             if ((com1>0 && com1<=45) || (com2>0 && com2<=45) || (com3>0 && com3<=45) || (com4>0 && com4<=45) || (com5>0 && com5<=45)) {
                this.checkComer30 = true //se visualiza el checkbox 
                this.recordToSubmit.aceptaComer30m = false //Habíamos inicializado a true hasta que se visualizase el checkbo
            }else{
                this.checkComer30 = false
            }
            if(this.jornadaEmpl >= 100){ //Empleado a jornada completa 
                if (sum1 === 0 || sum2 === 0 || sum3 === 0 || sum5 === 0 
					|| sum6 === 0 || sum7 === 0 || sum8 === 0 || sum9 === 0 || sum10 === 0) { 
                    this.alerta1('Atención: Jornada', 'Alguna jornada suma más de 24hrs')
                    this.condiciones = false
                }
                else {
                    if (sum1 + sum2 > 9 || sum1 + sum2 < 8 || sum5 + sum6 > 9 || sum5 + sum6 < 8 
						|| sum7 + sum8 > 9 || sum7 + sum8 < 8 || sum9 + sum10 > 9 || sum9 + sum10 < 8) { 
                        this.alerta1('Atención: Jornada', 'No se permite una jornada laboral de Lunes a Jueves inferior a 8h ni superior a 9h');
                        this.condiciones = false
                    } else
                        if (sum3 + sum4 > 9 || sum1 + sum2 < 5) {
                            this.alerta1('Atención: Jornada', 'No se permite una jornada laboral de Viernes inferior a 5h ni superior a 9h')
                            this.condiciones = false
                        } else
                            if (this.sumaHoras > 40 || this.sumaHoras < 30) { //de toda la semana
                                this.alerta1('Atención: Jornada', 'No se permite jornada laboral semanal superior a 40h o inferior a 30h.')
                                this.condiciones = false
                            } else {
                                if (sum1 > 6 || sum2 > 6 || sum3 > 6 || sum4 > 6 || sum5 > 6 || sum6 > 6 || sum7 > 6 || sum8 > 6 || sum9 > 6 || sum10 > 6) {
                                    this.condiciones = true
                                    this.alerta1('Atención: Jornada', 'Para jornadas superiores a 6h hay que estipular una parada de al menos 15m. Consulta con tu responsable')
                                }  
                                if ( this.sumaHoras < 40) {
                                    this.alerta1('Atención: Jornada', 'La jornada laboral es inferior a 40h. Comprueba que es correcto.')
                                    this.condiciones = true
                                } 
                            }
                }
            } 
        },

        alerta1(tit, mens) {
            this.$q.dialog({
                title: tit,
                message: mens
            })
        },

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
                fechaAplicacionCambio: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
                fechaSolicitud: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
                idAutorizadorOf: this.responsable,
                nuevaVersion: true,
                observaciones: '',
                sfechaDesde: null,
                sfechaHasta: null,
                tipoDiaLibre: 0,
                tipoSolicitud: 'CAMBIO HORARIO'
            }
            if(this.condiciones) {
                this.$q.loading.show()
                this.$axios.post(`bd_jpersonal.asp?action=soldias&auth=${this.user.auth}`, data)
                .then(result => {
                    this.$q.loading.hide()
                   this.dialogMes = true
                    this.$q.notify({
                    message: `Se ha solicitado un cambio de horario.`
                    })
                     this.timer = setTimeout(() => {
                        this.$emit('close')
                    }, 1000)
                    
                })
                .catch(error => { console.log(error.message) })
            } else { 
                this.alerta1('Atención:' , 'Asegúrese de cumplir todas las condiciones de jornada')
            }
            
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
            this.recordToSubmit.horaEntrada5 = res.horaEntrada5
            this.recordToSubmit.horaSalida5 = res.horaSalida5
            this.recordToSubmit.horaEntrada6 = res.horaEntrada6
            this.recordToSubmit.horaSalida6 = res.horaSalida6
            this.recordToSubmit.horaEntrada7 = res.horaEntrada7 
            this.recordToSubmit.horaSalida7 = res.horaSalida7
            this.recordToSubmit.horaEntrada8 = res.horaEntrada8
            this.recordToSubmit.horaSalida8 = res.horaSalida8 
             this.recordToSubmit.horaEntrada9 = res.horaEntrada9 
            this.recordToSubmit.horaSalida9 = res.horaSalida9
            this.recordToSubmit.horaEntrada10 = res.horaEntrada10
            this.recordToSubmit.horaSalida10 = res.horaSalida10 
        }
    },

    mounted(){
        console.log('sc', this.screen)
        this.loadDetalleEmpleado(this.user.pers.id)
        .then(response => {
            this.jornadaEmpl = response.data.jornada 
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
        ...mapState('login', ['user', 'screen'])
    }
}
</script>
