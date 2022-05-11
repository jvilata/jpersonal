
<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-3 q-pr-sm" :value="permiso.id" label="ID" stack-label dense readonly/>
        <q-input class="col-9" :value="permiso.ejercicioAplicacion" label="Ejercicio" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.fechaDesde)" label="Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.fechaHasta)" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm" :value="permiso.diasEfectivos" label="Num. Jornadas" stack-label dense readonly/>
        <q-input class="col-7" :value="permiso.datosTipoDiaLibre.descripcionDiaLibre" label="Tipo Jornada Libre" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input autogrow class="col" :value="permiso.observaciones" label="Observaciones" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm" v-if="permiso.datosSustituto != null">
        <q-input class="col" :value="permiso.datosSustituto.nombre" label="Sustituto" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm" v-if="permiso.datosSustituto != null">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.sustFDesde)" label="Sust. Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.sustFHasta)" label="Sust. Hasta" stack-label dense readonly/>
    </div>
    <div v-if="permiso.tipoDiaLibre == 9 || permiso.tipoDiaLibre == 19" >
      <q-separator spaced/>
      <div class="row q-pb-sm">
          <q-input class="col-4 q-pr-sm" :value="permiso.justificantesValidados" label="Just. Valid" stack-label dense readonly/>
          <q-input class="col-4 q-pr-sm" :value="permiso.justificantesNoValidados" label="Just. No Valid" stack-label dense readonly/>
          <q-input class="col-4" :value="permiso.autorizadosSinDoc" label="Aut. Sin Doc" stack-label dense readonly/>
      </div>
      <div class="row q-pb-sm">
        <q-input ref="myFileInput" type="file" style="display:none" v-model="listaJust" accept="image/*" @change="doAddPhoto"></q-input>
        <q-btn unelevated color="primary" icon="cloud_upload" class="col" label='Subir Justificante' dense @click="doOpenFilePicker"/>
      </div>
      <div class="row q-pb-sm">
        <q-btn outline icon="visibility" class="col" label='Visualizar Justificantes' dense @click="openFormJust()" />
      </div>
    </div>

  </div>

</template>

<script>
import { axiosInstance, headerFormData} from 'src/boot/axios';
import { mapState, mapActions } from "vuex";
import { date } from 'quasar'
import  { Vue }  from 'vue'


document.addEventListener('deviceready', () => {}, false)

export default {
  props: ['permiso'],
  data () {
    return {
      expanded: false,
      listaJust: [],
    }
  },
  computed: {
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    ...mapActions('permisos', ['getJustificantes']),
    openFormJust () {
      //Añadiremos tab si es algun tipo de baja 
      var data = {
        code: this.permiso.id,
        type: 'J',
        idTab: 'verJustificantes-1'
      }
      this.addTab(['verJustificantes', 'Ver Justificantes', data, 1])
    },
    doAddPhoto(){
      var formData = new FormData()
      formData.append('file', this.listaJust[0])
      formData.append('asunto', `Justificante del permiso J-${this.permiso.id}`)
      formData.append('tipo', '')
      formData.append('type', 'J')
      formData.append('code', this.permiso.id)
      
      this.$q.loading.show({
         message: 'Esto puede tardar unos minutos, se recomienda realizar la accion con wifi'
      });

      axiosInstance.post(`bd_jpersonal.asp?action=attach/upload&auth=${this.user.auth}`, formData, headerFormData)
      .then((response) => {
        this.$q.loading.hide();
        var obj = response.data;

        if(!obj.success) return this.$q.dialog({title: 'Error', message : obj.msg});

        this.$q.dialog({ title: 'OK', message: 'Justificante subido correctamente' })
        this.getJustificantes({ code: this.permiso.id,  type: 'J'})
        this.$emit('refresh')
      })
      .catch(error => {
        this.$q.loading.hide();
        this.$q.dialog({ title: 'Error', message: error })
      })
    },
    
    doOpenFilePicker() {
       this.$refs.myFileInput.$el.click()
    },

    formatDate (pdate) {
      var d1 = date.extractDate(pdate,'YYYY-MM-DDTHH:mm:ss.000ZZ')
      return date.formatDate(d1, 'DD/MM/YYYY')
    },
  }
}
</script>