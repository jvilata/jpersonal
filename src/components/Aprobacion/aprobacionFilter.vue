  <!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Filtrar por</div>
    </q-card-section>
    <q-form @submit="getRecords" class="q-gutter-y-xs">
        <q-select
          v-if="keyValue == 2"
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

        <q-select
          v-if="keyValue == 1"
          label="Empleado"
          stack-label 
          outlined
          clearable
          v-model="filterR.empleado"
          :options="listaEmpleadosResFilter"
          @filter="filterEmpleadosRes"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          use-input
          behavior="menu"
        />

        <q-select 
          v-if="keyValue == 2 && user.esSuperUsuarioPersonal"
          outlined 
          clearable 
          label="Aprobador" 
          stack-label 
          v-model="filterR.persona"
           :options="listaEmpleadosFilter"
          @filter="filterEmpleados"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          use-input
          behavior="menu"
        />

        <q-select 
          v-if="keyValue == 2 && !user.esSuperUsuarioPersonal"
          readonly
          outlined 
          clearable 
          label="Aprobador" 
          stack-label 
          v-model="filterR.persona"
           :options="listaEmpleadosFilter"
          @filter="filterEmpleados"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          use-input
          behavior="menu"
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
        <q-btn  flat type="submit" label="Buscar" color="primary" />
      </q-card-actions>
  </q-form>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value', 'keyValue'], // value es el objeto con los campos de filtro que le pasa aprobacionMain (MOUNTED) con v-model
  //keyValue 1-> es el tab de consultar
  //keyValue 2 -> tab de aprobar 
  data () {
    return {
      filterR: {
        idEmpleado: 0,
        persona: '',
        estadoSolicitud: '',
        tipoSolicitud: 0
      },
      disableEmpleado: true,
      listaEmpleadosFilter: [],
      listaEmpleadosResFilter: [],
      listaResponsablesFilter: [],
      listaResponsables: [],
      responsable: ''
    }
  },
  computed: {
    ...mapState('empleados', ['listaEmpleados', 'listaEmpleadosRestringido']),
    ...mapState('login', ['user']), 
    ...mapState('tablasAux', ['listaEstadosAprobacion', 'listaEstadosSolicitudes', 'listaTiposSolicitudes']),
  },
  methods: {
    ...mapActions('empleados', ['calcularResponsable']),
    getRecords () {
      this.$emit('getRecords', this.filterR) // lo captura aprobacionMain
      this.$emit('close')
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    },
    //Carga todos los empleados
    filterEmpleados(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaEmpleadosFilter = this.listaEmpleados.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    //Carga empleados Restringidos 
    filterEmpleadosRes(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaEmpleadosResFilter = this.listaEmpleadosRestringido.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  mounted () {
    this.listaEmpleadosFilter = this.listaEmpleados
     this.listaEmpleadosResFilter = this.listaEmpleadosRestringido
    this.filterR = Object.assign( {} , this.value) // asignamos valor del parametro por si viene de otro tab
  },
  destroyed () {
    this.$emit('input', this.filterR)
  }
}
</script>
