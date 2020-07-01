<template>
   
   <div style="height: calc(100vh - 200px)">
       
    <q-card>
        <q-form @submit="updateRecord" @keyup.esc="$emit('close')">
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <p>Horario de Lunes - Jueves:</p>
            <div class="row q-mb-sm">
              <q-input outlined v-model="recordToSubmit.horaentrada1" label="Hora Entrada 1" class="col-xs-6 col-sm-3" />
              <q-input outlined v-model="recordToSubmit.horasalida1" label="Hora Salida 1" class="col-xs-6 col-sm-3" />
              <!-- <div v-if="col-xs" class="q-mt-md"> -->
                <q-input outlined v-model="recordToSubmit.horaentrada2" label="Hora Entrada 2" class="col-xs-6 col-sm-3" />
                <q-input outlined v-model="recordToSubmit.horasalida2" label="Hora Salida 2" class="col-xs-6 col-sm-3" />
              <!-- </div> -->
            </div>
          </q-card-section>
          <q-card-section  class="q-pt-none q-pl-xs q-pr-xs">
            <p>Horario de Viernes:</p>
            <div class="row q-mb-sm">
              <q-input outlined v-model="recordToSubmit.horaentrada3" label="Hora Entrada 3" class="col-xs-6 col-sm-3" />
              <q-input outlined v-model="recordToSubmit.horasalida3" label="Hora Salida 3" class="col-xs-6 col-sm-3" />
              <q-input outlined v-model="recordToSubmit.horaentrada4" label="Hora Entrada 4" class="col-xs-6 col-sm-3" />
              <q-input outlined v-model="recordToSubmit.horasalida4" label="Hora Salida 4" class="col-xs-6 col-sm-3" />
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