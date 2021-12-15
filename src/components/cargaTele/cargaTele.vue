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

      <q-btn  flat label="Cargar" color="primary" @click="cargarTele()"/>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      visible: '',
      filterRecord: {},
      nomFormulario: 'Consultar Reservas',
      registrosSeleccionados: [],
      formReserva: {}
    }
  },
  computed: {
    ...mapState('login', ['user']), // importo state.user desde store-login
    ...mapState('empleados', ['listaEmpleados']),
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('empleados', ['calcularResponsable']),
    parseaDatosExtraJSON(v) {
      var obj = { aceptaTeletrabajo: '', paisTeletrabajo: 'ESPAÑA', domicilioTeletrabajo: '', teletrabajoObservaciones: '' }
      try {
        obj = JSON.parse(atob(v))
      }
      catch (e) {}
      return obj
    },
    getDiasTeletrabajo(diasSemanaArr){
      var diasSemana = "2,3,4,5,6"; 
      for (var i = 0; i < diasSemanaArr.length; i++){
        diasSemana = diasSemana.replace(diasSemanaArr[i], ''); // Eliminamos los días elegidos
      }
      return diasSemana;
    },
    generarSolicitudesTele () {
      this.registrosSeleccionados.forEach(valor => {
        var diasSemanaArr = (valor.diassemana !== null ? valor.diassemana.split(',') : null) 
        var diasTeletrabajo = this.getDiasTeletrabajo(diasSemanaArr)

        const obj = this.parseaDatosExtraJSON(valor.datosextra)
        var datosCambio = {
          teletrabajoFechaDesde:  date.formatDate(date.extractDate(valor.fechareserva, 'DD/MM/YYYY'), 'YYYY-MM-DDT00:00:00'),
          teletrabajoFechaHasta: date.formatDate(new Date(2090,11,31), 'YYYY-MM-DDT00:00:00'),
          paisTeletrabajo: obj.paisTeletrabajo,
          aceptaTeletrabajo: obj.aceptaTeletrabajo,
          domicilioTeletrabajo: obj.domicilioTeletrabajo,
          teletrabajoObservaciones: obj.teletrabajoObservaciones,
          diasTeletrabajo: diasTeletrabajo
        }
        var data = {
          consentimientos : '', 
          datosSolicitud: JSON.stringify(datosCambio), 
          denegada: false, 
          diasEfectivos: 0,
          ejercicioAplicacion: 0,
          empleado: valor.idempleado,
          estadoSolicitud: 1,
          estadoSolicitudDesc: '',
          fechaAplicacionCambio: null,
          fechaDesde: datosCambio.teletrabajoFechaDesde,
          fechaHasta: datosCambio.teletrabajoFechaHasta,
          fechaSolicitud: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
          idAutorizadorOf: null,
          nuevaVersion: true,
          observaciones: datosCambio.teletrabajoObservaciones,
          sfechaDesde: datosCambio.teletrabajoFechaDesde,
          sfechaHasta: datosCambio.teletrabajoFechaHasta,
          tipoDiaLibre: 0,
          tipoSolicitud: 'TELETRABAJO'
        }
        if (valor.reservapermanente === '1' && diasSemanaArr.length < 5) {
          this.calcularResponsable({ id: valor.idempleado, tipoSol: 1 }).then(response => {
            data.idAutorizadorOf = JSON.parse(response.data.msg).idResp[0]
            this.$axios.post(`bd_jpersonal.asp?action=soldias&auth=${this.user.auth}`, data)
            .then(result => {})
          })
          .catch(error => {})
        }
      })
    },
    getRecords (filter) {
      // hago la busqueda de registros segun condiciones del formulario Filter que ha lanzado el evento getRecords
      Object.assign(this.filterRecord, filter) // no haría falta pero así obliga a refrescar el componente para que visulice el filtro
      var objFilter = Object.assign({}, filter)
      return this.$axios.get(`bd_reservaMesas.asp?action=findReservaMesas&auth=${this.user.auth}`, { params: objFilter })
        .then(response => {
          this.registrosSeleccionados = response.data
          this.expanded = false
          this.generarSolicitudesTele()
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.message })
        })
    },
    cargarTele () {
      this.filterRecord = { 
        codEmpresa: this.user.codEmpresa,
        // idpersonal: this.user.pers.idpersonal,
        reservaPermanente: '1',
        // area: 'TECNICA',
        fechaDesde: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      this.getRecords(this.filterRecord)
    }
  }
}
</script>
