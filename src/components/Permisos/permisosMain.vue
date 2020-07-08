<template>
  <div style="height: 85vh">
    <q-item clickable v-ripple @click="expanded = !expanded" class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
      <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
      <q-item-section avatar class="q-ml-sm">
        <q-icon name="note_add" size="md"/>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">
          {{ nomFormulario }}
        </q-item-label>
        <q-item-label>
          <small>{{ Object.keys(filterRecord).length > 1 ? filterRecord : 'Pulse para definir filtro' }}</small>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
        @click="$emit('close')"
        flat
        round
        dense
        icon="close"/>
      </q-item-section>
    </q-item>

    <q-dialog v-model="expanded"  >
      <!-- formulario con campos de filtro -->
      <permisosFilter
        :value="filterRecord"
        @input="(value) => Object.assign(filterRecord, value)"
        @getPermisos="getPermisos"
        @empleadoSelec="(value) => empleadoSelec(value)"
        @close="expanded = !expanded"
      />
    </q-dialog>

    <q-tab-panels v-model="ltab" animated >
      <q-tab-panel v-for="(tab, index) in menuItems" :key="index" :name="tab.link.name"  class="q-pa-none">
        <router-view @close="$emit('close')"/>
      </q-tab-panel>
    </q-tab-panels>
    <!-- podemos poner tabs en el pie para dispositivos moviles pero quita pantalla y no me gusta bg-primary text-white -->
    <q-tabs 
      v-model="ltab" 
      dense
      active-color="white"
      indicator-color="white"
      align="justify"
      narrow-indicator
      class="absolute-bottom bg-primary text-blue-grey-2">
      <q-route-tab v-for="(tab,index) in menuItems"
        no-caps
        :key="index"
        :label="tab.title"
        :name="tab.link.name"
        :to="{ name: tab.link.name, params: { id: id, value: value } }"
        exact>
      </q-route-tab>
    </q-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { openURL } from "quasar";

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      nomFormulario: 'Solicitud de permisos',
      filterRecord: {},
      expanded: false,
      nuevoPermiso: false,
      ltab: '',
      menuItems: [
        {
          title: 'Permisos pendientes',
          link: { name: 'permisosPendientes' }
        },
        {
          title: 'Permisos concedidos',
          link: { name: 'permisosConcedidos' }
        }
      ]
    }
  },
  components: {
    permisosFilter: require('components/Permisos/permisosFilter.vue').default
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes', 'permisosConcedidos']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('permisos', ['getPermisosPendientes', 'getPermisosConcedidos']),
    ...mapActions('empleados', ['setEmpleadoSelec']),
    verNormativa() {
      // Instalar inAppBrowser para ios
      openURL('http://www.edicomgroup.com')
    },
    getPermisos() {
      console.log('filterRecord', this.filterRecord);
      
      var objFilter = { solIdEmpleado: this.filterRecord.empleado, solejercicio: this.filterRecord.ejercicioAplicacion }
      this.getPermisosPendientes(objFilter)
      this.getPermisosConcedidos(objFilter)
    },
    empleadoSelec(value) {
      this.setEmpleadoSelec(value)
    },
  },
  mounted () {
    if (this.value.filterRecord) { // si ya hemos cargado previamente los recargo al volver a este tab
      this.expanded = false
      Object.assign(this.filterRecord, this.value.filterRecord)
      this.getPermisos(this.filterRecord) // refresco la lista por si se han hecho cambios
    } else { // es la primera vez que entro, cargo valores por defecto
      this.filterRecord = { empleado: this.user.pers.id, ejercicioAplicacion: (new Date()).getFullYear()  }
      this.getPermisos(this.filterRecord)
      this.setEmpleadoSelec(this.user.pers)
    }
    this.$router.replace({ name: this.menuItems[0].link.name, params: { id: this.id, value: this.filterRecord } })
  },
  destroyed () {
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: this.filterRecord })
  }
}
</script>