  <!-- componente que se llama desde personalMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Filtrar por</div>
    </q-card-section>

    <q-form @submit="getRecords" class="q-gutter-y-xs">
      <q-select
        class="q-pb-xs"
        outlined 
        use-input
        clearable 
        label="Empleado" 
        stack-label
        v-model="filterR.idpersonal"
        :options="listaEmpleadosFilter"
        @filter="filterEmpleados"
        option-value="idPersonal"
        option-label="name"
        emit-value
        map-options
        behavior="menu"
        lazy-rules>
      </q-select>
      <q-input outlined clearable label="Área" stack-label v-model="filterR.area" />
      <q-input outlined clearable label="Equipo ETM" stack-label v-model="filterR.equipoETM" />
      <q-input outlined clearable label="Fecha Desde" stack-label :value="formatDate(filterR.fechaDesde)" @input="val => filterR.fechaDesde=val" >
        <template v-slot:append>
            <q-icon name="event" class="cursos-pointer">
              <q-popup-proxy ref="qFechaDesde">
                <wgDate @input="$refs.qFechaDesde.hide()" v-model="filterR.fechaDesde" />
              </q-popup-proxy>
            </q-icon>
        </template>
      </q-input>
      <q-input outlined clearable label="Fecha Hasta" stack-label :value="formatDate(filterR.fechaHasta)"  @input="val => filterR.fechaHasta=val" >
        <template v-slot:append>
            <q-icon name="event" class="cursos-pointer">
              <q-popup-proxy ref="qFechaHasta">
                <wgDate @input="$refs.qFechaHasta.hide()" v-model="filterR.fechaHasta" />
              </q-popup-proxy>
            </q-icon>
        </template>
      </q-input>
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
import wgDate from 'components/General/wgDate.vue'
export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      tab: 'General',
      listaEmpleadosFilter: [],
      filterR: {}
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('empleados', ['listaEmpleadosRestringido'])
  },
  methods: {
    getRecords () {
      this.$emit('getRecords', this.filterR) // lo captura accionesMain
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    },
    filterEmpleados(val, update, abort){
      update(() =>{
        const needle = val.toLowerCase()
        this.listaEmpleadosFilter = this.listaEmpleadosRestringido.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  },
  components: {
    wgDate: wgDate
  },
  mounted () {
    this.listaEmpleadosFilter = this.listaEmpleadosRestringido
    this.filterR = this.value // asignamos valor del parametro por si viene de otro tab
  
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterR)
  }
}
</script>
