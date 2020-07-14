  <!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Filtrar por</div>
    </q-card-section>
    <q-form @submit="getRecords" class="q-gutter-y-xs">
        <q-select
          label="Empleado"
          stack-label 
          outlined
          clearable
          v-model="filterR.empleado"
          :options="listaEmpleadosFilter"
          @filter="filterEmpleados"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          use-input
          behavior="menu"
        />
        <q-input 
          outlined 
          clearable 
          label="Aprobador" 
          stack-label 
          v-model="filterR.persona" 
        />
        <q-select
          label="Estado"
          stack-label
          outlined
          clearable
          multiple
          v-model="filterR.estadoSolicitud"
          :options="listaEstadosSolicitudes"
          option-value="codElemento"
          option-label="valor1"
          emit-value
          map-options
          use-chips
          behavior="menu"
        />
        <q-select
          label="Tipo"
          stack-label
          outlined
          clearable
          v-model="filterR.tipoSolicitud"
          :options="listaTiposSolicitudes"
          option-value="codElemento"
          option-label="valor1"
          emit-value
          map-options
          behavior="menu"
        />

      <q-card-actions align="right">
        <q-btn  flat label="Cancel" color="primary" @click="$emit('close')"/>
        <q-btn  flat type="submit" label="Buscar" color="primary"/>
      </q-card-actions>
  </q-form>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      filterR: {
        idEmpleado: 0
      },
      disableEmpleado: true,
      listaEmpleadosFilter: []
    }
  },
  computed: {
    ...mapState('empleados', ['listaEmpleados']),
    ...mapState('login', ['user']),
    ...mapState('tablasAux', ['listaEstadosAprobacion', 'listaEstadosSolicitudes', 'listaTiposSolicitudes']),
  },
  methods: {
    getRecords () {
      this.$emit('getRecords', this.filterR) // lo captura aprobacionMain
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    },
    filterEmpleados(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaEmpleadosFilter = this.listaEmpleados.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mounted () {
    this.listaEmpleadosFilter = this.listaEmpleados
    this.filterR = Object.assign( {} , this.value) // asignamos valor del parametro por si viene de otro tab
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterR)
  }
}
</script>
