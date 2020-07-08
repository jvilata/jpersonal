<template>
  <q-item class="row q-ma-xs q-pa-xs">
    <q-card flat>
      <div class="row q-pa-sm items-baseline" style="max-width: 360px">
          <div class="col-xs-4">Fecha Desde</div>
          <div class="col-xs-8">
              <q-input filled :value="formatDate(dateDesde)">
              <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateDesde" @input="() => $refs.qDateProxy.hide()" />
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
              <q-input filled :value="formatDate(dateHasta)">
              <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateHasta" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                  </q-icon>
              </template>
              <template v-slot:append>
                  <q-icon name="close" @click.stop="model = ''" class="cursor-pointer" />
              </template>
              
              </q-input>
            </div>
      </div>
      <div class="col-xs-12">
        <q-input v-model="observaciones" label="Observaciones" autogrow @keyup.enter.stop />
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
      dateDesde: '',
      dateHasta: '',
      observaciones: ''
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    openForm (link) {
      this.addTab(['teletrabajo', 'Teletrabajo', {}, 1])
    },
    editRecord (rowChanges, id) { // no lo uso aqui pero lo dejo como demo
    //rowChanges contiene toda la info de cada persona 
      this.addTab(['personalFormMain', 'Personal-' + rowChanges.id, rowChanges, rowChanges.id])
      //'personalFormMain es el ComponentName // Personal- +id es el label del tab // rowChanges es el VALUE 
    },
    formatDate(pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    }
  }
}
</script>
<style lang="sass">
  
</style>