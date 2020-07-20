<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  :value="formatDate(item.fechaSolicitud)" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4"  v-model="item.grupoEtm" label="ETM" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm q-mt-sm">
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="formatDate(datosSolicitud.teletrabajoFechaDesde)" label="Fecha Desde" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="formatDate(datosSolicitud.teletrabajoFechaHasta)" label="Fecha Hasta" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.paisTeletrabajo" label="País Teletrab." stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  v-model="item.nomAutorizadorOf" label="Autorizador 1" stack-label dense readonly/>
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
      datosSolicitud: {
        paisTeletrabajo: '',
        teletrabajoFechaDesde: '',
        teletrabajoFechaHasta: '',
        aceptaTeletrabajo: true,
        domicilioTeletrabajo: '',
        teletrabajoObservaciones:''
      }
    }
  },
  methods: {
    ...mapActions('permisos', ['addJustificante', 'deleteJustificante']),
    addJust() {
      if (this.justificante)
        this.addJustificante([this.item.id, this.justificante])
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
      })
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
  },
  mounted() {
    if(this.item.datosSolicitud) {
      var obj = JSON.parse(this.item.datosSolicitud)
      Object.assign(this.datosSolicitud, obj)     
  }
}
}
</script>