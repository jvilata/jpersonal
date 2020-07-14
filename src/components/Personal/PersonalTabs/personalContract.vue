<template>
   
   <div style="height: calc(100vh - 200px)">
    <q-card flat>
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
                <q-input outlined v-model="user.pers.login" label="Login" class="col-xs-4 col-sm-4" />
                <q-input outlined v-model="recordToSubmit.identFiscal" label="IDFiscal" class="col-xs-4 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.identLaboral" label="IDLaboral" class="col-xs-4 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.idFichaje" label="IDFichaje" class="col-xs-4 col-sm-1" />
                <q-input outlined v-model="recordToSubmit.idNominas" label="IDNóm." class="col-xs-3 col-sm-1" />
                <q-input outlined v-model="recordToSubmit.paisLaboral" label="Pais Laboral" class="col-xs-3 col-sm-1"/>
                <q-input outlined v-model="recordToSubmit.pais" tabindex="0" label="Pais" class="col-xs-2 col-sm-1"/>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined v-model="recordToSubmit.tipoContrato" label="Tipo de Contrato" class="col-xs-4 col-sm-4"/>
                <q-input outlined v-model="recordToSubmit.jornada" label="Jornada" class="col-xs-4 col-sm-1" />
                <q-input outlined v-model="recordToSubmit.horasReduccion" label="Horas Red. Sem" class="col-xs-4 col-sm-2"/>
                <q-input outlined :value="formatDate(recordToSubmit.fechaAlta)" label="Fecha de Alta" class="col-xs-4 col-sm-3" />
                <q-input outlined :value="formatDate(recordToSubmit.fechaFinContrato)" label="Fin Contrato" class="col-xs-4 col-sm-3"/>
                <q-input outlined :value="formatDate(recordToSubmit.fechaFinPruebas)" label="Fin Pruebas" class="col-xs-4 col-sm-3"/>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined :value="formatDate(recordToSubmit.fechaNacimiento)" label="Fecha Nacimiento" class="col-xs-4 col-sm-3"/>
                <q-input outlined v-model="recordToSubmit.sexo" label="Sexo" class="col-xs-3 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.estudios" label="Estudios" class="col-xs-5 col-sm-7" />
            </div>
            <div class="row q-mb-sm">    
                <q-input outlined v-model="recordToSubmit.cuentaPrincipal" label="Cta 1ª." class="col-xs-12 col-sm-6" />
                <q-input outlined v-model="recordToSubmit.cuentaSecundaria" label="Cta 2ª." class="col-xs-12 col-sm-6" />
            </div>
          </q-card-section>
          
        
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import Vue from 'vuex'

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      recordToSubmit: {  }
    }
  },
  methods: {
    ...mapActions('empleados', ['loadDetalleEmpleado']),
    formatDate(date1){
      date1 = date.extractDate(date1, 'YYYY-MM-DDTHH:mm:ss')
      return date.formatDate(date1, 'DD/MM/YYYY')
    }
  },
  computed: {
    ...mapState('login', ['user'])
  },
  mounted () {
    //Llamaremos al BACKEND para pedir datos de este usuario 
      this.loadDetalleEmpleado(this.user.pers.id)
       .then(response => {
         this.recordToSubmit = Object.assign({}, response.data) 
       })
  },
  destroyed () {
    this.$emit('input', this.recordToSubmit)
  }
}
</script>