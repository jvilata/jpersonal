<template>
  <q-slide-item left-color="positive" right-color="negative">
    <q-expansion-item
          clickable
          expand-icon="expand_more"
          class="q-pa-xs full-width column"
          group="porAprobar">
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
                <q-item-label lines="2">{{item.empleado.nombrePersona}}</q-item-label>
                <q-item-label caption>{{item.tipo}} </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-badge outline :color="item.estado == 'APROBADO' ? 'positive' : 
                item.estado == 'DENEGADO' ? 'negative' : 
                item.estado == 'CONC. PROVISIONAL' ? 'warning' : 'primary'" 
                :label="item.estado" />
            </q-item-section>
          </template>

          <q-card>
              <q-card-section>
                  <itemMoreInfo :item="item"/>
                  <itemCambioHor v-if="item.tipo == 'CAMBIO HORARIO'" :item="item"/>
                  <itemTeletrab v-if="item.tipo == 'TELETRABAJO'" :item="item"/>
                  <itemOtrosCambios v-if="item.tipo == 'OTROS CAMBIOS'" :item="item"/>

              </q-card-section>
          </q-card>
    </q-expansion-item>
    <template v-slot:left>
      <q-icon name="done" />
    </template>
    <template v-slot:right>
      <q-icon name="close"/>
    </template>
  </q-slide-item>
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
    itemMoreInfo: require('components/Aprobacion/MoreInfoItems/aprobacionItemInfo.vue').default,
    itemCambioHor: require('components/Aprobacion/aprobacionCambioHor.vue').default,
    itemTeletrab: require('components/Aprobacion/aprobacionTeletrab.vue').default,
    itemOtrosCambios: require('components/Aprobacion/aprobacionOtrosCambios.vue').default


  },
  methods: {
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
    colorItem () {
      if (item.estado == 'APROBADO') return 'positive'
      else if (item.estado == 'DENEGADO') return 'negative'
      else if (item.estado == 'CONC. PROVISIONAL') return 'warning'
      else return 'primary'
    }
  }
}
</script>