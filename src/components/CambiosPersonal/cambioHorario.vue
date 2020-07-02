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
                  CAMBIO HORARIO
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
        <q-card>
            <q-form @submit="updateRecord" @keyup.esc="$emit('close')">   
                <div class="q-pa-md">
                    <div class="q-gutter-md">
                        <div class="text-subtitle1 text-bold text-center">Horario de Lunes - Jueves:</div>
                            <div class="row q-mb-sm">
                                <div class="col q-mb-sm text-subtitle2">Hora Entrada 1
                                    <q-input filled v-model="hEntrada1" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt1" transition-show="scale" transition-hide="scale">
                                            <q-time 
                                                @input="$refs.qEnt1.hide()"
                                                v-model="hEntrada1"
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
                                    <q-input filled v-model="hSalida1">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal1" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal1.hide()"
                                                v-model="hSalida1"
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
                                    <q-input filled v-model="hEntrada2" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt2" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qEnt2.hide()"
                                                v-model="hEntrada2"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 2
                                    <q-input filled v-model="hSalida2">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal2" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal2.hide()"
                                                v-model="hSalida2"
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
            </q-form>
        </q-card>
        <q-card>
            <q-form @submit="updateRecord" @keyup.esc="$emit('close')">   
                <div class="q-pa-md">
                    <div class="q-gutter-md">
                        <div class="text-subtitle1 text-bold text-center">Horario de Viernes:</div>
                            <div class="row q-mb-sm">
                                <div class="col q-mb-sm text-subtitle2">Hora Entrada 3
                                    <q-input filled v-model="hEntrada3" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt3" transition-show="scale" transition-hide="scale">
                                            <q-time 
                                                @input="$refs.qEnt3.hide()"
                                                v-model="hEntrada3"
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
                                    <q-input filled v-model="hSalida3">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal3" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal3.hide()"
                                                v-model="hSalida3"
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
                                    <q-input filled v-model="hEntrada4" class="q-pr-xs">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qEnt4" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qEnt4.hide()"
                                                v-model="hEntrada4"
                                                :hour-options="hourOptions"
                                                :minute-options="minuteOptions"
                                                :second-options="secondOptions" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col q-mb-sm text-subtitle2">Hora Salida 4
                                    <q-input filled v-model="hSalida4">
                                        <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy ref="qSal4" transition-show="scale" transition-hide="scale">
                                            <q-time
                                                @input="$refs.qSal4.hide()"
                                                v-model="hSalida4"
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
            </q-form>
        </q-card>
     <q-card>
        <div class="q-pa-sm q-pl-xs q-pr-xs">
            <div class="row justify-center" style="max-height: 70px">
                    <div class="column q-pr-md q-mt-sm" style="max-width: 150px">
                        <q-input filled v-if="val" v-model="sumaHoras" label="Horas Semanales"></q-input>
                        <!-- <template v-slot:hint>
                        Field hint
                        </template> -->
                    </div>
                    <div class="column q-mt-sm" style="max-width: 150px">
                        <q-btn :disabled="!val ? !disabled : disabled" @click="calculoHorasSem" color="primary" label="Solicitar Cambio Horario" style="max-height: 50px"/>
                    </div>
            </div>
            <div class="row items-baseline q-my-md">
                <div class="col-xs-9">
                    <q-checkbox
                        v-model="val"
                        color="primary"
                        label="Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento..."
                        />
                </div>
                <div class="col-xs-3">
                    <span @click="confirm" class="text-primary text-align-right q-pl-sm">Leer Más</span>
                </div>
                
            </div>
        </div>
    </q-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      hEntrada1: '08:30',
      hSalida1: '13:30',
      hEntrada2: '15:30',
      hSalida2: '19:00',
      hEntrada3: '08:00',
      hSalida3: '15:30',
      hEntrada4: '00:00',
      hSalida4: '00:00',
      hourOptions: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ],
      minuteOptions: [ 0, 30 ],
      secondOptions: [ 0, 10, 20, 30, 40, 50 ],
      val: false,
      sumaHoras: 0,
      openDialog: false
    }
  },
  methods: {
      confirm () {
      this.$q.dialog({
        title: 'Aceptación conciliación laboral',
        message: 'Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento, y para que surta efecto es indispensable obtener la correspondiente autorización de su responsable. Acepto que por la misma razón, también es el responsable del departamento quien puede establecer los límites de aplicación con carácter general en su ámbito, así como modificar, revocar o suspender las autorizaciones existentes cuando así lo considere con la debida antelación.',
        cancel: true,
        persistent: true
      }).onOk(() => {
        
       this.val = true
        console.log(this.val)

      }).onOk(() => {
        // console.log('>>>> second OK catcher')
        val = true
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    calculoHorasSem() {
        this.sumaHoras = 0;
        var horasArray = [this.hEntrada1, this.hSalida1, this.hEntrada2, this.hSalida2, this.hEntrada3, this.hSalida3, this.hEntrada4, this.hSalida4 ];
        console.log(this.hEntrada1);
        var horasArrayNumerico = [];
        var i;
        var j=1;
        for( i = 0; j < horasArray.length; i+=2 ) {
            horasArrayNumerico[i] = parseInt(horasArray[i], 10);
            horasArrayNumerico[j] = parseInt(horasArray[j], 10);
            this.sumaHoras += horasArrayNumerico[j] - horasArrayNumerico[i];
            j += 2
        }
        // const reducer = (accumulator, currentValue) => accumulator + currentValue;
        // this.sumaHoras = horasArrayNumerico.reduce(reducer);
        console.log(this.sumaHoras);
    }

  }
}
</script>