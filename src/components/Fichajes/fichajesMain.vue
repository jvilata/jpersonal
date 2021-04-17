  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 85vh">
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
            <small>{{ Object.keys(filterRecord).length > 1 ? filterRecord : 'Pulse para definir filtro' }}</small>
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
        <fichajesFilter
          :value="filterRecord"
          @input="(value) => Object.assign(filterRecord, value)"
          @getRecords="generarPersonas"
          @close="expanded = !expanded"
        />
      </q-dialog>
      <q-linear-progress v-if="visibleProgress" size="25px" :value="progress1" color="accent">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="progressLabel1" />
        </div>
      </q-linear-progress>
      <!-- formulario tabla de resultados de busqueda -->
      <fichajesGrid
        v-model="listaPersonasFichajes"
        :listaFichajesDetalle="listaFichajesDetalle"
        :listaPersonasHorariosAcum="listaPersonasHorariosAcum"
        />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import fichajesFilter from 'components/Fichajes/fichajesFilter.vue'
import fichajesGrid from 'components/Fichajes/fichajesGrid.vue'
export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      visible: '',
      filterRecord: {},
      visibleProgress: false,
      progress1: 0,
      progressLabel1: '0%',
      nomFormulario: 'Fichajes',
      listaPersonasHorariosAcum: [],
      listaPersonasFichajes: [],
      listaFichajesDetalle: []
    }
  },
  computed: {
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    generarPersonas() {
      this.expanded = false
      this.visibleProgress = true
      this.$q.loading.show()
      this.listaPersonasFichajes.splice(0, this.listaPersonasFichajes.length)
      this.listaFichajesDetalle = []
      const objFilter = {
        area: this.filterRecord.area,
        persona: this.filterRecord.idpersonal, // 24 alberto 942 filippo 506 julio
        fecha_combo: 'A',
        fecha_date_desde: this.filterRecord.fechaDesde + 'T00:00:00',
        fecha_date_hasta: this.filterRecord.fechaHasta + 'T23:59:59' // '2021-03-29T23:59:59'
      }
      this.$axios.get(`bd_jpersonal.asp?action=jornadaLaboral&auth=${this.user.auth}`, { params: objFilter }) // tipo acciones
        .then((response) => {
          var listaPersonasHorarios = response.data
          if (listaPersonasHorarios.length === 0) this.$q.loading.hide()
          // ordeno por empleado fecha
          listaPersonasHorarios.sort((a, b) => a.empleado + a.fecha.substring(6,10) + a.fecha.substring(3,5) + a.fecha.substring(0,2) <= b.empleado + b.fecha.substring(6,10) + b.fecha.substring(3,5) + b.fecha.substring(0,2) ? -1 : 1)
          this.listaPersonasHorariosAcum = this.listaPersonasHorariosAcum.concat(listaPersonasHorarios)
          var numPerFich = listaPersonasHorarios.length
          listaPersonasHorarios.forEach(pers => {
            const objFilterFichaje = {
              persona: pers.idPersonal,
              fecha_combo: 'A',
              fecha_date_desde: pers.fecha.substring(6,10) + '-' + pers.fecha.substring(3,5) + '-' + pers.fecha.substring(0,2) + 'T00:00:00',
              fecha_date_hasta: pers.fecha.substring(6,10) + '-' + pers.fecha.substring(3,5) + '-' + pers.fecha.substring(0,2) + 'T23:59:59'
            }
            this.generarFichajesTele(objFilterFichaje)
            .then(data1 => {
              var listaFichajes = data1
              this.generarFichajesPresen(objFilterFichaje)
              .then(data => {
                data.forEach(record => {
                  if (record.datetime.substring(0,10) === pers.fecha.substring(6,10) + '-' + pers.fecha.substring(3,5) + '-' + pers.fecha.substring(0,2)) {
                    listaFichajes.push({
                      fecha: record.datetime,
                      idPersonal: pers.idPersonal,
                      nombre: pers.empleado
                    })
                  }
                })
                listaFichajes.forEach(fich => {
                  fich.horaEntrada1 = pers.horaEntrada1
                  fich.horaSalida1 = pers.horaSalida1
                  fich.horaEntrada2 = pers.horaEntrada2
                  fich.horaSalida2 = pers.horaSalida2
                })
                this.listaFichajesDetalle = this.listaFichajesDetalle.concat(listaFichajes)
                // console.log(this.listaFichajesDetalle)
                var horasFichadas = 0
                var horasConfiguradas = 0
                var cumpleHorario = false
                var olvidoFichar = false
                if (listaFichajes.length !== 0) { // hay fichjes}
                  listaFichajes.sort((a, b) => a.fecha < b.fecha ? -1 : 0) // ordena fichajes por hora
                  var primero = 0
                  var ultimo = 0
                  // compruebo si el primero pasa de las 24h porque entonces sera el ultimo (mx)
                  while (primero < listaFichajes.length && date.formatDate(date.extractDate(listaFichajes[primero].fecha, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'), 'HH') <= '03') primero++;
                  if (primero > 0) ultimo = 0
                  else ultimo = listaFichajes.length - 1
                  if (primero >= listaFichajes.length) primero = listaFichajes.length - 1
                  const fp = date.extractDate(listaFichajes[primero].fecha, 'YYYY-MM-DDTHH:mm:ss.SSSZZ') // paso a Date
                  const fu = date.extractDate(listaFichajes[ultimo].fecha, 'YYYY-MM-DDTHH:mm:ss.SSSZZ')
                  const horaPrimera = date.extractDate(date.formatDate(fp, 'HH:mm:00'),'HH:mm:ss') // hora en locale
                  var horaUltima = date.extractDate(date.formatDate(fu, 'HH:mm:00'),'HH:mm:ss')
                  if (date.formatDate(fu, 'HH') <= '03') horaUltima = date.addToDate(horaUltima, { days: 1 }) // si >24h le sumo 1 dia
                  const horaEntrada = date.extractDate(pers.horaEntrada1,'HH:mm:ss')
                  var horaSalida = date.extractDate(pers.horaSalida2 === '' ? pers.horaSalida1 : pers.horaSalida2,'HH:mm:ss')
                  if (date.formatDate(horaSalida,'HH') < '03') horaSalida = date.addToDate(horaSalida, { days: 1 })
                  horasFichadas = date.getDateDiff(horaUltima, horaPrimera, 'minutes')/60
                  horasConfiguradas = date.getDateDiff(horaSalida, horaEntrada, 'minutes')/60
                  // console.log(horaPrimera, horaUltima, horaEntrada, horaSalida)
                  if (Math.abs(horasFichadas - horasConfiguradas) > 2) olvidoFichar = true
                  if (horasFichadas - horasConfiguradas > -0.3) cumpleHorario = true
                } else {
                  olvidoFichar = true
                  horasFichadas = -8
                }
                this.listaPersonasFichajes.push({
                  id: Math.random() * 100000, // key
                  idPersonal: pers.idPersonal,
                  empleado: pers.empleado,
                  fecha: pers.fecha,
                  cumple: cumpleHorario,
                  olvido: olvidoFichar,
                  desfase: horasFichadas - horasConfiguradas
                })
                numPerFich--
                this.progress1 =(listaPersonasHorarios.length - numPerFich) / listaPersonasHorarios.length
                this.progressLabel1 = Math.round(this.progress1 * 100) + ' %'
                if (numPerFich === 0) {
                  this.$q.loading.hide()
                  this.visibleProgress = false
                }
              })
            })
          })        
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.dialog({ title: 'Error', message: error })
        })
    },
    generarFichajesTele (objFilter) {
      return new Promise((resolve, reject) => {
        // this.$q.loading.show()
        this.$axios.get(`bd_jpersonal.asp?action=telefichajes&auth=${this.user.auth}`, { params: objFilter }) // tipo acciones
          .then((response) => {
            // this.$q.loading.hide()
            resolve(response.data)
          })
          .catch(error => {
            this.$q.loading.hide()
            this.$q.dialog({ title: 'Error', message: error })
            reject(error)
          })
      })
    },
    generarFichajesPresen (objFilter) {
      return new Promise((resolve, reject) => {
        // this.$q.loading.show()
        this.$axios.get(`bd_jpersonal.asp?action=fichajesMX&auth=${this.user.auth}`, { params: objFilter }) // tipo acciones
          .then((response) => {
            // this.$q.loading.hide()
            resolve(response.data)
          })
          .catch(error => {
            this.$q.loading.hide()
            this.$q.dialog({ title: 'Error', message: error })
            reject(error)
          })
      })
    }
  },
  mounted () {
    this.filterRecord = { fechaDesde: date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DD') , fechaHasta: date.formatDate(new Date(), 'YYYY-MM-DD') }
  },
  components: {
    fichajesFilter: fichajesFilter,
    fichajesGrid: fichajesGrid
  }
}
</script>
