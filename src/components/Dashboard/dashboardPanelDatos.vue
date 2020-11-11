<template>
  <div style="height: calc(100vh - 300px);" class="q-pa-md q-gutter-md" >
    <div class="row">
      <q-card class="col-6 col-md bg-green-1">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-bold">Empleados Global</div>
          <div class="text-h5 text-green-7 text-weight-bold">{{ parseFloat(registrosPanelDatos.numemp) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-6 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">Empleados ES</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numempes) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-6 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">Empleados MX</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numempmx) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-6 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">Empleado OTROS</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numempotros) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row">
      <q-card class="col-6 col-md bg-green-1">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-bold">NºTécnicos</div>
          <div class="text-h5 text-green-7 text-weight-bold">{{ parseFloat(registrosPanelDatos.numtec) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-6 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºComerciales</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numcom) | numeralFormat('0,0')  }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-6 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºAdministración</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numadm) | numeralFormat('0,0')  }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row">
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºConsultores</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numcons) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºDir.Proyectos</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numdirp) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºConf.ASP</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numasp) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºI+D</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numdesa) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºSist</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numsist) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºCau</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numcau) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-3 col-md">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-light">NºTest</div>
          <div class="text-h5 text-green-7 text-weight-light">{{ parseFloat(registrosPanelDatos.numtest) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row">
      <q-card class="col-6 col-md bg-green-1">
        <q-card-section align="center">
          <div class="text-subtitle-2 text-grey-8 text-weight-bold">NºClientes</div>
          <div class="text-h5 text-green-7 text-weight-bold">{{ parseFloat(registrosPanelDatos.numclientes) | numeralFormat('0,0') }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>

</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: ['value'], // en 'value' tenemos la tabla de datos del grid
  data () {
    return {
      registrosPanelDatos: []
    }
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    getPanelDatos (objFilter) {
      // cards diversos datos
      this.$axios.get('bd_dashboard.asp?action=findPanelDatosPer', { params: objFilter })
        .then(response => {
          this.registrosPanelDatos = response.data[0]
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    }
  },
  mounted () {
    this.getPanelDatos(this.value) // carga datos de panel datos
  }
}
</script>
