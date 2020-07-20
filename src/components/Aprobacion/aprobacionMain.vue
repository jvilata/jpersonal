  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y ItemsList -->
  <template>
    <div style="height: 75vh">
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
            <small>{{ (Object.keys(filterRecord).length > 1 ? 
                (filterRecord.empleado ? `Empleado: ${(listaEmpleados.find(record => record.id === filterRecord.empleado)).name}\n` + ' | ': '') + 
                (filterRecord.persona ? `Autorizador: ${(listaEmpleados.find(record => record.id === filterRecord.persona)).name}` + ' | ' : '') + 
                (filterRecord.estadoSolicitud ? `Estado Solicitud: ${filterRecord.estadoSolicitud}` : '') + 
                (filterRecord.tipoSolicitud ? ' Tipo Solicitud: '+ filterRecord.tipoSolicitud : '')  : 'Pulse para definir filtro') }}
            </small>
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
        <aprobacionFilter
          @getRecords="(value) => getRecords(value)"
          :value="filterRecord"
          :keyValue="keyValue"
          @input="(value) => Object.assign(filterRecord, value)"
          @close="expanded = !expanded"
        />
      </q-dialog>

      <aprobacionItemsList
        v-model="listaCambios"
        :keyValue="keyValue"
        @deleteCambios="(id) => deleteSolicitud(id)"
        @refresh="getRecords(filterRecord)"
        />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['value', 'id', 'keyValue'], 
  data () {
    return {
      expanded: false,
      visible: '',
      filterRecord: {
        persona: '',
        estadoSolicitud: '',
      },
      nomFormulario: 'Aprobación Cambios-Permisos'
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaEstadosSolicitudes']),
    ...mapState('empleados', ['listaEmpleados']),
    ...mapState('login', ['user']), 
    ...mapState('aprobacion', ['listaCambios'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('aprobacion', ['getListaCambios', 'deleteCambios']),
    getRecords (filter) {
      Object.assign(this.filterRecord, filter) // no haría falta pero así obliga a refrescar el componente para que visulice el filtro
      this.$q.loading.show()
      this.getListaCambios(this.filterRecord)
    },
    deleteSolicitud(id){
      this.deleteCambios({id: id , filterR: this.filterRecord})
    }
  },

  mounted() {
    
    if (this.value.filterRecord) { // si ya hemos cargado previamente los recargo al volver a este tab
      if (this.keyValue === 1) { //Es tab de consultar solicitud
        this.nomFormulario = 'Consultar Solicitudes'
      }
      this.expanded = false
      Object.assign(this.filterRecord, this.value.filterRecord)
      this.getRecords(this.filterRecord) // refresco la lista por si se han hecho cambios

    } else { // es la primera vez que entro, cargo valores po defecto
      if (this.keyValue === 1) { //Es tab de consultar solicitud
        this.nomFormulario = 'Consultar Solicitudes'
        this.filterRecord = {  empleado: this.user.pers.id, estadoSolicitud: ['1', '2'] }
      } else {
        //Es aprobador
        this.filterRecord = {  persona: this.user.pers.id, estadoSolicitud: ['1', '2'] }
      }
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
