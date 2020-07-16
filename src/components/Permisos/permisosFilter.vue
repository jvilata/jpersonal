<template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <q-item-label class="text-h6">
          Filtrar por
      </q-item-label>
      <q-item-label>
        <small @click="verNormativa"><u>Normativa de permisos y vacaciones</u></small>
      </q-item-label>
    </q-card-section>

    <q-form @submit="getPermisos">
      <q-select
        :disable="disable"
        class="q-pb-xs"
        outlined 
        clearable 
        label="Empleado" 
        stack-label
        v-model="filterP.empleado"
        :options="listaEmpleadosFilter"
        @filter="filterEmpleados"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        behavior="menu">
      </q-select>
      
      <q-input
        class="q-pb-xs"
        outlined 
        clearable 
        label="Ejercicio" 
        stack-label
        v-model.number="filterP.ejercicioAplicacion"
        type="number">
      </q-input>

      <q-card-actions align="right">
        <q-btn  flat label="Cancel" color="primary" @click="$emit('close')"/><!-- lo captura accionesMain -->
        <q-btn  flat type="submit" label="Aceptar" color="primary"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { openURL } from "quasar";

export default {
  props: ['value', 'filialEmp'],
  data() {
    return {
      filterP: {},
      disable: false,
      listaEmpleadosFilter: []
    }
  },
  computed: {
    ...mapState('empleados', ['listaEmpleados'])
  },
  methods: {
    verNormativa() {
      loadFilialEmpleado(this.filterP.empleado).then(response => {
        let url = response.filial.urlNormativa
        if (window.cordova === undefined) { // desktop
          openURL(url)
        } else { // estamos en un disp movil
          window.cordova.InAppBrowser.open(url, '_system') // openURL
        }
      })
    },
    getPermisos() {
      this.$emit('getPermisos', this.filterP)
      this.$emit('getEmpleado', this.filterP)
      this.$emit('close')
    },
    filterEmpleados(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaEmpleadosFilter = this.listaEmpleados.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mounted() {
    this.listaEmpleadosFilter = this.listaEmpleados
    this.filterP = Object.assign( {}, this.value)
    
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterP)
  }
}
</script>