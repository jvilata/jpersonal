<template>
  <q-expansion-item
    expand-separator
    clickable
    expand-icon="expand_more"
    icon="person_search"
    class="q-pa-xs full-width column"
    group="permisos"
    :label="`${formatDate(permiso.fechaDesde)} a ${formatDate(permiso.fechaHasta)}`"
    :caption="permiso.datosTipoDiaLibre.descripcionDiaLibre">
    <q-card>
        <q-card-section>
            <permisoMoreInfo :permiso="permiso" @refresh="$emit('refresh')"/>
        </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { date } from 'quasar'

export default {
  props: ['permiso', 'id'],
  data () {
    return {
      expanded: false
    }
  },
  components: {
    permisoMoreInfo: require('components/Permisos/PermisosPendientes/permisoPendienteInfo.vue').default
  },
  methods: {
    formatDate (pdate) {
      var d1 = date.extractDate(pdate,'YYYY-MM-DDTHH:mm:ss.000ZZ')
      return date.formatDate(d1, 'DD/MM/YYYY')
    }
  }
}
</script>