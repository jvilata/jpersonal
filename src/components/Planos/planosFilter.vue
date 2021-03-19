  <!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Datos de reserva</div>
    </q-card-section>

    <q-form @submit="getRecords" class="q-gutter-y-xs">
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
        <q-select
          label="Sala"
          stack-label
          outlined
          clearable
          v-model="filterR.sala"
          :options="listaSalas"
          option-value="codElemento"
          option-label="valor2"
          emit-value
          map-options
        />
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
  data () {
    return {
      tab: 'General',
      filterR: {}
    }
  },

  props: ['filtro'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  computed: {
    ...mapState('tablasAux', ['listaSalas'])
  },
  methods: {
    getRecords () {
      this.$emit('getRecords', this.filterR) // lo captura accionesMain
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    }
  },
  mounted () {
    this.filterR = Object.assign({}, this.filtro) // asignamos valor del parametro por si viene de otro tab
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterR)
  },
  components: {
    wgDate
  }
}
</script>
