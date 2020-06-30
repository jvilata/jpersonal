  <!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <q-card style="width: 400px;" class="q-pr-xs q-gutter-xs">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Filtrar por</div>
    </q-card-section>
    <q-tabs v-model="tab" dense class="text-primary">
          <q-tab name="General" label="General" />
          <q-tab name="Avanzada" label="Avanzada" />
    </q-tabs>

    <q-form @submit="getRecords" class="q-gutter-y-xs">
    <q-tab-panels v-model="tab">
      <q-tab-panel name="General">
        <q-input outlined clearable label="Persona" stack-label v-model="filterR.nombre" />
        <q-input outlined clearable label="Área" stack-label v-model="filterR.area" />
        <q-input outlined clearable label="País Laboral" stack-label v-model="filterR.paisLaboral" />
        <q-input outlined clearable label="País Trabaja" stack-label v-model="filterR.pais" />
      </q-tab-panel>
      <q-tab-panel name="Avanzada">
        <!--q-input outlined clearable label="Agrupación ETM" stack-label v-model="filterR.agrupacionETM" /-->
        <q-input outlined clearable label="Equipo ETM" stack-label v-model="filterR.equipoETM" />
        <q-input outlined clearable label="Fecha Alta Desde" stack-label :value="formatDate(filterR.fechaAltaDesde)" @input="val => filterR.fechaAltaDesde=val" >
          <template v-slot:append>
              <q-icon name="event" class="cursos-pointer">
                <q-popup-proxy>
                  <wgDate v-model="filterR.fechaAltaDesde" />
                </q-popup-proxy>
              </q-icon>
          </template>
        </q-input>
        <q-input outlined clearable label="Fecha Alta Hasta" stack-label :value="formatDate(filterR.fechaAltaHasta)"  @input="val => filterR.fechaAltaHasta=val" >
          <template v-slot:append>
              <q-icon name="event" class="cursos-pointer">
                <q-popup-proxy>
                  <wgDate v-model="filterR.fechaAltaHasta" />
                </q-popup-proxy>
              </q-icon>
          </template>
        </q-input>
        <q-select
          label="Teletrabajo"
          stack-label
          outlined
          clearable
          v-model="filterR.teletrabajo"
          :options="listaSINO"
          option-value="id"
          option-label="desc"
          emit-value
          map-options
        />
        <q-select
          label="Vigente"
          stack-label
          outlined
          clearable
          v-model="filterR.vigente"
          :options="listaSINO"
          option-value="id"
          option-label="desc"
          emit-value
          map-options
        />
      </q-tab-panel>
    </q-tab-panels>
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
      filterR: {}
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO'])
  },
  methods: {
    getRecords () {
      this.$emit('getRecords', this.filterR) // lo captura accionesMain
    },
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD-MM-YYYY')
    }
  },
  components: {
    wgDate: wgDate
  },
  mounted () {
    this.filterR = this.value // asignamos valor del parametro por si viene de otro tab
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterR)
  }
}
</script>
