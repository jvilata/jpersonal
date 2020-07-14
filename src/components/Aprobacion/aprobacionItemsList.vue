<template>
  <q-item class="row q-ma-xs q-pa-xs">

    <q-list v-if="value.length>0" bordered separator class="rounded-borders col">
      <q-separator/>
        <q-item-label header dense class="row bg-indigo-1">
          <q-btn-dropdown class="col-1" dropdown-icon="more_vert" size="md" unelevated dense no-icon-animation>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Opción 1</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Opción 2</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Opción 3</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <div class="col self-center text-center text-grey-8 text-subtitle1">
            <b>({{value.length}}) Cambios pendientes de aprobación</b>
          </div>
        </q-item-label>
        <aprobacionItem v-for="(item, key) in value"
          :key="key"
          :item="item"
          :id="key"
          @deleteCambios="(id) => $emit('deleteCambios', id)" />

    </q-list>
    

    <q-banner v-else class="bg-white text-grey-8 col text-center">
      No hay permisos por revisar.
    </q-banner>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  components: {
    aprobacionItem: require('components/Aprobacion/aprobacionItem.vue').default
  }
}

</script>
<style lang="sass">
  .personalGrid-header-table
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
      /* bg color is important for th; just specify one */
      background-color: $indigo-1

    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0

    /* this is when the loading indicator appears */
    &.q-table--loading thead tr:last-child th
      /* height of all previous header rows */
      top: 48px
</style>