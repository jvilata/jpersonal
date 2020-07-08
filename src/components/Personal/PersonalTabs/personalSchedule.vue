<template>
   
   <div style="height: calc(100vh - 200px)">
       
    <q-card flat>
      <q-card-section  class="q-pt-md q-pl-xs q-pr-xs">
        <div class="text-subtitle1 text-bold text-center">Horario de Lunes - Jueves:</div>
        <div class="row q-mb-sm">
          <q-input outlined v-model="recordToSubmit.horaentrada1" label="Hora Entrada 1" class="col-xs-6 col-sm-3" />
          <q-input outlined v-model="recordToSubmit.horasalida1" label="Hora Salida 1" class="col-xs-6 col-sm-3" />
          <q-input outlined v-model="recordToSubmit.horaentrada2" label="Hora Entrada 2" class="col-xs-6 col-sm-3 q-pt-md" />
          <q-input outlined v-model="recordToSubmit.horasalida2" label="Hora Salida 2" class="col-xs-6 col-sm-3 q-pt-md" />
        </div>
      </q-card-section>
    </q-card>
    <q-card flat>
      <q-card-section  class="q-pt-md q-pl-xs q-pr-xs">
        <div class="text-subtitle1 text-bold text-center">Horario de Viernes:</div>
        <div class="row q-mb-sm">
          <q-input outlined v-model="recordToSubmit.horaentrada3" label="Hora Entrada 3" class="col-xs-6 col-sm-3" />
          <q-input outlined v-model="recordToSubmit.horasalida3" label="Hora Salida 3" class="col-xs-6 col-sm-3" />
          <q-input outlined v-model="recordToSubmit.horaentrada4" label="Hora Entrada 4" class="col-xs-6 col-sm-3 q-pt-md" />
          <q-input outlined v-model="recordToSubmit.horasalida4" label="Hora Salida 4" class="col-xs-6 col-sm-3 q-pt-md" />
        </div>
      </q-card-section>
    </q-card>
    <div class="row justify-center text-center q-pt-lg" >
      <q-btn
        @click="openForm('cambioHorario')"
        color="primary" 
        label="Cambiar Horario" 
        style="height: 60px"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      recordToSubmit: {
        id: -1
      }
    }
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    openForm (link) {
      this.addTab(['cambioHorario', 'Cambio Horario', {}, 1])
    }
  },
  mounted () {
    this.recordToSubmit = Object.assign({}, this.value) // v-model: en 'value' podemos leer el valor del v-model
  }
}
</script>