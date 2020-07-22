<template>
  <q-expansion-item
    class="q-pa-xs full-width column"
    group="permisos">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon :color="color" :name="icon" />
      </q-item-section>

      <q-item-section>
        {{ `${formatDate(permiso.fechaDesde)} a ${formatDate(permiso.fechaHasta)}` }}
        <span class="text-caption text-weight-light">{{ permiso.datosTipoDiaLibre.descripcionDiaLibre }}</span>
      </q-item-section>
    </template>
        <q-card>
            <q-card-section>
                <permisoMoreInfo :permiso="permiso" @refresh="$emit('refresh')" />
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
      icon: '',
      color: '',
    }
  },
  components: {
    permisoMoreInfo: require('components/Permisos/PermisosConcedidos/permisoConcedidoInfo.vue').default
  },
  methods: {
    formatDate (pdate) {
      var d1 = date.extractDate(pdate,'YYYY-MM-DDTHH:mm:ss.000ZZ')
      return date.formatDate(d1, 'DD/MM/YYYY')
    },
  },
  mounted() {
    if (this.permiso.tipoDiaLibre == 9 || this.permiso.tipoDiaLibre == 19) {
      if (this.permiso.justificantesValidados > 0) {
        this.icon = "check"
        this.color = "positive"
      } else if (this.permiso.justificantesNoValidados > 0) {
        this.icon = "policy"
        this.color = "warning"
      } else {
        this.icon = "warning"
        this.color = "negative"
      }
    } else {
      this.icon = "check"
      this.color = "positive"
    }
  }
}
</script>