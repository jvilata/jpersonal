  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 85vh">
      <q-item class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
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
      <q-linear-progress v-if="visibleProgress" size="25px" :value="progress1" color="accent">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="progressLabel1" />
        </div>
      </q-linear-progress>
      <!-- formulario tabla de resultados de busqueda -->
      <div class="row">
          <div class="col">  
            <q-card class="my-card">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Our Changing Planet</div>
                    <div class="text-subtitle2">by John Doe</div>
                </q-card-section>
              <q-separator />
                <q-card-actions align="center">
                    <q-btn flat>Refrescar</q-btn>
                </q-card-actions>
            </q-card>
            </div> 
           <div class="col">
            <clubSocialGrid
                v-model="listaPersonasFichajes"
                :listaFichajesDetalle="listaFichajesDetalle"
                :listaPersonasHorariosAcum="listaPersonasHorariosAcum"
                />
           </div>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import {clubSocialGrid} from 'components/ClubSocial/ClubSocialGrid.vue'
export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      expanded: false,
      visible: '',
      visibleProgress: false,
      progress1: 0,
      progressLabel1: '0%',
      numseg: 0,
      filterRecord: {},
      nomFormulario: 'Club Social',
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
    progreso () {
      this.numseg++ // 73r->24s, 124r -> 124s, 207r->16s
      var mult = 5
      if (this.listaPersonasHorariosAcum.length > 100 && this.listaPersonasHorariosAcum.length <= 200) mult = 2
      else if (this.listaPersonasHorariosAcum.length > 200  && this.listaPersonasHorariosAcum.length <= 300) mult = 4
      else if (this.listaPersonasHorariosAcum.length > 300) mult = 8
      if (this.listaPersonasHorariosAcum.length > 0) this.progress1 = this.numseg * mult / this.listaPersonasHorariosAcum.length
      else this.progress1 = 0
      this.progressLabel1 = Math.round(this.progress1 * 100) + ' %'
      if (this.progress1 < 1) setTimeout(this.progreso, 1000)
      else  this.visibleProgress = false
    },
    generarPersonas() {
      this.expanded = false
      this.listaPersonasHorariosAcum = []
      this.$q.loading.show()
      this.listaPersonasFichajes.splice(0, this.listaPersonasFichajes.length)
      this.listaFichajesDetalle = []
      const objFilter = {
        area: this.filterRecord.area,
        persona: this.filterRecord.idpersonal, // 24 alberto 942 filippo 506 julio
        equipoETM: this.filterRecord.equipoETM,
        fecha_combo: 'A',
        fecha_date_desde: this.filterRecord.fechaDesde.substring(0,10) + 'T00:00:00',
        fecha_date_hasta: this.filterRecord.fechaHasta.substring(0,10) + 'T23:59:59' // '2021-03-29T23:59:59'
      }
      this.$axios.get(`bd_jpersonal.asp?action=jornadaLaboral&auth=${this.user.auth}`, { params: objFilter }) // tipo acciones
        .then((response) => {
          var listaPersonasHorarios = response.data
          if (listaPersonasHorarios.length === 0) this.$q.loading.hide()
          // ordeno por empleado fecha
          listaPersonasHorarios.sort((a, b) => a.empleado + a.fecha.substring(6,10) + a.fecha.substring(3,5) + a.fecha.substring(0,2) <= b.empleado + b.fecha.substring(6,10) + b.fecha.substring(3,5) + b.fecha.substring(0,2) ? -1 : 1)
          this.listaPersonasHorariosAcum = listaPersonasHorarios
          var numPerFich = listaPersonasHorarios.length
          this.numseg = 0
          this.visibleProgress = true
          if (this.listaPersonasHorariosAcum.length > 0) setTimeout(this.progreso, 1000)

          this.generarFichajesConsolidado(objFilter)
            .then(data1 => {
              var listaFichajes = data1
              listaFichajes.forEach(record => {
                const persHor = listaPersonasHorarios.find(ph => ph.idPersonal === record.personalId && record.ts.substring(0,10) === ph.fecha.substring(6,10) + '-' + ph.fecha.substring(3,5) + '-' + ph.fecha.substring(0,2))
                record.fecha = record.ts
                record.idPersonal = record.personalId
                record.nombre = record.personalNombre
                record.horaEntrada1 = ''
                record.horaSalida1 = ''
                record.horaEntrada2 = ''
                record.horaSalida2 = ''
                if (persHor !== undefined && persHor !== null) {
                  record.horaEntrada1 = persHor.horaEntrada1
                  record.horaSalida1 = persHor.horaSalida1
                  record.horaEntrada2 = persHor.horaEntrada2
                  record.horaSalida2 = persHor.horaSalida2
                }
              })
              listaFichajes.sort((a, b) => a.fecha < b.fecha ? -1 : 0) // ordena fichajes por hora
              this.listaFichajesDetalle = listaFichajes
              // console.log(this.listaFichajesDetalle)
              listaPersonasHorarios.forEach(ph => {
                
                var horasFichadas = 0
                var horasConfiguradas = 0
                var cumpleHorario = false
                var olvidoFichar = false
                const listaFichDia = listaFichajes.filter(record => ph.idPersonal === record.personalId && record.ts.substring(0,10) === ph.fecha.substring(6,10) + '-' + ph.fecha.substring(3,5) + '-' + ph.fecha.substring(0,2))

                if (listaFichDia.length !== 0) { // hay fichjes}
                  var primero = 0
                  var ultimo = 0
                  // compruebo si el primero pasa de las 24h porque entonces sera el ultimo (mx)
                  while (primero < listaFichDia.length && date.formatDate(date.extractDate(listaFichDia[primero].fecha, 'YYYY-MM-DDTHH:mm:ssZ'), 'HH') <= '03') primero++;
                  if (primero > 0) ultimo = 0
                  else ultimo = listaFichDia.length - 1
                  if (primero >= listaFichDia.length) primero = listaFichDia.length - 1
                  const fp = date.extractDate(listaFichDia[primero].fecha, 'YYYY-MM-DDTHH:mm:ssZ') // paso a Date
                  const fu = date.extractDate(listaFichDia[ultimo].fecha, 'YYYY-MM-DDTHH:mm:ssZ')
                  const horaPrimera = date.extractDate(date.formatDate(fp, 'HH:mm:00'),'HH:mm:ss') // hora en locale
                  var horaUltima = date.extractDate(date.formatDate(fu, 'HH:mm:00'),'HH:mm:ss')
                  if (date.formatDate(fu, 'HH') <= '03') horaUltima = date.addToDate(horaUltima, { days: 1 }) // si >24h le sumo 1 dia
                  const horaEntrada = date.extractDate(ph.horaEntrada1,'HH:mm:ss')
                  var horaSalida = date.extractDate(ph.horaSalida2 === '' ? ph.horaSalida1 : ph.horaSalida2,'HH:mm:ss')
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
                  idPersonal: ph.idPersonal,
                  empleado: ph.empleado,
                  fecha: ph.fecha,
                  cumple: cumpleHorario,
                  olvido: olvidoFichar,
                  desfase: horasFichadas - horasConfiguradas
                })
                numPerFich--
                if (numPerFich <= 2) {
                  this.visibleProgress = false
                  this.$q.loading.hide()
                }
                // })
              }) // foreach listapersonashorarios
            })        
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.dialog({ title: 'Error', message: error })
        })
    },
    generarFichajesConsolidado (objFilter) {
      return new Promise((resolve, reject) => {
        // this.$q.loading.show()
        this.$axios.get(`bd_jpersonal.asp?action=fichajes&auth=${this.user.auth}`,{ params: objFilter }) // tipo acciones
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
      clubSocialGrid: clubSocialGrid
  }
}
</script>