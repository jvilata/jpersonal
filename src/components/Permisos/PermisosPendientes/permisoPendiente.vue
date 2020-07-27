<template>
  <q-expansion-item
    class="q-pa-xs full-width column"
    group="permisos">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon color="primary" name="person_search" />
      </q-item-section>

      <q-item-section>
        {{ `${formatDate(permiso.fechaDesde)} a ${formatDate(permiso.fechaHasta)}` }}
        <span class="text-caption text-weight-light">{{ permiso.datosTipoDiaLibre.descripcionDiaLibre }}</span>
      </q-item-section>
    </template>
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