<template>
  <q-item class="row q-ma-xs q-pa-xs">

    <q-list v-if="value.length>0" v-model="permisosConcedidos" bordered separator class="rounded-borders col">
      <q-separator/>
        <q-item-label header dense class="row bg-indigo-1">
          <div class="col self-center text-center text-grey-8 text-subtitle1">
            <b>Permisos concedidos</b>
          </div>
        </q-item-label>
        <q-scroll-area style="height: calc(100vh - 436px)">
          <div>
            <permisoConcedido v-for="(permiso, key) in value"
              :key="key"
              :permiso="permiso"
              :id="key"
              @refresh="$emit('refresh')">
            </permisoConcedido>
          </div>
        </q-scroll-area>
    </q-list>
    

    <q-banner v-else class="bg-white text-grey-8 col text-center">
      No hay permisos concedidos.
    </q-banner>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
    }
  },
  components: {
    permisoConcedido: require('components/Permisos/PermisosConcedidos/permisoConcedido.vue').default
  },
  computed: {
    ...mapState('permisos', ['permisosConcedidos']),
    ...mapState('login', ['screen'])
  }
}

</script>

<style lang="scss">
  
  .fullScreen {
    height: calc(100vh - 200px);
    max-width: 100vw;
  }

  .sqScreen {
    height: calc(100vh - 100px);
    max-width: 100vw;
}

</style>