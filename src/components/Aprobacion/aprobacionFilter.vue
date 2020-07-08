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
          :options="empleadosNombre"
          option-value="id"
          option-label="desc"
          emit-value
          map-options
          :disable="disableEmpleado"
        />
        <q-input outlined clearable label="Aprobador" stack-label v-model="filterR.aprobador" />
        
        <q-select
          label="Estado"
          stack-label
          outlined
          clearable
          multiple
          v-model="filterR.estado"
          :options="listaEstadosAprobacion"
          option-value="codElemento"
          option-label="valor1"
          emit-value
          map-options
        />
        <q-select
          label="Tipo"
          stack-label
          outlined
          clearable
          v-model="filterR.tipo"
          :options="tipo"
          option-value="id"
          option-label="desc"
          emit-value
          map-options
        />

      <q-card-actions align="right">
        <q-btn  flat type="submit" label="Buscar" color="primary"/>
        <q-btn  flat label="Cancel" color="primary" @click="$emit('close')"/><!-- lo captura accionesMain -->
      </q-card-actions>
  </q-form>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { date } from 'quasar'
export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      filterR: {},
      estado: ['PENDIENTE', 'CONC. PROVISIONAL', 'DENEGADO', 'CONCEDIDO'],
      tipo: ['PERMISO', 'CAMBIO HORARIO', 'TELETRABAJO', 'PROCESO SELECCIÓN', 'MODIFICACIÓN JORNADA'],
      empleadosNombre: [],
      disableEmpleado: false
    }
  },
  computed: {
    ...mapState('empleados', ['empleados']),
    ...mapState('tablasAux', ['listaEstadosAprobacion'])
  },
  methods: {
    getRecords () {
      this.$emit('getRecords', this.filterR) // lo captura accionesMain
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    }
  },
  beforeMount() {
    let i = 0
    for (let empleado of this.empleados) {
      this.empleadosNombre[i] = empleado.nombrePersona
      i++
    }
  },
  mounted () {
    this.filterR = this.value // asignamos valor del parametro por si viene de otro tab
    console.log('value PermisosFilter', this.value);
    
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterR)
  }
}
</script>
