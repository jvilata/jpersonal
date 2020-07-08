
<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-9"  v-model="item.ejercicio" label="Ejercicio" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(item.fechaDesde)" label="Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(item.fechaHasta)" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="item.numJornadas" label="Num. Jornadas" stack-label dense readonly/>
        <q-input class="col-7"  v-model="item.tipoJornadaLibre" label="Tipo Jornada Libre" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col"  v-model="item.observaciones" label="Observaciones" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col"  v-model="item.sustituto" label="Sustituto" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(item.sustFDesde)" label="Sust. Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(item.sustFHasta)" label="Sust. Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-4 q-pr-sm" v-model="item.justValid" label="Just. Valid" stack-label dense readonly/>
        <q-input class="col-4 q-pr-sm" v-model="item.justNoValid" label="Just. No Valid" stack-label dense readonly/>
        <q-input class="col-4" v-model="item.autSinDoc" label="Aut. Sin Doc" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <q-file stack-label dense bottom-slots v-model="justificante" label="Seleccionar justificante" counter>
        <template v-slot:prepend>
          <q-icon flat name="cloud_upload" dense></q-icon>
        </template>
        <template v-slot:after>
          <q-btn flat icon="close" @click.stop="delJust" dense/>
        </template>
      </q-file>
    </div>
    <div class="row q-pb-sm">
      <q-btn class="col" color="primary" label="Subir justificante" @click="addJust" dense></q-btn>
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