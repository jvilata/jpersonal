<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="fechaSolicitud" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4"  v-model="item.grupoEtm" label="ETM" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Lunes a Jueves</span>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="horaEnt1" label="Desde" stack-label dense readonly/>
        <q-input class="row" :value="horaSal1" label="Desde" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="horaEnt2" label="Hasta" stack-label dense readonly/>
        <q-input class="row" :value="horaSal2" label="Hasta" stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm">
      <span class="col-4 q-pr-sm text-grey-8" dense>Viernes</span>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="horaEnt3" label="Desde" stack-label dense readonly/>
        <q-input class="row" :value="horaSal3" label="Desde" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="horaEnt4" label="Hasta" stack-label dense readonly/>
        <q-input class="row" :value="horaSal4" label="Hasta" stack-label dense readonly/>
      </div>
    </div>
    
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm"  v-model="item.nomAutorizadorOf" label="Autorizador 1" stack-label dense readonly/>
    </div>
    <!-- <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm"  v-model="item.id" label="Autorizador 1" stack-label dense readonly/>
    </div> -->
    
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
      horaSal4: ''
    }
  },
  methods: {
    ...mapActions('permisos', ['addJustificante', 'deleteJustificante']),
    addJust() {
      if (this.justificante)
        this.addJustificante([this.item.id, this.justificante])
        //this.$forceUpdate()
    },
    delJust () {
      this.$q.dialog({
        title: 'Eliminar justificante',
        message: '¿Desea eliminar el justificante?',
        cancel: {
          color: 'primary',
          flat: true
        },
        ok: {
          label: 'Eliminar',
          flat: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        this.deleteJustificante(this.item.id)
        //this.$forceUpdate()
      })
    },
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
  }
}
</script>