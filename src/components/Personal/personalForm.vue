<template>
  <div style="height: calc(100vh - 200px)">
    <q-card>
        <q-form @submit="updateRecord" @keyup.esc="$emit('close')">
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
                <q-input outlined v-model="recordToSubmit.id" label="Id" class="col-xs-3 col-sm-3" />
                <q-input outlined v-model="recordToSubmit.idpersonal" label="IdPersonal" class="col-xs-3 col-sm-3" />
                <q-input outlined v-model="recordToSubmit.colonia" tabindex="0" label="Colonia" class="col-xs-3 col-sm-3"/>
                <div class="col-xs-3 col-sm-3" align="center">
                  <q-avatar rounded size="100px">
                    <q-img  :src="`${urlF}${recordToSubmit.idpersonal}.jpg`" />
                  </q-avatar>
                </div>
            </div>
            <div class="row q-mb-sm">
                <q-input autofocus outlined v-model="recordToSubmit.nombre" label="Nombre" class="col-xs-6 col-sm-6"/>
                <q-input outlined v-model="recordToSubmit.horario" label="Horario" class="col-xs-3 col-sm-3"/>
                <q-input outlined v-model="recordToSubmit.vigente" label="Vigente" class="col-xs-3 col-sm-3" />
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-2 col-sm-5" outlined v-model="recordToSubmit.codpuesto" label="Cargo/Puesto de Trabajo"/>
              <q-input class="col-xs-6 col-sm-5" outlined v-model="recordToSubmit.nombrearea" label="Area"/>
              <q-input class="col-xs-4 col-sm-2" outlined v-model="recordToSubmit.grupoetm" label="Grupo ETM"/>
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-5 col-sm-5" outlined v-model="recordToSubmit.emailautorizador" label="Autorizador"/>
              <q-input class="col-xs-2 col-sm-2" outlined v-model="recordToSubmit.tutor" label="Tutor"/>
              <q-input class="col-xs-5 col-sm-5" outlined v-model="recordToSubmit.consentimientoimagen" label="Consent. Uso Imagen"/>
            </div>
            <q-input class="row q-mb-sm" outlined v-model="recordToSubmit.vehiculo" label="Vehiculo"
                type="textarea"
                counter
                @keyup.enter.stop />
           </q-card-section>
          <q-card-actions align=right>
              <!--q-btn type="submit" label="Save" color="primary"/-->
              <q-btn @click="$emit('close')" label="Cancel" color="negative"/>
          </q-card-actions>
        </q-form>
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
