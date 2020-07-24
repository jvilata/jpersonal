<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(item.fechaSolicitud)" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-6 q-pr-sm"  :value="item.id" label="ID" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm q-mt-sm">
      <div class="col-12 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.puestoText" label="Puesto Vacante Solicitado" stack-label dense readonly/>
      </div>
      <div class="col-3 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.anyosExperiencia" label="Años Exp." stack-label dense readonly/>
      </div>
      <div class="col-2 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.nVacantes" label="Vacantes" stack-label dense readonly/>
      </div>
      <div class="col-7 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.areaText" label="Área" stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm q-mt-sm">
      <div class="col-3 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.delegacion" label="Delegación" stack-label dense readonly/>
      </div>
      <div class="col-3 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.horario" label="Horario" stack-label dense readonly/>
      </div>
      <div class="col-6 q-pr-sm" >
        <q-input class="row" :value="formatDate(datosSolicitud.fechaDeseable)" label="Fecha Deseable" stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  autogrow v-model="datosSolicitud.motivo" label="Motivo" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  v-model="item.nomAutorizadorOf" label="Autorizador 1" stack-label dense readonly/>
    </div>
    
  </div>  
</template>

<script>
import { date } from 'quasar'
import  { Vue }  from 'vue'

export default {
  props: ['item'],
  data () {
    return {
      datosSolicitud: {
        delegacion: '',
        horario: '',
        responsableProceso: 0,
        fechaDeseable: '',
        nVacantes: 0,
        procesoInterno: '',
        motivo:'',
        puesto: 0,
        area: 0,
        anyosExperiencia: 0,
        escalaMinima: '',
        escalaMaxima: '',
        puestoText: '',
        areaText: ''
      }
    }
  },
  methods: {
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    }
  },
  mounted() {
    if(this.item.datosSolicitud) {
      var obj = JSON.parse(this.item.datosSolicitud)
      Object.assign(this.datosSolicitud, obj)     
  }
}
}
</script>