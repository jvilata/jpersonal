
<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-3 q-pr-sm"  v-model="permiso.id" label="ID" stack-label dense readonly/>
        <q-input class="col-9"  v-model="permiso.ejercicioAplicacion" label="Ejercicio" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.fechaDesde)" label="Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.fechaHasta)" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="permiso.diasEfectivos" label="Num. Jornadas" stack-label dense readonly/>
        <q-input class="col-7"  v-model="permiso.datosTipoDiaLibre.descripcionDiaLibre" label="Tipo Jornada Libre" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col"  v-model="permiso.observaciones" label="Observaciones" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col"  v-model="permiso.datosSustituto.nombre" label="Sustituto" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.sustFDesde)" label="Sust. Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.sustFHasta)" label="Sust. Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-4 q-pr-sm" v-model="permiso.justificantesValidados" label="Just. Valid" stack-label dense readonly/>
        <q-input class="col-4 q-pr-sm" v-model="permiso.justificantesNoValidados" label="Just. No Valid" stack-label dense readonly/>
        <q-input class="col-4" v-model="permiso.autorizadosSinDoc" label="Aut. Sin Doc" stack-label dense readonly/>
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
  props: ['permiso'],
  data () {
    return {
      justificante: []
    }
  },
  methods: {
    ...mapActions('permisos', ['addJustificante', 'deleteJustificante']),
    addJust() {
      if (this.justificante)
        this.addJustificante([this.permiso.id, this.justificante])
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
        this.deleteJustificante(this.permiso.id)
        //this.$forceUpdate()
      })
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
  },
  mounted() {
    this.justificante = this.permiso.justificante
  }
}
</script>