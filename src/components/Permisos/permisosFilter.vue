<template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <q-item-label class="text-h6">
          Filtrar por
      </q-item-label>
    </q-card-section>

    <q-form @submit="getPermisos">
      <q-select
        :disable="disable"
        class="q-pb-xs"
        outlined 
        use-input
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
        behavior="menu"
        :rules="[val => !!val || 'Campo obligatorio']"
        lazy-rules>
      </q-select>
      
      <q-input
        class="q-pb-xs"
        outlined 
        clearable 
        label="Ejercicio" 
        stack-label
        v-model.number="filterP.ejercicioAplicacion"
        type="number"
        :rules="[val => !!val || 'Campo obligatorio',
                 val => val <= (year + 1) || `Ejercicio límite: ${year + 1}`,
                 val => val >= (year - 10) || `Ejercicio límite: ${year - 10}`]"
        lazy-rules>
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

export default {
  props: ['value'],
  data() {
    return {
      filterP: {},
      disable: false,
      listaEmpleadosFilter: [],
      year: (new Date()).getFullYear()
    }
  },
  computed: {
    ...mapState('empleados', ['listaEmpleadosRestringido'])
  },
  methods: {
    getPermisos() {
      this.$q.loading.show()
      this.$emit('getPermisos', this.filterP)
      this.$emit('getEmpleado', this.filterP)
      this.$emit('close')
    },
    filterEmpleados(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaEmpleadosFilter = this.listaEmpleadosRestringido.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mounted() {
    this.listaEmpleadosFilter = this.listaEmpleadosRestringido
    this.filterP = Object.assign( {}, this.value)
    
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterP)
  }
}
</script>