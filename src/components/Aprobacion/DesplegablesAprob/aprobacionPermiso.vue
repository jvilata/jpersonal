
<template>
  <div class="container">    
    <div class="row q-pb-sm ">
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4 q-pr-sm"  v-model="item.ejercicioAplicacion" label="Ejercicio" stack-label dense readonly/>
        <q-input class="col-5"  v-model="item.tipoDiaDesc" label="Tipo Jornada Libre" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-4 q-pr-sm"  :value="formatDate(item.fechaDesde, 'DD/MM/YYYY')" label="Desde" stack-label dense readonly/>
        <q-input class="col-4 q-pr-sm"  :value="formatDate(item.fechaHasta, 'DD/MM/YYYY')" label="Hasta" stack-label dense readonly/>
        <q-input class="col-4 q-pr-sm"  v-model="item.diasEfectivos" label="Num. Jornadas" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
      <q-select
        class="col q-pb-xs"
        dense
        clearable 
        label="Sustituto" 
        stack-label
        v-model="permisoAprobar.sustituto"
        :options="listaEmpleadosFilter"
        @input="$emit('permiso', permisoAprobar)"
        @filter="filterEmpleados"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        use-input
        behavior="menu">
      </q-select>
    </div>
    <div class="row q-pb-sm">
      <q-input 
        class="col-6 q-pr-sm"
        dense
        clearable 
        label="Sust. Fecha Desde" 
        stack-label 
        :value="formatDate(permisoAprobar.ssustFdesde, 'DD/MM/YYYY')"
        @clear="permisoAprobar.ssustFdesde = ''">
        <template v-slot:append>
            <q-icon name="event" class="cursos-pointer">
              <q-popup-proxy ref="qSustFechaDesde">
                <wgDate 
                  @input="$refs.qSustFechaDesde.hide(); $emit('permiso', permisoAprobar)"
                  v-model="permisoAprobar.ssustFdesde" />
              </q-popup-proxy>
            </q-icon>
        </template>
      </q-input>
      <q-input
        class="col-6"
        dense
        clearable 
        label="Sust. Fecha Hasta" 
        stack-label 
        :value="formatDate(permisoAprobar.ssustFhasta, 'DD/MM/YYYY')"
        @clear="permisoAprobar.ssustFhasta = ''">
        <template v-slot:append>
            <q-icon name="event" class="cursos-pointer">
              <q-popup-proxy ref="qSustFechaHasta">
                <wgDate 
                  @input="$refs.qSustFechaHasta.hide(); $emit('permiso', permisoAprobar)"
                  v-model="permisoAprobar.ssustFhasta"/>
              </q-popup-proxy>
            </q-icon>
        </template>
      </q-input>
    </div>

    <div class="row q-pb-md">
        <q-input class="col"  v-model="permisoAprobar.observaciones" label="Observaciones" stack-label dense @input="$emit('permiso', permisoAprobar)"/>
    </div>

  </div>
</template>


<script>
import { mapState } from "vuex";
import { date } from 'quasar'

export default {

  props: ['item'],
  data () {
    return {
      permisoAprobar: {
        ssustFdesde: null,
        ssustFhasta: null,
        sustituto: null,
        observaciones: ''
      },
      listaEmpleadosFilter: []
    }
  },
  computed: {
    ...mapState('empleados', ['listaEmpleados'])
  },
  components: {
    wgDate: require('components/General/wgDate.vue').default
  },
  methods: {
    formatDate (pdate, mask) {
      return date.formatDate(pdate, mask)
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
    this.permisoAprobar.observaciones = this.item.observaciones
  },
  destroyed() {
    this.$emit('input', this.permisoAprobar)
  }
}
</script>