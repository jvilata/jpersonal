<template>
  <q-expansion-item
        clickable
        expand-icon="expand_more"
        :icon="`${this.permiso.justificante ? 'check' : 'report_problem'}`"
        class="q-pa-xs full-width column"
        group="permisos"
        :label="`${formatDate(permiso.fechaDesde)} a ${formatDate(permiso.fechaHasta)}`"
        :caption="permiso.datosTipoDiaLibre.descripcionDiaLibre">
        <q-card>
            <q-card-section>
                <permisoMoreInfo :permiso="permiso"/>
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
      expanded: false,
    }
  },
  components: {
    permisoMoreInfo: require('components/Permisos/PermisosConcedidos/permisoConcedidoInfo.vue').default
  },
  methods: {
    formatDate (pdate) {
      let dateObj = pdate.split((/[-: T]/g))
      var YYYY = dateObj[0] + '';
      var MM = (dateObj[1]) + '';
      MM = (MM.length === 1) ? '0' + MM : MM;
      var DD = dateObj[2] + '';
      DD = (DD.length === 1) ? '0' + DD : DD;
      return DD + "/" + MM + "/" + YYYY;
    }
  },
  mounted() {
    console.log('permiso', this.permiso);
  }
}
</script>