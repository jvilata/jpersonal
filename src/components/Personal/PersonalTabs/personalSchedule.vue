<template>
   
   <div :style="screen=='sqScreen' ? 'height: calc(100vh - 227px)' : screen=='fullScreen' ? 'height: calc(100vh - 283px)' : 'height: calc(100vh - 207px)'">
       
    <q-card flat>
      <q-card-section  class="q-pt-md q-pl-xs q-pr-xs">
        <div class="text-subtitle1 text-bold text-center">Horario de Lunes - Jueves:</div>
        <div class="row q-mb-sm">
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaEntrada1)" label="Hora Entrada 1" class="col-xs-6 col-sm-3" />
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaSalida1)" label="Hora Salida 1" class="col-xs-6 col-sm-3" />
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaEntrada2)" label="Hora Entrada 2" class="col-xs-6 col-sm-3 q-pt-md" />
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaSalida2)" label="Hora Salida 2" class="col-xs-6 col-sm-3 q-pt-md" />
        </div>
      </q-card-section>
    </q-card>
    <q-card flat>
      <q-card-section  class="q-pt-md q-pl-xs q-pr-xs">
        <div class="text-subtitle1 text-bold text-center">Horario de Viernes:</div>
        <div class="row q-mb-sm">
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaEntrada3)" label="Hora Entrada 3" class="col-xs-6 col-sm-3" />
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaSalida3)" label="Hora Salida 3" class="col-xs-6 col-sm-3" />
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaEntrada4)" label="Hora Entrada 4" class="col-xs-6 col-sm-3 q-pt-md" />
          <q-input outlined readonly :value="formatTime(recordToSubmit.horaSalida4)" label="Hora Salida 4" class="col-xs-6 col-sm-3 q-pt-md" />
        </div>
      </q-card-section>
    </q-card>
    <div class="row justify-center text-center q-pt-lg q-pb-lg" >
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
import { date } from 'quasar'

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      recordToSubmit: { }
    }
  },
  computed: {
    ...mapState('login', ['user', 'screen'])
  },
  methods: {
    ...mapActions('empleados', ['loadDetalleEmpleado']),
    ...mapActions('tabs', ['addTab']),
    openForm (link) {
      this.addTab(['cambioHorario', 'Cambio Horario', {}, 1])
    },
    formatTime(time){
      if(time !== '') {
        time = date.extractDate(time, 'YYYY-MM-DDTHH:mm:ss')
        return date.formatDate(time, 'HH:mm')
      }
    }
  },
  mounted () {
    //Llamaremos al BACKEND para pedir datos de este usuario 
    this.$q.loading.show() 
      this.loadDetalleEmpleado(this.user.pers.id)
       .then(response => {
         this.timer = setTimeout(() => {
              this.$q.loading.hide()
              this.timer = void 0
            }, 250) 
         this.recordToSubmit = Object.assign({}, response.data) 
       })
  },
  beforeMount(){
    this.$q.loading.show() 
  }
}
</script>