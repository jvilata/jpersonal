<template>
  <div style="height: 80vh">
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
          <small>{{ 
            Object.keys(filterRecord).length > 1 ? `Empleado: ${(listaEmpleados.find(record => record.id === filterRecord.empleado)).name}  Ejercicio: ${filterRecord.ejercicioAplicacion}` : 'Pulse para definir filtro' 
            }}</small>
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
        :filialEmp="empleadoP.filialEmpleado"
        @input="(value) => Object.assign(filterRecord, value)"
        @getPermisos="(value) => getPermisos(value)"
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
      ],
      empleadoP: {
        filialEmpleado: {},
        diasPendientes: {},
        diasConcedidos: {},
        idAutorizadorOf: 0
      },
    }
  },
  components: {
    permisosFilter: require('components/Permisos/permisosFilter.vue').default
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes', 'permisosConcedidos']),
    ...mapState('empleados', ['listaEmpleados']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('permisos', ['getPermisosPendientes', 'getPermisosConcedidos']),
    ...mapActions('empleados', ['loadFilialEmpleado', 'loadDiasPendientes', 'loadDiasConcedidos', 'calcularResponsable', 'sendMail']),
    verNormativa() {
      // Instalar inAppBrowser para ios
      openURL('http://www.edicomgroup.com')
    },
    getPermisos(value) {
      //Object.assign(this.filterRecord, value)
      var objFilter = { solIdEmpleado: value.empleado, solejercicio: value.ejercicioAplicacion }
      this.getPermisosPendientes(objFilter)
      this.getPermisosConcedidos(objFilter)
    },
    empleadoSelec(value) {
      console.log('valueEmp', value);
      
      this.loadFilialEmpleado(value.empleado).then(response => {
        this.empleadoP.filialEmpleado = response
      })
      
      var objFilter = { solIdEmpleado: value.empleado, solejercicio: value.ejercicioAplicacion }
      this.loadDiasPendientes(objFilter).then((response) => {
        this.empleadoP.diasPendientes.tdiasvacaciones = response.data[0].diasdevacaciones
        this.empleadoP.diasPendientes.tdiaspendientes = 0
        for(let permiso of this.permisosPendientes) {
          if (permiso.tipoDiaLibre === 1) {
            this.empleadoP.diasPendientes.tdiaspendientes += permiso.diasEfectivos
          }
        }
      })
      .catch(error => {
        console.log('loadDiasPendientes', error);
      })

      objFilter = { IdEmpleado: value.empleado, solejercicio: value.ejercicioAplicacion }
      this.loadDiasConcedidos(objFilter).then(response => {
        this.empleadoP.diasConcedidos = response.data
        this.empleadoP.diasPendientes.tdiaslibres = this.empleadoP.diasPendientes.tdiasvacaciones - this.empleadoP.diasPendientes.tdiaspendientes - this.empleadoP.diasConcedidos.tdiasVacaciones
        console.log('This should come first: diaslib', this.empleadoP.diasPendientes.tdiaslibres);
      })

      this.calcularResponsable({ id: value.empleado, tipoSol: 1 }).then(response => {
        this.empleadoP.idAutorizadorOf = JSON.parse(response.data.msg).idResp[0]
      })
      .catch(error => {
        console.log('calcularResponsable', error);
        
      })
    },
  },
  mounted () {
    if (this.value.filterRecord) { // si ya hemos cargado previamente los recargo al volver a este tab
      this.expanded = false
      Object.assign(this.filterRecord, this.value.filterRecord)
      this.getPermisos(this.filterRecord) // refresco la lista por si se han hecho cambios
      this.empleadoSelec(this.filterRecord)
    } else { // es la primera vez que entro, cargo valores por defecto
      this.filterRecord = { empleado: this.user.pers.id, ejercicioAplicacion: (new Date()).getFullYear()  }
      this.getPermisos(this.filterRecord)
      this.empleadoSelec(this.filterRecord)
    }
    this.$router.replace({ name: this.menuItems[0].link.name, params: { id: this.id, value: { filterRecord: this.filterRecord, empleadoP: this.empleadoP } } })
    console.log('This should come second');
    
  }, 
  destroyed () {
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: this.filterRecord, empleadoP: this.empleadoP })
  }
}
</script>