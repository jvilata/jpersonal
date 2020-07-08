<template>
  <div style="height: calc(100vh - 200px)">
    <q-card flat>
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
                <q-input autofocus outlined v-model="recordToSubmit.nombre" label="Nombre" class="col-xs-9 col-sm-6"/>
                <div class="col-xs-3 col-sm-3" align="center">
                  <q-avatar rounded size="100px">
                    <q-img  :src="`${urlF}${recordToSubmit.idpersonal}.jpg`" />
                  </q-avatar>
                </div>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined v-model="recordToSubmit.codpuesto" label="Cargo/Puesto de Trabajo" class="col-xs-7 col-sm-5"/>
                <q-input outlined v-model="recordToSubmit.id" label="ID" class="col-xs-2 col-sm-3" />
                <q-input outlined v-model="recordToSubmit.idpersonal" label="IDPersonal" class="col-xs-3 col-sm-3" />
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-9 col-sm-5" outlined v-model="recordToSubmit.nombrearea" label="Area"/>
              <q-input outlined v-model="recordToSubmit.vigente" label="Vigente" class="col-xs-3 col-sm-3" />
              <q-input outlined v-model="recordToSubmit.cargoweb" label="Cargo Web" class="col-xs-9 col-sm-6"/>
              <q-input outlined v-model="recordToSubmit.ordenweb" label="Orden Web" class="col-xs-3 col-sm-2" />
              <q-input class="col-xs-3 col-sm-3" outlined v-model="recordToSubmit.horario" label="Horario" />
              <q-input class="col-xs-6 col-sm-2" outlined v-model="recordToSubmit.grupoetm" label="Grupo ETM"/>
              <q-input class="col-xs-3 col-sm-2" outlined v-model="recordToSubmit.tutor" label="Tutor"/>
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-7 col-sm-5" outlined v-model="recordToSubmit.emailautorizador" label="Autorizador"/>
              <q-input class="col-xs-5 col-sm-5" outlined v-model="recordToSubmit.consentimientoimagen" label="Consent. Uso Imagen"/>
            </div>
            <q-input class="row q-mb-sm" outlined v-model="recordToSubmit.vehiculo" label="Vehiculo" autogrow @keyup.enter.stop />
            <div class="row justify-center text-center q-pt-lg">
              <div class="col-xs-12 justify-center">
                <q-btn
                  @click="openForm('otrosCambios')"
                  color="primary" 
                  label="Solicitar Otros Cambios" 
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
    ...mapState('tablasAux', ['listaSINO'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    ...mapActions('tabs', ['addTab']),
    openForm (otrosCambios) {
      this.addTab(['otrosCambios', 'Otros Cambios', {}, 1])
    },
    updateRecord () {
      this.recordToSubmit.tipoProducto = JSON.stringify(this.recordToSubmit.tipoProducto.split(',')) // convierto a array en JSON
      var formData = new FormData()
      for (var key in this.recordToSubmit) {
        formData.append(key, this.recordToSubmit[key])
      }
      return this.$axios.post('activos/bd_activos.php/guardarBD', formData, headerFormData)
        .then(response => {
          this.$q.dialog({ title: 'Aviso', message: 'Se ha actualizado registro', ok: true, persistent: true })
          this.$emit('close')
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    }
  },
  mounted () {
    this.recordToSubmit = Object.assign({}, this.value) // v-model: en 'value' podemos leer el valor del v-model
  },
  destroyed () {
    this.$emit('input', this.recordToSubmit) // v-model: para devolver el valor a atributo 'value', evento input
    this.$emit('changeTab', { idTab: this.value.idTab, filterRecord: {}, registrosSeleccionados: Object.assign({}, this.recordToSubmit) }) // para conservar valores cuando vuelva a selec tab
  }
}
</script>
<style lang="sass" scoped>
.flex-breakh
  flex: 1 0 100% !important
  height: 0 !important
.flex-breakw
  flex: 1 0 100% !important
  width: 0 !important
.row-container
  height: 100px

  .row-cell
    margin: 1px
    padding: 4px 8px
    box-shadow: inset 0 0 0 2px $grey-6
</style>
