<template>
   
   <div style="height: calc(100vh - 200px)">
       <p>Página de Contrato</p> 
    <q-card>
        <q-form @submit="updateRecord" @keyup.esc="$emit('close')">
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <div class="row q-mb-sm">
                <q-input outlined v-model="value.login" label="Login" class="col-xs-4 col-sm-4" />
                <q-input outlined v-model="recordToSubmit.ident_fiscal" label="ID Fiscal" class="col-xs-4 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.ident_laboral" label="ID Laboral" class="col-xs-4 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.idfichaje" label="ID Fichaje" class="col-xs-3 col-sm-1" />
                <q-input outlined v-model="recordToSubmit.idnominas" label="ID Nóminas" class="col-xs-3 col-sm-1" />
                <q-input outlined v-model="recordToSubmit.pais_laboral" label="Pais Laboral" class="col-xs-3 col-sm-1"/>
                <q-input outlined v-model="recordToSubmit.pais" tabindex="0" label="Pais" class="col-xs-3 col-sm-1"/>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined v-model="recordToSubmit.tipo_contrato" label="Tipo de Contrato" class="col-xs-5 col-sm-4"/>
                <q-input outlined v-model="recordToSubmit.cargoweb" label="Cargo Web" class="col-xs-7 col-sm-6"/>
                <q-input outlined v-model="recordToSubmit.ordenweb" label="Orden Web" class="col-xs-4 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.jornada" label="Jornada" class="col-xs-4 col-sm-1" />
                <q-input outlined v-model="recordToSubmit.horas_reduccion" label="Horas Red. Sem" class="col-xs-4 col-sm-2"/>
                <q-input outlined v-model="recordToSubmit.fecha_de_alta" label="Fecha de Alta" class="col-xs-4 col-sm-3" />
                <q-input outlined v-model="recordToSubmit.ffin_contrato" label="Fin Contrato" class="col-xs-4 col-sm-3"/>
                <q-input outlined v-model="recordToSubmit.ffin_pruebas" label="Fin Pruebas" class="col-xs-4 col-sm-3"/>
            </div>
            <div class="row q-mb-sm">
                <q-input outlined v-model="recordToSubmit.fecha_nacimiento" label="Fecha de Nacimiento" class="col-xs-4 col-sm-3"/>
                <q-input outlined v-model="recordToSubmit.sexo" label="Sexo" class="col-xs-3 col-sm-2" />
                <q-input outlined v-model="recordToSubmit.estudios" label="Estudios" class="col-xs-5 col-sm-7" />
            </div>
            <div class="row q-mb-sm">    
                <q-input outlined v-model="recordToSubmit.cuenta_bancaria_principal" label="Cta 1ª." class="col-xs-12 col-sm-6" />
                <q-input outlined v-model="recordToSubmit.cuenta_bancaria_secundaria" label="Cta 2ª." class="col-xs-12 col-sm-6" />
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
import Vue from 'vuex'

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
    updateRecord () {
    }
  },
  mounted () {
    console.log(this.value)
    this.recordToSubmit = Object.assign({}, this.value) // v-model: en 'value' podemos leer el valor del v-model
  },
  destroyed () {
    this.$emit('input', this.recordToSubmit)
  }
}
</script>