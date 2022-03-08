<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  :value="fechaSolicitud" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-3 q-pr-sm"  :value="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4"  :value="item.grupoEtm" label="ETM" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Lunes</span>
        <q-input class="col" :value="horaEnt1" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal1" label="Hasta" stack-label dense readonly/>
        <q-input class="col" :value="horaEnt2" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal2" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Martes</span>
        <q-input class="col" :value="horaEnt5" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal5" label="Hasta" stack-label dense readonly/>
        <q-input class="col" :value="horaEnt6" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal6" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Miércoles</span>
        <q-input class="col" :value="horaEnt7" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal7" label="Hasta" stack-label dense readonly/>
        <q-input class="col" :value="horaEnt8" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal8" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Jueves</span>
        <q-input class="col" :value="horaEnt9" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal9" label="Hasta" stack-label dense readonly/>
        <q-input class="col" :value="horaEnt10" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal10" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Viernes</span>
        <q-input class="col" :value="horaEnt3" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal3" label="Hasta" stack-label dense readonly/>
        <q-input class="col" :value="horaEnt4" label="Desde" stack-label dense readonly/>
        <q-input class="col" :value="horaSal4" label="Hasta" stack-label dense readonly/>
    </div>
    
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm"  v-model="item.nomAutorizadorOf" label="Autorizador 1" stack-label dense readonly/>
    </div>
    
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { date } from 'quasar'
import  { Vue }  from 'vue'

export default {
  props: ['item'],
  data () {
    return {
      fechaSolicitud: '',
      horaEnt1: '',
      horaSal1: '',
      horaEnt2: '',
      horaSal2: '',
      horaEnt3: '',
      horaSal3: '',
      horaEnt4: '',
      horaSal4: '',
      horaEnt5: '',
      horaSal5: '',
      horaEnt6: '',
      horaSal6: '',
      horaEnt7: '',
      horaSal7: '',
      horaEnt8: '',
      horaSal8: '',
      horaEnt9: '',
      horaSal9: '',
      horaEnt10: '',
      horaSal10: ''
    }
  },
  methods: {
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
  },
  mounted(){
    
    if(this.item.fechaSolicitud) {
      this.fechaSolicitud = (new Date(Date.parse(this.item.fechaSolicitud)))
      this.fechaSolicitud = this.fechaSolicitud.toLocaleDateString("en-GB")
    }
    var j = JSON.parse(this.item.datosSolicitud)
    if (j.horaEntrada1) this.horaEnt1 = j.horaEntrada1.substring(11, 16)
    if (j.horaSalida1 !== null) this.horaSal1 = j.horaSalida1.substring(11, 16)
    if (j.horaEntrada2 !== null) this.horaEnt2 = j.horaEntrada2.substring(11, 16)
    if (j.horaSalida2 !== null) this.horaSal2 = j.horaSalida2.substring(11, 16)
    if (j.horaEntrada3 !== null) this.horaEnt3 = j.horaEntrada3.substring(11, 16)
    if (j.horaSalida3 !== null) this.horaSal3 = j.horaSalida3.substring(11, 16)
    if (j.horaEntrada4 !== null) this.horaEnt4 = j.horaEntrada4.substring(11, 16)
    if (j.horaSalida4 !== null) this.horaSal4 = j.horaSalida4.substring(11, 16)
    if (j.horaEntrada5 !== null) this.horaEnt5 = j.horaEntrada5.substring(11, 16)
    if (j.horaSalida5 !== null) this.horaSal5 = j.horaSalida5.substring(11, 16)
    if (j.horaEntrada6 !== null) this.horaEnt6 = j.horaEntrada6.substring(11, 16)
    if (j.horaSalida6 !== null) this.horaSal6 = j.horaSalida6.substring(11, 16)
    if (j.horaEntrada7 !== null) this.horaEnt7 = j.horaEntrada7.substring(11, 16)
    if (j.horaSalida7 !== null) this.horaSal7 = j.horaSalida7.substring(11, 16)
    if (j.horaEntrada8 !== null) this.horaEnt8 = j.horaEntrada8.substring(11, 16)
    if (j.horaSalida8 !== null) this.horaSal8 = j.horaSalida8.substring(11, 16)
    if (j.horaEntrada9 !== null) this.horaEnt9 = j.horaEntrada9.substring(11, 16)
    if (j.horaSalida9!== null) this.horaSal9 = j.horaSalida9.substring(11, 16)
    if (j.horaEntrada10 !== null) this.horaEnt10 = j.horaEntrada10.substring(11, 16)
    if (j.horaSalida10 !== null) this.horaSal10 = j.horaSalida10.substring(11, 16)
  }
}
</script>