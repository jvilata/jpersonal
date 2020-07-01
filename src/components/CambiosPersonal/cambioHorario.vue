<!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div>
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
        <div class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row justify-center" style="max-height: 50px">
                    <div class="column q-pr-md q-mt-sm" style="max-width: 150px">
                        <q-input filled v-model="sumaHoras" label="Horas Semanales"></q-input>
                    </div>
                    <div class="column q-mt-sm" style="max-width: 150px">
                        <q-btn push color="primary" label="Solicitar Cambio Horario" style="max-height: 50px"/>
                    </div>
            </div>
            <div class="row q-mb-sm">
                <!-- <q-checkbox
                    @click="openDialog = true"
                    v-model="customModel"
                    color="secondary"
                    label="Acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento, y para que surta efecto es indispensable obtener la correspondiente autorización de su responsable. Acepto que por la misma razón, también es el responsable del departamento quien puede establecer los límites de aplicación con carácter general en su ámbito, así como modificar, revocar o suspender las autorizaciones existentes cuando así lo considere con la debida antelación."
                    true-value="yes"
                    false-value="no"
                /> -->
                <q-btn label="Fixed size" color="primary" @click="fixed = true" />
                <q-dialog v-model="openDialog">
                    <q-card>
                        <q-card-section>
                            <div class="text-h6">Terms of Agreement</div>
                        </q-card-section>

                        <q-separator />

                        <q-card-section style="max-height: 50vh" class="scroll">
                        <p v-for="n in 15" :key="n">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="right">
                        <q-btn flat label="Decline" color="primary" v-close-popup />
                        <q-btn flat label="Accept" color="primary" v-close-popup />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
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
      customModel: 'no',
      sumaHoras: 0,
      openDialog: false
    }
  }
}
</script>