<template>
  <div class="container">    
    <div class="row q-pb-sm">
        <q-input class="col-5 q-pr-sm"  :value="formatDate(item.fechaSolicitud)" label="Fecha Solicitud" stack-label dense readonly/>
        <q-input class="col-3 q-pr-sm"  v-model="item.id" label="ID" stack-label dense readonly/>
        <q-input class="col-4"  v-model="item.grupoEtm" label="ETM" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm q-mt-sm">
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="formatDate(datosSolicitud.teletrabajoFechaDesde)" label="Fecha Desde" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="formatDate(datosSolicitud.teletrabajoFechaHasta)" label="Fecha Hasta" stack-label dense readonly/>
      </div>
      <div class="col-4 q-pr-sm" >
        <q-input class="row" :value="datosSolicitud.paisTeletrabajo" label="País Teletrab." stack-label dense readonly/>
      </div>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  v-model="datosSolicitud.domicilioTeletrabajo" label="Domicilio Teletrabajo" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  v-model="item.nomAutorizadorOf" label="Autorizador 1" stack-label dense readonly/>
    </div>
    <div class="row q-pb-sm">
        <q-input class="col-12 q-pr-sm q-mt-sm"  v-model="datosSolicitud.teletrabajoObservaciones" label="Observaciones" stack-label dense readonly/>
    </div>
    <div class="row items-baseline">
      <div class="col-xs-1">
        <q-checkbox
            v-model="datosSolicitud.aceptaTeletrabajo"
            color="primary"
            />
      </div>
    <div class="col-xs-11 q-pl-xs">
      <span>He leído y acepto las</span>
      <span 
      @click="abrirURL('https://documentacion.edicom.es/share/proxy/alfresco/api/node/content/workspace/SpacesStore/58bed1d9-38fb-465c-bf1f-eb0a2e89ccdd/SGSI%20Procedimiento%20de%20Teletrabajo.pdf')" 
      class="text-primary text-left q-pl-sm">condiciones de Teletrabajo </span>
    </div>
    </div>
    <div class="row items-baseline q-my-md">
      <div class="col-xs-1">
      <q-checkbox
          v-model="datosSolicitud.aceptaTeletrabajo"
          color="primary"
          />
      </div>
      <div class="col-xs-11 q-pl-xs">
          <span>Cumplo en mi domicilio con las condiciones de seguridad y salud que se indican en el apartado 1.3 del</span>
          <span 
              @click="abrirURL('https://documentacion.edicom.es/share/proxy/alfresco/api/node/content/workspace/SpacesStore/58bed1d9-38fb-465c-bf1f-eb0a2e89ccdd/SGSI%20Procedimiento%20de%20Teletrabajo.pdf')" 
              class="text-primary text-align-right q-pl-sm">procedimiento de Teletrabajo </span>
      </div>
    </div>
    <div class="row items-baseline q-my-md">
      <div class="col-xs-1">
      <q-checkbox
          v-model="datosSolicitud.aceptaTeletrabajo"
          color="primary"
          />
      </div>
      <div class="col-xs-11 q-pl-xs">
          <span>Asumo responsabilidades por accidente o baja por enfermedad común</span>
          <span 
              @click="confirm1" 
              class="text-primary text-align-right q-pl-sm">Leer más</span>
      </div>
    </div>
    <div class="row items-baseline q-my-md">
        <div class="col-xs-1">
        <q-checkbox
            v-model="datosSolicitud.aceptaTeletrabajo"
            color="primary"
            />
        </div>
        <div class="col-xs-11 q-pl-xs">
            <span>Ambas partes acuerdan que todos los costes indirectos derivados</span>
            <span 
                @click="confirm2" 
                class="text-primary text-align-right q-pl-sm">Leer más</span>
        </div>
    </div>
    
  </div>  
</template>

<script>
import { mapActions } from "vuex";
import { date, openURL } from 'quasar'
import  { Vue }  from 'vue'

export default {
  props: ['item'],
  data () {
    return {
      datosSolicitud: {
        paisTeletrabajo: '',
        teletrabajoFechaDesde: '',
        teletrabajoFechaHasta: '',
        aceptaTeletrabajo: true,
        domicilioTeletrabajo: '',
        teletrabajoObservaciones:''
      }
    }
  },
  methods: {
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
    abrirURL (strUrl) {
         if (window.cordova === undefined) { // desktop
          openURL(strUrl)
        } else { // estamos en un disp movil
          window.cordova.InAppBrowser.open(strUrl, '_system') // openURL
        }     
    },
    confirm1 () {
      this.$q.dialog({
        title: 'Aceptación conciliación laboral',
        message: 'Como empleado de EDICOM, si causara baja por enfermedad común o accidente, o cualquier otra causa que me impidiera trabajar, me doy por enterado, tal cual consta en las Normas de Conducta, que soy responsable de comunicar mi baja médica a tiempo y de aportar la documentación exigible por organismos oficiales y/o por la empresa. Y de no hacerlo, no recibiré mi nómina durante ese periodo. Además me hago responsable de asumir todos los gastos que la enfermedad o baja me ocasionara. Si estoy en Europa me aseguraré de tener en vigor la tarjeta sanitaria europea. Acepto además mantener la legislación laboral del país del que me ha contratado.',
        persistent: true
      }).onOk(() => {
      }).onOk(() => {
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },

    confirm2 () {
      this.$q.dialog({
        title: 'Cargo de los costes',
        message: 'Ambas partes acuerdan que todos los costes indirectos derivados de la prestación de dicho servicio (electricidad, costes de comunicación, etc.) correrán a cargo del Trabajador en modalidad de teletrabajo salvo que hayan sido expresamente autorizado por escrito por la Empresa con anterioridad a su realización.',
        persistent: true
      }).onOk(() => {
      }).onOk(() => {
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
  },
  mounted() {
    if(this.item.datosSolicitud) {
      var obj = JSON.parse(this.item.datosSolicitud)
      Object.assign(this.datosSolicitud, obj)     
  }
}
}
</script>