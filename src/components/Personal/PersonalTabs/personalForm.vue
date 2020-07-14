<template>
  <div style="height: calc(100vh - 200px)">
    <q-card flat>
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
                <q-input autofocus outlined v-model="recordToSubmit.nombre" label="Nombre" class="col-xs-9 col-sm-6"/>
                <div class="col-xs-3 col-sm-3" align="center">
                  <q-avatar rounded size="100px">
                    <q-img  :src="`${urlF}${recordToSubmit.idPersonal}.jpg`" />
                  </q-avatar>
                </div>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined v-model="recordToSubmit.codpuesto" label="Cargo/Puesto de Trabajo" class="col-xs-7 col-sm-5"/>
                <q-input outlined v-model="recordToSubmit.id" label="ID" class="col-xs-2 col-sm-3" />
                <q-input outlined v-model="recordToSubmit.idPersonal" label="IDPersonal" class="col-xs-3 col-sm-3" />
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-9 col-sm-5" outlined v-model="user.pers.datosArea.nombre" label="Area"/>
              <q-input outlined v-model="user.pers.vigente" label="Vigente" class="col-xs-3 col-sm-3" />
              <q-input outlined v-model="recordToSubmit.cargoWeb" label="Cargo Web" class="col-xs-9 col-sm-6"/>
              <q-input outlined v-model="recordToSubmit.ordenWeb" label="Orden Web" class="col-xs-3 col-sm-2" />
              <q-input class="col-xs-3 col-sm-3" outlined v-model="recordToSubmit.horario" label="Horario" />
              <q-input class="col-xs-6 col-sm-2" outlined v-model="recordToSubmit.grupoETM" label="Grupo ETM"/>
              <q-input class="col-xs-3 col-sm-2" outlined v-model="user.pers.tutor" label="Tutor"/>
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-8 col-sm-5" outlined v-model="user.pers.emailAutorizador" label="Autorizador"/>
              <q-input class="col-xs-4 col-sm-5" outlined v-model="recordToSubmit.consentimientoImagen" label="Consent.Imagen"/>
            </div>
            <q-input class="row q-mb-sm" outlined v-model="recordToSubmit.vehiculo" label="Vehiculo" autogrow @keyup.enter.stop />
            <div class="row justify-center text-center q-pt-lg">
              <div class="col-xs-12 justify-center">
                <q-btn
                  @click="openForm('otrosCambios')" 
                  color="primary" 
                  label="Solicitar Cambios" 
                  style="height: 60px"/>
              </div>
            </div>
          </q-card-section>
        
       
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { headerFormData, urlFotos } from 'boot/axios.js'

export default {
  props: ['value', 'id', 'keyValue'],
  data () {
    return {
      title: 'Activos',
      urlF: urlFotos,
      listaEntidadesFilter: [],
      recordToSubmit: {
        id: -1,
        nombre: '',
        tipoActivo: '',
        estadoActivo: '',
        tipoProducto: '',
        moneda: '',
        idEntidad: 0
      } // inicializamos los campos, sino no funciona bien
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('empleados', ['loadDetalleEmpleado']),
    ...mapActions('tabs', ['addTab']),
    openForm (otrosCambios) {
      this.addTab(['otrosCambios', 'Otros Cambios', {}, this.id])
    },
    
    calculaAnyosExperiencia(){
       var fechaActual = (new Date()).getFullYear()
          var fechaInicio = date.formatDate(extractDate(this.user.pers.fecha_de_alta, 'YYYY-MM-DDTHH:mm:ss'), 'YYYY')
         return fechaActual - fechaInicio
    }
  },
  mounted () {
      //Llamaremos al BACKEND para pedir datos de este usuario 
      this.loadDetalleEmpleado(this.user.pers.id)
       .then(response => {
         this.recordToSubmit = Object.assign({}, response.data) // v-model: en 'value' podemos leer el valor del v-model
       })
    },
  destroyed () {
    this.$emit('input', this.recordToSubmit) // v-model: para devolver el valor a atributo 'value', evento input
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: {}, registrosSeleccionados: Object.assign({}, this.recordToSubmit) }) // para conservar valores cuando vuelva a selec tab
  }
}
</script>

