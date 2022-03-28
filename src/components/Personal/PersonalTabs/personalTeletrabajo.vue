<template>
  <div :style="screen=='sqScreen' ? 'height: calc(100vh - 227px)' : screen=='fullScreen' ? 'height: calc(100vh - 283px)' : 'height: calc(100vh - 207px)'">
    <q-card flat>
      <q-card-section  class="q-pt-md q-pl-xs q-pr-xs">
      <div class="row q-pa-sm items-baseline" style="max-width: 380px">
          <div class="col-xs-4">Fecha Desde</div>
          <div class="col-xs-8">
              <q-input filled readonly :value="formatDate(recordToSubmit.teletrabajoFechaDesde)" />
          </div>
      </div>
      <div class="row q-pa-sm items-baseline" style="max-width: 380px">
            <div class="col-xs-4">Fecha Hasta</div>
            <div class="col-xs-8">
              <q-input filled readonly :value="formatDate(recordToSubmit.teletrabajoFechaHasta)" />
            </div>
      </div>
      <div>
         <q-option-group
                v-model="diasTele"
                :options="diasSemana"
                type="checkbox"
                color="primary"
                inline
                disable
              />
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
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      expanded: false,
      recordToSubmit: {},
      diasTele:[],
      diasSemana: [{
          label: 'L',
          value: '2'
        },{
          label: 'M',
          value: '3'
        },{
          label: 'X',
          value: '4'
        },{
          label: 'J',
          value: '5'
        },{
          label: 'V',
          value: '6'
        },{
          label: 'S',
          value: '7'
        }, {
          label: 'D',
          value: '1'
        }],
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user', 'screen'])
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
         this.diasTele = this.recordToSubmit.teletrabajoDias.split(',')
       })
  },
  beforeMount(){
    this.$q.loading.show() 
  },
}
</script>
<style lang="sass">
  
</style>