
<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="permiso.id" label="ID" stack-label dense readonly/>
        <q-input class="col-7"  v-model="permiso.ejercicioAplicacion" label="Ejercicio" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.fechaDesde)" label="Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.fechaHasta)" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="permiso.diasEfectivos" label="Num. Jornadas" stack-label dense readonly/>
        <q-input class="col-7"  v-model="permiso.datosTipoDiaLibre.descripcionDiaLibre" label="Tipo Jornada Libre" stack-label dense readonly/>
    </div>
    <div class="row q-pb-md">
        <q-input class="col"  v-model="permiso.observaciones" label="Observaciones" stack-label dense readonly/>
    </div>

    <div class="row">
      <q-btn color="negative" class="col" @click="deleteP(permiso.id)">Eliminar permiso</q-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { date } from 'quasar'

export default {

  props: ['permiso'],
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('permisos', ['deletePermisoPendiente']),
    deleteP(id) {
      this.$q.dialog({
        title: 'Eliminar permiso',
        message: '¿Desea eliminar el permiso?',
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
        this.deletePermisoPendiente(this.permiso)
      })
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    }
  }
}
</script>