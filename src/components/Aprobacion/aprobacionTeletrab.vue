<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="fechaSolicitud" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4"  v-model="item.grupoEtm" label="ETM" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm q-mt-sm">
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="teletrabajoFechaDesde" label="Fecha Desde" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="teletrabajoFechaHasta" label="Fecha Hasta" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="item.datosSolicitud.paisTeletrabajo" label="País Teletrab." stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  v-model="item.nomAutorizadorOf" label="Autorizador 1" stack-label dense readonly/>
    </div>
    <!-- <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm"  v-model="item.autorizador2" label="Autorizador 1" stack-label dense readonly/>
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
      paisTeletrab: '',
      teletrabajoFechaDesde: '',
      teletrabajoFechaHasta: ''
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
  mounted() {
    console.log('datosSolicitud', this.item.datosSolicitud);
    console.log('teletrabajoFechaDesde', this.item.datosSolicitud.teletrabajoFechaDesde);
    if(this.item.fechaSolicitud) {
      this.fechaSolicitud = (new Date(Date.parse(this.item.fechaSolicitud)))
      this.fechaSolicitud = this.fechaSolicitud.toLocaleDateString("en-GB")
    }
    // if(this.item.datosSolicitud.teletrabajoFechaDesde) {
      console.log(this.item.datosSolicitud.teletrabajoFechaDesde)
      this.teletrabajoFechaDesde = (new Date(Date.parse(this.item.datosSolicitud.teletrabajoFechaDesde)))
      console.log(this.teletrabajoFechaDesde);
      this.teletrabajoFechaDesde = this.teletrabajoFechaDesde.toLocaleDateString("en-GB")
      console.log(this.teletrabajoFechaDesde);
      this.teletrabajoFechaHasta = (new Date(Date.parse(this.item.datosSolicitud.teletrabajoFechaDesde)))
      this.teletrabajoFechaHasta = this.teletrabajoFechaHasta.toLocaleDateString("en-GB")
  // }
}
}
</script>