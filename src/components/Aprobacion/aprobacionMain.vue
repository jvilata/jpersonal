  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 85vh">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="filter_alt" size="md"/>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <!-- poner un campo de fiterRecord que exista en este filtro -->
            <small>{{ (Object.keys(filterRecord).length > 1 ? (filterRecord.empleado ? `Empleado: ${(listaEmpleados.find(record => record.id === filterRecord.empleado)).name}\n` + ' | ': '') + (filterRecord.persona ? `Autorizador: ${(listaEmpleados.find(record => record.id === filterRecord.persona)).name}` + ' | ' : '') + (filterRecord.estadoSolicitud ? ' Estado Solicitud: '+ filterRecord.estadoSolicitud + ' | ': '') + (filterRecord.tipoSolicitud ? ' Tipo Solicitud: '+ filterRecord.tipoSolicitud  : '') : 'Pulse para definir filtro') }}</small>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
          @click="$emit('close')"
          flat
          round
          dense
          icon="close"/>
        </q-item-section>
      </q-item>

      <q-dialog v-model="expanded"  >
        <!-- formulario con campos de filtro -->
        <aprobacionFilter
          @getRecords="(value) => getRecords(value)"
          :value="filterRecord"
          @input="(value) => Object.assign(filterRecord, value)"
          @close="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <aprobacionItemsList
        v-model="listaCambios"
        @deleteCambios="(id) => deleteSolicitud(id)"
        />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Aprobación Cambios-Permisos',
      registrosSeleccionados: []
    }
  },
  computed: {
    ...mapState('empleados', ['listaEmpleados']),
    ...mapState('login', ['user']), // importo state.user desde store-login
    ...mapState('aprobacion', ['listaCambios'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('aprobacion', ['getListaCambios', 'deleteCambios']),
    getRecords (filter) {
      // hago la busqueda de registros segun condiciones del formulario Filter que ha lanzado el evento getRecords
      Object.assign(this.filterRecord, filter) // no haría falta pero así obliga a refrescar el componente para que visulice el filtro
      var objFilter = Object.assign({}, filter)
      
      return this.$axios.get('bd_personal.asp?action=soldias/solicitudesPendientes', { params: objFilter })
        .then(response => {
          this.getListaCambios(filter)
          this.registrosSeleccionados = response.data
          this.expanded = false
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    },
    deleteSolicitud(id){
      this.deleteCambios({id: id , filterR: this.filterRecord})
    }
  },
  mounted () {
    if (this.value.filterRecord) { // si ya hemos cargado previamente los recargo al volver a este tab
      this.expanded = false
      Object.assign(this.filterRecord, this.value.filterRecord)
      this.getRecords(this.filterRecord) // refresco la lista por si se han hecho cambios
    } else { // es la primera vez que entro, cargo valores po defecto
      this.filterRecord = {  empleado: this.user.pers.id, persona: this.user.pers.idautorizador }
      this.getRecords(this.filterRecord)
    }
  },
  destroyed () {
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: this.filterRecord })
  },
  components: {
    aprobacionFilter: require('components/Aprobacion/aprobacionFilter.vue').default,
    aprobacionItemsList: require('components/Aprobacion/aprobacionItemsList.vue').default
  }
}
</script>
