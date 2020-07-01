<template>
   
   <div style="height: calc(100vh - 200px)">
       <p>Página de Contacto</p> 
    <q-card>
        <q-form @submit="updateRecord" @keyup.esc="$emit('close')">
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
              <q-input class="col-xs-12 col-sm-5" outlined v-model="recordToSubmit.email" label="Email"/>
              <q-input class="col-xs-12 col-sm-5" outlined v-model="recordToSubmit.email_personal_notificaciones" label="Email Personal"/>
              <q-input class="col-xs-3 col-sm-2" outlined v-model="recordToSubmit.extension" label="Extension"/>
              <q-input class="col-xs-4 col-sm-2" outlined v-model="recordToSubmit.movil" label="Movil"/>
              <q-input class="col-xs-5 col-sm-2" outlined v-model="recordToSubmit.telefonoparticular" label="Teléfono Particular"/>
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-8 col-sm-3" outlined v-model="recordToSubmit.domicilio" label="Domicilio"/>
              <q-input class="col-xs-4 col-sm-2 " outlined v-model="recordToSubmit.poblacion" label="Población"/>
              <q-input class="col-xs-3 col-sm-2" outlined v-model="recordToSubmit.cpostal" label="C.Postal"/>
              <q-input class="col-xs-4 col-sm-2" outlined v-model="recordToSubmit.provincia" label="Provincia"/>
              <q-input class="col-xs-5 col-sm-2" outlined v-model="recordToSubmit.estado" label="Estado"/>
            </div>
            <div class="row q-mb-sm">
              
            </div>  
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

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      recordToSubmit: {
        id: -1
      }
    }
  },
  mounted () {
    this.recordToSubmit = Object.assign({}, this.value) // v-model: en 'value' podemos leer el valor del v-model
  }
}
</script>