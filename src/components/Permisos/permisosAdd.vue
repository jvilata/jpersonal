 <!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Solicitar nuevo permiso</div>
    </q-card-section>

    <q-form @submit="submitPermiso" class="q-gutter-y-xs">

      <q-input 
        outlined 
        clearable 
        label="Fecha Desde" 
        stack-label 
        :value="formatDate(permisoToAdd.fechaDesde)"
        :rules="[val => !!val || 'Campo obligatorio']">
        <template v-slot:append>
            <q-icon name="event" class="cursos-pointer">
              <q-popup-proxy ref="qFechaDesde">
                <wgDate 
                  @input="$refs.qFechaDesde.hide()"
                  v-model="permisoToAdd.fechaDesde" />
              </q-popup-proxy>
            </q-icon>
        </template>
      </q-input>
      <q-input 
        outlined 
        clearable 
        label="Fecha Hasta" 
        stack-label 
        :value="formatDate(permisoToAdd.fechaHasta)"
        :rules="[val => !!val || 'Campo obligatorio']">
        <template v-slot:append>
            <q-icon name="event" class="cursos-pointer">
              <q-popup-proxy ref="qFechaHasta">
                <wgDate 
                  @input="{ $refs.qFechaHasta.hide(); calcDiasEfectivos()}"
                  v-model="permisoToAdd.fechaHasta"/>
              </q-popup-proxy>
            </q-icon>
        </template>
      </q-input>
      <q-select
        :disable="disableNumJornadas"
        ref="diasEfectivos"
        label="N. Jornadas"
        stack-label
        outlined
        clearable
        v-model="permisoToAdd.diasEfectivos"
        :options="numJornadas"
        option-value="id"
        option-label="desc"
        emit-value
        map-options
        :rules="[val => !!val || 'Campo obligatorio']"
      />
      <q-select
        label="Tipo Jorn. Libre"
        stack-label
        outlined
        clearable
        v-model="permisoToAdd.tipoDiaLibre"
        :options="listaTiposDiasLibres"
        option-value="id"
        option-label="descripcionDiaLibre"
        emit-value
        map-options
        :rules="[val => !!val || 'Campo obligatorio']"
      />
      <q-input clearable outlined stack-label type="text" label="Observaciones" v-model="permisoToAdd.observaciones"/>

      <p>{{permisoToAdd}}</p>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="$emit('close')"/><!-- lo captura accionesMain -->
        <q-btn flat type="submit" label="Solicitar" color="primary"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
import wgDate from 'components/General/wgDate.vue'

export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      permisoToAdd: {
        empleado: 0,
        ejercicioAplicacion: 0,
        fechaDesde: '',
        fechaHasta: '',
        diasEfectivos: '',
        tipoDiaLibre: 0
      },
      numJornadas: ['1', '0.5', '0.25'],
      disableNumJornadas: false,
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaTiposDiasLibres']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('permisos', ['addPermisoPendiente']),
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
    submitPermiso() {
      this.permisoToAdd.estado = 1 //PENDIENTE
      this.permisoToAdd.idEmpleado = this.user.pers.id
      this.addPermisoPendiente(this.permisoToAdd)
      console.log('permisoToAdd: ', this.permisoToAdd)
      this.$emit('close')
    },
    calcDiasEfectivos() {
      if (this.permisoToAdd.fechaDesde && this.permisoToAdd.fechaHasta) {
        let diasEfectivos = date.getDateDiff(this.permisoToAdd.fechaHasta, this.permisoToAdd.fechaDesde, 'days') + 1
        if (diasEfectivos > 1) {
          this.permisoToAdd.diasEfectivos = diasEfectivos
          this.disableNumJornadas = true
        } else {
          this.permisoToAdd.diasEfectivos = 1
          this.disableNumJornadas = false
        }
      }
    }
  },
  components: {
    wgDate: wgDate
  },
  mounted () {
    this.permisoToAdd.fechaDesde = new Date ()
    this.permisoToAdd.fechaHasta = new Date ()
    this.calcDiasEfectivos()
    this.permisoToAdd.tipoDiaLibre = 1
    this.permisoToAdd.empleado = this.value.empleado
    this.permisoToAdd.ejercicioAplicacion = this.value.ejercicioAplicacion
  }
}
</script>