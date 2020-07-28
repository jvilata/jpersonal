<template>
  <div :style="screen=='sqScreen' ? 'height: calc(100vh - 227px)' : screen=='fullScreen' ? 'height: calc(100vh - 283px)' : 'height: calc(100vh - 207px)'">
    <q-card flat>
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
                <q-input autofocus readonly outlined v-model="recordToSubmit.nombre" label="Nombre" class="col-xs-9 col-sm-6"/>
                <div class="col-xs-3 col-sm-3" align="center">
                  <q-avatar rounded size="100px">
                    <q-img  :src="`${urlF}${recordToSubmit.idPersonal}.jpg`" />
                  </q-avatar>
                </div>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined readonly v-model="recordToSubmit.id" label="ID" class="col-xs-2 col-sm-3" />
                <q-input outlined readonly v-model="recordToSubmit.idPersonal" label="IDPersonal" class="col-xs-3 col-sm-3" />
                <q-input class="col-xs-7 col-sm-5" outlined readonly v-model="user.pers.datosArea.nombre" label="Area"/>
                
            </div>
            <div class="row q-mb-sm">
              <q-select 
                  outlined 
                  v-model="recordToSubmit.codPuesto" 
                  readonly
                  label="Cargo/Puesto de Trabajo" 
                  :options="listaPuestos"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  behavior="menu"
                  class="col-xs-9 col-sm-5"/>
              <q-input outlined readonly v-model="user.pers.vigente" label="Vigente" class="col-xs-3 col-sm-3" />
              <q-input outlined readonly v-model="recordToSubmit.cargoWeb" label="Cargo Web" class="col-xs-9 col-sm-6"/>
              <q-input outlined readonly v-model="recordToSubmit.ordenWeb" label="Orden Web" class="col-xs-3 col-sm-2" />
              <q-input class="col-xs-3 col-sm-3" outlined readonly v-model="recordToSubmit.horario" label="Horario" />
              <q-input class="col-xs-6 col-sm-2" outlined readonly v-model="recordToSubmit.grupoETM" label="Grupo ETM"/>
              <q-input class="col-xs-3 col-sm-2" outlined readonly v-model="user.pers.tutor" label="Tutor"/>
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-8 col-sm-5" outlined readonly v-model="user.pers.emailAutorizador" label="Autorizador"/>
              <q-input class="col-xs-4 col-sm-5" outlined readonly v-model="recordToSubmit.consentimientoImagen" label="Consent.Imagen"/>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-xs-8">
                <q-input outlined clearable v-model="recordToSubmit.vehiculo" label="Vehiculo" autogrow @keyup.enter.stop> 
                </q-input>
              </div>
              <div class="col-xs-4">
                  <q-btn outline color="primary" label="Editar Mat" @click="editLicensePlate()" icon="edit" />
              </div>
            </div>
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
import querystring from 'querystring'

export default {
  props: ['value', 'id', 'keyValue'],
  data () {
    return {
      done: false,
      urlF: urlFotos,
      recordToSubmit: {
        id: -1,
        nombre: '',
        codPuesto: 0,
        vehiculo: ''
      }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('empleados', ['listaPuestos']),
    ...mapState('login', ['user', 'screen'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('empleados', ['loadDetalleEmpleado', 'loadListaPuestos']),
    ...mapActions('tabs', ['addTab']),
    openForm (otrosCambios) {
      this.addTab(['otrosCambios', 'Otros Cambios', {}, this.id])
    },
    showDone() {
      this.done = true
      this.timer = setTimeout(() => {
        this.done = false
      }, 800)
    },
    editLicensePlate(){
      var data = { 
            id: this.user.pers.id,
            vehiculo: this.recordToSubmit.vehiculo
      }
      if(this.recordToSubmit.vehiculo === null || this.recordToSubmit.vehiculo === '') {
            this.$q.dialog({
              color: 'primary',
              title: 'Faltan Datos',
              message: `Es obligatorio rellenar el campo del vehículo`
          })
      } else { 
         this.$axios.post(`bd_jpersonal.asp?action=pers_empleados_of/editLicensePlate/&auth=${this.user.auth}`,  querystring.stringify({ id: this.user.pers.id, vehiculo: this.recordToSubmit.vehiculo }), headerFormData )
        .then(result => {
          this.$q.dialog({
            color: 'primary',
            title: 'Matrícula añadida con éxito' 
          })
        })
        .catch(error => { console.log(error.message) })
      }  
    }
  },
  mounted() {
      //Llamaremos al BACKEND para pedir datos de este usuario
      this.loadDetalleEmpleado(this.user.pers.id)
       .then(response => {
         this.timer = setTimeout(() => {
              this.$q.loading.hide()
              this.timer = void 0
            }, 500) 
         this.recordToSubmit.codPuesto = response.data.codPuesto
         this.recordToSubmit = Object.assign({}, response.data) // v-model: en 'value' podemos leer el valor del v-model
       })
      if(this.listaPuestos.length === 0) { this.loadListaPuestos()}
    },
  beforeMount(){
    this.$q.loading.show() 
  },
  destroyed () {
    this.$emit('input', this.recordToSubmit) // v-model: para devolver el valor a atributo 'value', evento input
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: {}, registrosSeleccionados: Object.assign({}, this.recordToSubmit) }) // para conservar valores cuando vuelva a selec tab
  }
}
</script>

