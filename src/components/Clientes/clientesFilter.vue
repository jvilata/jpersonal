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
        <q-input outlined clearable label="Nombre" stack-label v-model="filterR.nombre" />
        <q-input outlined clearable label="País" stack-label v-model="filterR.pais" />
        <q-select
          label="Tipo Cliente"
          stack-label
          outlined
          clearable
          v-model="filterR.tipoCliente"
          :options="listaTiposCliente"
          option-value="id"
          option-label="desc"
          emit-value
          map-options
        />
      </q-tab-panel>
      <q-tab-panel name="Avanzada">
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
export default {
  data () {
    return {
      tab: 'General',
      filterR: {}
    }
  },

  props: ['value'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
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
  mounted () {
    this.filterR = Object.assign({}, this.value) // asignamos valor del parametro por si viene de otro tab
  },
  destroyed () {
    // guardamos valor en tabs por si despus queremos recuperarlo
    this.$emit('input', this.filterR)
  }
}
</script>
