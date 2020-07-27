<template>
  <q-item class="row q-ma-xs q-pa-xs" >
    <q-list v-if="value.length>0" bordered separator :class="`rounded-borders col ${screen}`">
      <q-separator/>
        <q-item-label header dense class="row bg-indigo-1">
          <div class="col self-center text-center text-grey-8 text-subtitle1">
            <b>({{value.length}}) Resultados de Búsqueda</b>
          </div>
        </q-item-label>
        <div>
          <q-scroll-area :style="screen=='sqScreen' ? 'height: calc(100vh - 284px)' : screen=='fullScreen' ? 'height: calc(100vh - 350px)' : 'height: calc(100vh - 273px)'">
            <div>
              <aprobacionItem v-for="(item, key) in value"
                :key="key"
                :keyValue="keyValue"
                :item="item"
                :id="key"
                @deleteCambios="(id) => $emit('deleteCambios', id)" 
                @refresh="$emit('refresh')"/>
            </div>
          </q-scroll-area>
        </div>

    </q-list>
    

    <q-banner v-else class="bg-white text-grey-8 col text-center">
      No hay permisos por revisar.
    </q-banner>
  </q-item>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['value', 'keyValue'], // en 'value' tenemos la tabla de datos del grid
  computed: {
    ...mapState('login', ['screen'])
  },
  components: {
    aprobacionItem: require('components/Aprobacion/aprobacionItem.vue').default
  }
}

</script>

<style lang="scss">
  
  .fullScreen {
    max-height: calc(100vh - 190px); 
  }

  .sqScreen {
    max-height: calc(100vh - 134px);
  }

  .android {  
    max-height: calc(100vh - 113px);
  }
</style>