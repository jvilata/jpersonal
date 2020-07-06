<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="item.fechaSolicitud" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4"  v-model="item.grupoEtm" label="ETM" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="formatDate(item.teletrabajofechadesde)" label="Fecha Desde" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="formatDate(item.teletrabajofechahasta)" label="Fecha Hasta" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="item.paisteletrabajo" label="País Teletrab." stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm"  v-model="item.autorizador1" label="Autorizador 1" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm"  v-model="item.autorizador2" label="Autorizador 1" stack-label dense readonly/>
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
      justificante: []
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
    this.justificante = this.item.justificante
  }
}
</script>