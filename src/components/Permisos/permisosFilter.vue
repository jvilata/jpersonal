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
        :options="empleados"
        option-value="id"
        option-label="nombre"
        emit-value
        map-options>
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
import { mapState } from 'vuex'
import { openURL } from "quasar";

export default {
  props: ['value'],
  data() {
    return {
      filterP: {},
      disable: false,
      model: 'JAVIER HERNÁNDEZ CERRILLO',
      empleados: [
        {
          id: 1495,
          idpersonal: 1,
          nombre: 'JAVIER HERNÁNDEZ CERRILLO'
        },
        {
          id: 1494,
          idpersonal: 2,
          nombre: 'MARTA VILATA DARDER'
        },
        {
          id: 140,
          idpersonal: 3,
          nombre: 'JOSÉ BLAS VILATA TAMARIT'
        },
        {
          id: 44,
          idpersonal: 4,
          nombre: 'ANA MARÍA DARDER NAVARRO'
        },
      ]
    }
  },
  methods: {
    verNormativa() {
      let strUrl = 'http://www.edicomgroup.com'
       if (window.cordova === undefined) { // desktop
          openURL(strUrl)
        } else { // estamos en un disp movil
          window.cordova.InAppBrowser.open(strUrl, '_system') // openURL
        }
    },
    getPermisos() {
      this.$emit('getPermisos', this.filterP)
      this.$emit('close')
    }
  },
  mounted() {
    this.filterP = Object.assign( {}, this.value)
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterP)
  }
}
</script>