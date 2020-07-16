  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 80vh">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="fas fa-filter" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <!-- poner un campo de fiterRecord que exista en este filtro -->
            <small>{{ (Object.keys(filterRecord).length > 1 ? (filterRecord.query ? `Empleado: ${filterRecord.query}` + ' | ': '' ) + 
                      (filterRecord.area ? `Area: ${filterRecord.area}`+ ' | ' : '' ) + 
                      (filterRecord.paisLab ? `País Laboral: ${filterRecord.paisLab}`+ ' | ' : '' ) +
                      (filterRecord.paisTrab ? `País Laboral: ${filterRecord.paisTrab}`+ ' | ' : '' ) +
                      (filterRecord.vehiculo ? `Vehículo: ${filterRecord.vehiculo}`+ ' | ' : '' ) +
                      (filterRecord.equipoETM ? `Equipo ETM: ${filterRecord.equipoETM}`+ ' | ' : '' ) + 
                      (filterRecord.agrupacionETM ? `Grupo ETM: ${filterRecord.agrupacionETM}`+ ' | ' : '' ) + 
                      (filterRecord.sfecha_de_alta_desde ? `Fecha Alta Desde: ${filterRecord.sfecha_de_alta_desde}\n` : '' ) +
                      (filterRecord.sfecha_de_alta_hasta ? `Fecha Alta Hasta: ${date.formatDate(date.extractDate(filterRecord.sfecha_de_alta_hasta,'YYYY-MM-DDTHH:mm:ss'), 'DD/MM/YYYY')}\n` : '' ) +
                      (filterRecord.teletrabajo==1 ? `Teletrabajo: SÍ` : '' ) : 'Pulse para definir filtro') }}</small>
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
        <personalFilter
          :value="filterRecord"
          @input="(value) => Object.assign(filterRecord, value)"
          @getRecords="getRecords"
          @close="expanded = !expanded"
        />
      </q-dialog>

      <!-- formulario tabla de resultados de busqueda -->
      <personalGrid
        v-model="registrosSeleccionados"
        />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import personalFilter from 'components/Personal/personalFilter.vue'
import personalGrid from 'components/Personal/personalGrid.vue'

export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Personal',
      registrosSeleccionados: []
    }
  },
  computed: {
    ...mapState('login', ['user']), // importo state.user desde store-login
    ...mapState('empleados', ['listaEmpleados']),

  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('empleados', ['loadListaDetalleEmpleados']),
    getRecords (filter) {
      // hago la busqueda de registros segun condiciones del formulario Filter que ha lanzado el evento getRecords
      Object.assign(this.filterRecord, filter) // no haría falta pero así obliga a refrescar el componente para que visulice el filtro
      var objFilter = Object.assign({}, filter)
      // objFilter.estadoActivo = (objFilter.estadoActivo !== null ? objFilter.estadoActivo.join() : null) // paso de array a concatenacion de strings (join)
      this.loadListaDetalleEmpleados(filter)
        .then(response => {
          this.registrosSeleccionados = response.data.root
          console.log('filterR', this.filterRecord)
          this.expanded = false
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    }
  },
  mounted () {
    // if (this.listaEntidades.length <= 0) this.loadEntidades() // carga store listaEntidades
    if (this.value.filterRecord) { // si ya hemos cargado previamente los recargo al volver a este tab
      this.expanded = false
      Object.assign(this.filterRecord, this.value.filterRecord)
      this.getRecords(this.filterRecord) // refresco la lista por si se han hecho cambios
    } else { // es la primera vez que entro, cargo valores po defecto
      this.filterRecord = { codEmpresa: this.user.codEmpresa, vigente: '1', query: this.user.pers.nombre  }
      this.getRecords(this.filterRecord)
    }
  },
  destroyed () {
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: this.filterRecord })
  },
  components: {
    personalFilter: personalFilter,
    personalGrid: personalGrid
  }
}
</script>
