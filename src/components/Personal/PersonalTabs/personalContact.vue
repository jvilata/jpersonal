<template>
   
   <div style="height: calc(100vh - 200px)">
      
    <q-card flat>
        <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
              <q-input class="col-xs-12 col-sm-5" outlined readonly v-model="recordToSubmit.email" label="Email"/>
              <q-input class="col-xs-12 col-sm-5" outlined readonly v-model="recordToSubmit.emailNotificaciones" label="Email Personal"/>
              <q-input class="col-xs-3 col-sm-2" outlined readonly v-model="recordToSubmit.extension" label="Extension"/>
              <q-input class="col-xs-5 col-sm-2" outlined readonly v-model="recordToSubmit.movil" label="Movil"/>
              <q-input class="col-xs-4 col-sm-2" outlined readonly v-model="recordToSubmit.telefonoParticular" label="Teléfono"/>
            </div>
            <div class="row q-mb-sm">
              <q-input class="col-xs-12 col-sm-3" outlined readonly v-model="recordToSubmit.domicilio" label="Domicilio"/>
              <q-input class="col-xs-6 col-sm-2 " outlined readonly v-model="recordToSubmit.poblacion" label="Población"/>
              <q-input class="col-xs-6 col-sm-3" outlined readonly v-model="recordToSubmit.colonia" tabindex="0" label="Colonia" />
              <q-input class="col-xs-3 col-sm-2" outlined readonly v-model="recordToSubmit.cPostal" label="C.Postal"/>
              <q-input class="col-xs-4 col-sm-2" outlined readonly v-model="recordToSubmit.provincia" label="Provincia"/>
              <q-input class="col-xs-5 col-sm-2" outlined readonly v-model="recordToSubmit.estado" label="Estado"/>
            </div>
            <div class="row q-mb-sm">
              
            </div>  
          </q-card-section>
       
        
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
  methods: {
    ...mapActions('empleados', ['loadDetalleEmpleado'])
  },
  computed: {
      ...mapState('login', ['user'])
  },
  mounted () {
    //Llamaremos al BACKEND para pedir datos de este usuario 
      this.loadDetalleEmpleado(this.user.pers.id)
       .then(response => {
         this.timer = setTimeout(() => {
              this.$q.loading.hide()
              this.timer = void 0
            }, 250) 
         this.recordToSubmit = Object.assign({}, response.data) 
       })
    },
    beforeMount(){
    this.$q.loading.show() 
  }
}
</script>