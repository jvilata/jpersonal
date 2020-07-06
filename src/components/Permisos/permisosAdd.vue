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
                    @input="{ $refs.qFechaHasta.hide(); calcNumJornadas()}"
                    v-model="permisoToAdd.fechaHasta"/>
                </q-popup-proxy>
              </q-icon>
          </template>
        </q-input>
        <q-select
          :disable="disable"
          ref="numJornadas"
          label="N. Jornadas"
          stack-label
          outlined
          clearable
          v-model="permisoToAdd.numJornadas"
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
          v-model="permisoToAdd.tipoJornadaLibre"
          :options="listaTiposDiasLibres"
          option-value="id"
          option-label="descripcion_dia_libre"
          emit-value
          map-options
          :rules="[val => !!val || 'Campo obligatorio']"
        />
        <q-input clearable outlined stack-label type="text" label="Observaciones" v-model="permisoToAdd.observaciones"/>

        <!-- <p>{{permisoToAdd}}</p> -->

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="$emit('close')"/><!-- lo captura accionesMain -->
        <q-btn flat type="submit" label="Solicitar" color="primary"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { date } from 'quasar'
import wgDate from 'components/General/wgDate.vue'

export default {
  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      permisoToAdd: {
        numJornadas: ''
      },
      numJornadas: ['1', '0.5', '0.25'],
      disable: false
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
      permisoToAdd.ejercicio = '2020' //Poner año en curso (Date)
      permisoToAdd.estado = 1 //PENDIENTE
      permisoToAdd.idEmpleado = this.user.pers.id
      this.addPermisoPendiente(this.permisoToAdd)
      this.$emit('close')
    },
    calcNumJornadas() {
      if (this.permisoToAdd.fechaDesde && this.permisoToAdd.fechaHasta) {
        let numJornadas = date.getDateDiff(this.permisoToAdd.fechaHasta, this.permisoToAdd.fechaDesde, 'days') + 1
        if (numJornadas > 1) {
          this.permisoToAdd.numJornadas = numJornadas
          this.disable = true
        } else {
          this.permisoToAdd.numJornadas = 1
          this.disable = false
        }
      }
    }
  },
  components: {
    wgDate: wgDate
  }
}
</script>