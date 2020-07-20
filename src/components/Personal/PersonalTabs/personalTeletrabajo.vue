<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <q-card flat>
      <div class="row q-pa-sm items-baseline" style="max-width: 380px">
          <div class="col-xs-4">Fecha Desde</div>
          <div class="col-xs-8">
              <q-input filled readonly :value="formatDate(recordToSubmit.teletrabajoFechaDesde)">
              <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="recordToSubmit.teletrabajoFechaDesde" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                  </q-icon>  
              </template>
              </q-input>
          </div>
      </div>
      <div class="row q-pa-sm items-baseline" style="max-width: 380px">
            <div class="col-xs-4">Fecha Hasta</div>
            <div class="col-xs-8">
              <q-input filled readonly :value="formatDate(recordToSubmit.teletrabajoFechaHasta)">
              <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="recordToSubmit.teletrabajoFechaHasta" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                  </q-icon>
              </template>
              </q-input>
            </div>
      </div>
      <div class="col-xs-12 q-pa-sm" style="max-width: 380px">
        <q-input readonly v-model="recordToSubmit.teletrabajoObservaciones" label="Observaciones" autogrow @keyup.enter.stop />
      </div>
      <div class="row justify-center text-center q-pt-xl">
        <q-btn
          @click="openForm('teletrabajo')"
          color="primary" 
          label="Cambiar Teletrabajo" 
          style="height: 60px"/>
      </div>
    </q-card>
    
    
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      expanded: false,
      recordToSubmit: {}
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('empleados', ['loadDetalleEmpleado']),
    ...mapActions('tabs', ['addTab']),
    openForm (link) {
      this.addTab(['teletrabajo', 'Teletrabajo', {}, 1])
    },
    formatDate(date1) {
      if(date1 !== '') {
        date1 = date.extractDate(date1, 'YYYY-MM-DDTHH:mm:ss')
        return date.formatDate(date1, 'DD/MM/YYYY')
      }
    }
  },
  mounted () {
     //Llamaremos al BACKEND para pedir datos de este usuario 
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
  },
}
</script>
<style lang="sass">
  
</style>