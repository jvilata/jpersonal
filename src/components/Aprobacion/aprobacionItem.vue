<template>
  <q-expansion-item
        clickable
        expand-icon="expand_more"
        :icon="`${this.item.justificante ? 'check' : 'report_problem'}`"
        class="q-pa-xs full-width column"
        group="permisos"
        :label="`${formatDate(item.fechaDesde)} a ${formatDate(item.fechaHasta)}`"
        :caption="item.tipoJornadaLibre">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="person" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            {{item.empleado}}
          </q-item-section>
        </template>
        <q-card>
            <q-card-section>
                <itemMoreInfo :item="item"/>
            </q-card-section>
        </q-card>
    </q-expansion-item>
</template>

<script>
import { date } from 'quasar'

export default {
  props: ['item', 'id'],
  data () {
    return {
      expanded: false,
    }
  },
  components: {
    itemMoreInfo: require('components/Aprobacion/aprobacionItemInfo.vue').default
  },
  methods: {
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    }
  }
}
</script>