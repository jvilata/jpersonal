id
ejercicio
fechaDesde
fechaHasta
numJornadas
tipoJornadaLibre
observaciones
sustituto
sustFDesde
sustFHasta
justValidados
justNoValid
autSinDoc

<template>
  <q-expansion-item
        clickable
        expand-icon="article"
        icon="check"
        class="q-pa-xs full-width column"
        group="permisos"
        :label="`${permiso.id}`"
        :caption="permiso.tipoJornadaLibre">
        <q-card>
            <q-card-section>
                <permisoMoreInfo :permiso="permiso"/>
            </q-card-section>
        </q-card>
    </q-expansion-item>
</template>

<script>
export default {
  props: ['permiso', 'id'],
  data () {
    return {
      expanded: false
    }
  },
  components: {
    permisoMoreInfo: require('components/Permisos/PermisosConcedidos/permisoConcedidoInfo.vue').default
  }
}
</script>