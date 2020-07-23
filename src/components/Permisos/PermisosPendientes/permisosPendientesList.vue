<template>
  <q-item class="row q-ma-xs q-pa-xs">

    <q-list v-if="value.length>0" 
      v-model="permisosPendientes"
      bordered 
      separator 
      class="rounded-borders col">
      <q-separator/>
        <q-item-label header dense class="row bg-indigo-1">
          <div class="col self-center text-center text-grey-8 text-subtitle1">
            <b>Permisos pendientes</b>
          </div>
        </q-item-label>

          <q-scroll-area style="height: calc(100vh - 480px)">
            <div>
              <permisoPendiente v-for="(permiso, key) in value"
                :key="key"
                :permiso="permiso"
                :id="key"
                @refresh="$emit('refresh')">
              </permisoPendiente>
            </div>
          </q-scroll-area>

    </q-list>
    

    <q-banner v-else class="bg-white text-grey-8 col text-center">
      No hay permisos pendientes.
    </q-banner>
  </q-item>
</template>

<script>
import { mapState } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
    }
  },
  components: {
    permisoPendiente: require('components/Permisos/PermisosPendientes/permisoPendiente.vue').default
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes']),
    ...mapState('login', ['screen'])
  }
}

</script>

<style lang="scss">
  
  .fullScreen {
    max-height: calc(100vh - 100px);
    max-width: 100vw;
  }

  .sqScreen {
    max-height: calc(100vh - 100px);
    max-width: 100vw;
}

</style>