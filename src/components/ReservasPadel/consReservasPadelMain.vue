  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 80vh">
      <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="search" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
          </q-item-label>
          <q-item-label>
            <!-- poner un campo de fiterRecord que exista en este filtro -->
            <small>{{ Object.keys(filterRecord).length > 1 ? filterRecord : 'Pulse para definir filtro' }}</small>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn label="Normas" color="primary" @click="mostrarNormas"/>
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
        :filter = "filterRecord"
        :key="keyRefresh"
        @getRecords = "getRecords"
        />

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import personalFilter from 'components/ReservasPadel/consReservasPadelFilter.vue'
import personalGrid from 'components/ReservasPadel/consReservasPadelGrid.vue'
import { openURL } from "quasar"
export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      visible: '',
      keyRefresh: 0,
      filterRecord: {},
      nomFormulario: 'Consultar Reservas Padel',
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
    mostrarNormas() {
      let url = 'https://gestion.edicom.es/fichajes/normaspadel.pdf'
      if (window.cordova === undefined) { // desktop
        openURL(url)
      } else { // estamos en un disp movil
        document.addEventListener('deviceready', () => {
          window.cordova.InAppBrowser.open(url, '_system') // openURL
        }, false)
      }
    },
    getRecords (filter) {
      // hago la busqueda de registros segun condiciones del formulario Filter que ha lanzado el evento getRecords
      Object.assign(this.filterRecord, filter) // no haría falta pero así obliga a refrescar el componente para que visulice el filtro
      return this.$axios.get(`bd_jpersonal.asp?action=reservas/padel/lst&auth=${this.user.auth}`, { params: this.filterRecord })
        .then(response => {
          this.registrosSeleccionados = response.data
          this.expanded = false
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    }
  },
  mounted () {
    if (this.value.filterRecord) { // si ya hemos cargado previamente los recargo al volver a este tab
      this.expanded = false
      Object.assign(this.filterRecord, this.value.filterRecord)
      this.getRecords(this.filterRecord) // refresco la lista por si se han hecho cambios
    } else { // es la primera vez que entro, cargo valores po defecto
      this.filterRecord = { codEmpresa: this.user.codEmpresa, sala: 'padel', idpersonal: null, fechaDesde: date.formatDate(new Date(), 'YYYY-MM-DD') }
      this.getRecords(this.filterRecord)
      this.keyRefresh++
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
