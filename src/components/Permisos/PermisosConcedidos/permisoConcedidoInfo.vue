
<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-3 q-pr-sm"  v-model="permiso.id" label="ID" stack-label dense readonly/>
        <q-input class="col-9"  v-model="permiso.ejercicioAplicacion" label="Ejercicio" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.fechaDesde)" label="Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.fechaHasta)" label="Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  v-model="permiso.diasEfectivos" label="Num. Jornadas" stack-label dense readonly/>
        <q-input class="col-7"  v-model="permiso.datosTipoDiaLibre.descripcionDiaLibre" label="Tipo Jornada Libre" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col"  v-model="permiso.observaciones" label="Observaciones" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm" v-if="permiso.datosSustituto != null">
        <q-input class="col"  v-model="permiso.datosSustituto.nombre" label="Sustituto" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm" v-if="permiso.datosSustituto != null">
        <q-input class="col-6 q-pr-sm"  :value="formatDate(permiso.sustFDesde)" label="Sust. Desde" stack-label dense readonly/>
        <q-input class="col-6"  :value="formatDate(permiso.sustFHasta)" label="Sust. Hasta" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-4 q-pr-sm" v-model="permiso.justificantesValidados" label="Just. Valid" stack-label dense readonly/>
        <q-input class="col-4 q-pr-sm" v-model="permiso.justificantesNoValidados" label="Just. No Valid" stack-label dense readonly/>
        <q-input class="col-4" v-model="permiso.autorizadosSinDoc" label="Aut. Sin Doc" stack-label dense readonly/>
    </div>
    <div>
      <div class="row q-pb-sm">
        <q-btn outline class="col" label='Seleccionar Justificante' dense @click="addPhoto"/>
      </div>
      <div class="row q-pb-sm">
        <q-btn class="col" color="primary" label="SUBIR" @click="addJust" dense></q-btn>
      </div>
    </div>

    <q-dialog v-model="expanded"  >
      <q-card style="width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <q-btn flat icon="close" color="primary" @click="expanded = false"/>
        </q-card-section>
        <q-card-section>
          <q-img :src="justificante" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
import { date } from 'quasar'
import  { Vue }  from 'vue'

document.addEventListener('deviceready', () => {}, false)

export default {
  props: ['permiso'],
  data () {
    return {
      justificante: '',
      expanded: false,
      options: {}
    }
  },
  computed: {
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('permisos', ['addJustificante', 'deleteJustificante']),
    addJust() {
      if (this.justificante)
        this.addJustificante([this.permiso.id, this.justificante])
        //this.$forceUpdate()
    },
    delJust () {
      this.$q.dialog({
        title: 'Eliminar justificante',
        message: '¿Desea eliminar el justificante?',
        cancel: {
          color: 'primary',
          flat: true
        },
        ok: {
          label: 'Eliminar',
          flat: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        this.deleteJustificante(this.permiso.id)
        //this.$forceUpdate()
      })
    },
    addPhoto() {
      this.$q.bottomSheet({ 
        message: 'Seleccionar Justificante',
        actions: [
          {
            label: 'Cámara',
            icon: 'photo_camera',
            id: 'camara'
          },
          {
            label: 'Galería',
            icon: 'insert_photo',
            id: 'galeria'
          }
        ]
      }).onOk(action => {
        //if (window.cordova) {
          this.options.destinationType = Camera.DestinationType.DATA_URL
          console.log('Action chosen:', action.id)
          if (action.id === 'galeria') { this.options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM }

          navigator.camera.getPicture(
            (data) => { // on success
              //console.log('data', data);
              //let data64 = btoa(data)
              //this.justificante = `data:image/jpeg;base64,${data}`
              var contentType = 'image/jpeg' // 'application/pdf'

              const img = new Image()
              img.src = 'data:' + contentType + ';base64,' + data
              img.onload = () => {
                const scaleFactor = 1
                // ( img.width > 600 ? 600.0 / img.width : 1)
                const width = img.width * scaleFactor
                const height = img.height * scaleFactor
                const elem = document.createElement('canvas')
                elem.width = width
                elem.height = height
                const ctx = elem.getContext('2d')
                // img.width and img.height will contain the original dimensions
                ctx.drawImage(img, 0, 0, width, height)
                var data = ctx.canvas.toDataURL(contentType, 0.1)
                data = data.substring('data:image/jpeg;base64,'.length)

                var raw = atob(data)
                var rawLength = raw.length;
                var uInt8Array = new Uint8Array(rawLength)
                for (var i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i)
                }
                var oMyBlob = new Blob([uInt8Array], {type: contentType})

                const headerFormDataSinCredentials = {
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
                var formData = new FormData()
                formData.append('file', oMyBlob, `Justificante J-${this.permiso.id}.jpeg`)
                formData.append('asunto', `Justificante del permiso J-${this.permiso.id}`)
                formData.append('tipo', '')
                return this.$axios.post(`bd_jpersonal.asp?action=attach/${this.permiso.id}/J&auth=${this.user.auth}`, formData, headerFormDataSinCredentials)
                  .then(response => {
                    if (response.data.success) {
                      this.$q.dialog({ title: 'OK', message: 'Justificante subido correctamente' })
                    } else {
                      this.$q.dialog({ title: 'Error', message: 'Error al subir justificante. Vuélvalo a intentar o contacte con el administrador' })
                    }
                  })
                  .catch(error => {
                    this.$q.dialog({ title: 'Error', message: 'Error al subir justificante. Vuélvalo a intentar o contacte con el administrador' })
                  })
              }

              this.options.sourceType = Camera.PictureSourceType.CAMERA
            },
            () => { // on fail
              this.$q.notify('Could not access device camera.')
              this.options.sourceType = Camera.PictureSourceType.CAMERA
            },
            this.options)
        //}
      })
    },
    formatDate (pdate) {
      var d1 = date.extractDate(pdate,'YYYY-MM-DDTHH:mm:ss.000ZZ')
      return date.formatDate(d1, 'DD/MM/YYYY')
    },
  },
  mounted() {
    this.justificante = this.permiso.justificante
    console.log('permiso', this.permiso);
  }
}
</script>