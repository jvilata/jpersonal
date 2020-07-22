<template>
  <q-slide-item left-color="positive" right-color="negative" @left="aceptar" @right="rechazar">
    <q-expansion-item
          clickable
          expand-icon="expand_more"
          class="q-pa-xs full-width column"
          group="porAprobar">
          <template v-slot:header>
            <q-avatar rounded size="30px">
              <!-- <q-avatar icon="person" color="primary" text-color="white" /> -->
              <q-img :src="`${urlF}${item.empleadoFoto}`" />
            </q-avatar>

        
                  
            <q-item-section>
                <q-item-label lines="2">{{item.empleadoNombre}}</q-item-label>
                <q-item-label caption>{{item.tipoSolicitud}} </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-badge outline :color="item.estadoSolicitudDesc === 'CONCEDIDA' ? 'positive' : 
                item.estadoSolicitudDesc === 'DENEGADA' ? 'negative' : 
                item.estadoSolicitudDesc === 'CONC.PROVISIONAL' ? 'warning' : 'primary'" 
                :label="item.estadoSolicitudDesc" />
            </q-item-section>
          </template>

          <q-card>
              <q-card-section>
                  <itemPermiso v-if="item.tipoSolicitud == 'PERMISO'" :item="item" :keyValue="keyValue" @permiso="value => permisoModif(value)"/> 
                  <itemCambioHor v-if="item.tipoSolicitud == 'CAMBIO HORARIO'" :item="item" :keyValue="keyValue"/>
                  <itemTeletrab v-if="item.tipoSolicitud == 'TELETRABAJO'" :item="item" :keyValue="keyValue"/>
                  <itemOtrosCambios v-if="item.tipoSolicitud == 'OTROS CAMBIOS'" :item="item" :keyValue="keyValue"/>

                  <div class="row justify-center text-center">
                    <div class="col-xs-6 justify-center">
                      <q-btn v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')" color="red" label="RECHAZAR" @click="rechazar(2)"/>
                    </div>
                    <div class="col-xs-6 justify-center">
                      <q-btn v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')" color="primary" label="APROBAR" @click="aceptar(2)"/>
                    </div>
                  </div>
                  <div class="row justify-center text-center">
                      <q-btn v-if="keyValue==1 && (item.estadoSolicitudDesc === 'PENDIENTE')" @click="confirm" style="width: 270px" color="negative">Eliminar Solicitud</q-btn>
                  </div>
              </q-card-section>
          </q-card>
    </q-expansion-item>
    <template v-slot:left v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')">
      <div class="row items-center">
        <q-icon name="done"/>
        APROBAR
      </div>
    </template>
    <template v-slot:right v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')">
      <div class="row items-center">
        RECHAZAR
        <q-icon name="close"/>
      </div>
    </template>
  </q-slide-item>
</template>

<script>
import { urlFotos } from 'boot/axios.js'
import { date } from 'quasar'
import { mapActions, mapState } from "vuex";

export default {
  data(){
    return {
      aprobacion: {},
      origin: 0,
      regper: {},
      urlF: urlFotos,
    }
  },
  props: ['item', 'id', 'keyValue', 'idPersonalEmpl'],
  components: {
    itemPermiso: require('components/Aprobacion/DesplegablesAprob/aprobacionPermiso.vue').default,
    itemCambioHor: require('components/Aprobacion/DesplegablesAprob/aprobacionCambioHor.vue').default,
    itemTeletrab: require('components/Aprobacion/DesplegablesAprob/aprobacionTeletrab.vue').default,
    itemOtrosCambios: require('components/Aprobacion/DesplegablesAprob/aprobacionOtrosCambios.vue').default
  },
  computed: { 
     ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('aprobacion', ['aprobarPermiso', 'addToVacaciones', 'rechazarPermiso', 'aprobarCambiosEmpleado']),
    ...mapActions('permisos', ['deletePermisoPendiente']),
    ...mapActions('tablasAux', ['sendMail']),
    
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
    permisoModif(value) {
      Object.assign(this.aprobacion, value)
    },
    setOrigin(origin) {
      this.origin = origin
    },
    confirm(){
      this.$q.dialog({
      title: 'Eliminar Solicitud',
      message: '¿Desea eliminar la solicitud?',
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
        this.$q.notify({
        color: 'primary',
        message: `Solicitud eliminada.`
        })
        this.$emit('deleteCambios', this.item.id)
      })
    },

    aceptar({ reset }){
      this.$q.dialog({
      title: 'ACEPTAR SOLICITUD',
      message: '¿Está seguro de que desea aceptar la solicitud?',
      cancel: true,
      persistent: true
      }).onOk(() => {
        this.$q.loading.show()
        if (this.item.tipoSolicitud === 'PERMISO') {
          //Bloque añadir a Vacaciones
          let permiso =  {
            diasEfectivos: this.item.diasEfectivos,
            ejercicioAplicacion: this.item.ejercicioAplicacion,
            empleado: this.item.empleado,
            observaciones: this.aprobacion.observaciones,
            sfechaDesde: this.item.sfechaDesde,
            sfechaHasta: this.item.sfechaHasta,
            ssustFdesde: this.aprobacion.ssustFdesde,
            ssustFhasta: this.aprobacion.ssustFhasta,
            sustituto: this.aprobacion.sustituto,
            tipoDiaLibre: this.item.tipoDiaLibre
          }
          this.addToVacaciones(permiso)
          .then(response => {
            if (response === true) {
              //Bloque Borrar permiso
              this.deletePermisoPendiente(this.item)
              .then((response) => {
                this.$emit('refresh')
              })
              .catch(error => {
                console.log('deletePermisoPendiente', error);
              })

              let mail = {
                to: this.item.empleadoEmailNotif,
                from: 'edicom@edicom.es',
                replyto: 'adjuntos@edicom.es',
                subject: `Solicitud ${this.item.tipoDiaDes}, aprobada con id: #${this.item.id}# :: ${this.formatDate(solicitud.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(solicitud.sfechaHasta, 'DD/MM/YYYY')}`,
                text: `Solicitud ${this.item.tipoDiaDes}, aprobada con id: #${this.item.id}# :: ${this.formatDate(solicitud.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(solicitud.sfechaHasta, 'DD/MM/YYYY')}`
              } 
              this.sendMail(mail)
            }
          })
          .catch(error => console.log('addToVacaciones', error))

          //Bloque aprobar Solicitud
          let solicitud = {
            old_fechaDesde: this.item.sfechaDesde,
            old_fechaHasta: this.item.sfechaHasta,
            tecnico: this.item.empleadoIdpersonal,
            new_fechaDesde: this.item.sfechaDesde,
            new_fechaHasta: this.item.sfechaHasta,
            diasEfectivos: this.item.diasEfectivos,
            esDudoso: false
          }
          this.aprobarPermiso(solicitud)
          .then((response) => {
            console.log('aprobarPermiso', response);
          })
          .catch(error => {
            console.log('aprobarPermiso', error);
          })

         //La solicitud es de Cambio Horario o de Teletrabajo  
        } else if(this.item.tipoSolicitud === 'CAMBIO HORARIO' || this.item.tipoSolicitud === 'TELETRABAJO') {
            
          let solicitud = {
            estadoSolicitud: 4, // APROBADA
            id: this.item.id,
            empleado: this.item.empleado,
            fechaSolicitud: this.item.fechaSolicitud,
            idAutorizadorOf: this.item.idAutorizadorOf,
            observaciones: this.item.observaciones,
            tipoSolicitud: this.item.tipoSolicitud,
            datosSolicitud: this.item.datosSolicitud,
            idautArea2: this.item.idautArea2
          }
          this.aprobarCambiosEmpleado(solicitud)
          //No envíamos email desde aqui porque ya lo hace el backend
          
        }
        if (this.origin === 1) reset()

      }).onDismiss(() => {
        this.$emit('close')
        if (this.origin === 1) reset()
      })
    },

    rechazar ({reset}) {
      this.$q.dialog({
        title: 'Rechazar permiso',
        message: 'Indique el motivo',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.$q.loading.show()
        if (this.item.tipoSolicitud === 'PERMISO') {
          //Bloque Rechazar solicitud
          let solicitud = {
            old_fechaDesde: this.item.sfechaDesde,
            old_fechaHasta: this.item.sfechaHasta,
            tecnico: this.item.empleadoIdpersonal
          }
          this.rechazarPermiso(solicitud)
          .then(response => {
            if (response.data == "OK") {
              //Bloque borrar
              this.deletePermisoPendiente(this.item)
              .then((response) => {
                this.$emit('refresh')
              })
              .catch(error => {
                console.log('deletePermisoPendiente', error)
              })

              //Send email
              let mail = {
                to: this.item.empleadoEmailNotif,
                from: 'edicom@edicom.es',
                subject: `Vacaciones/Permiso denegadas: ${data}`,
                text: `Vacaciones/Permiso denegadas: ${data}. Del ${this.formatDate(solicitud.old_fechaDesde, 'DD/MM/YYYY')} al ${this.formatDate(solicitud.old_fechaHasta, 'DD/MM/YYYY')}\nConsulta con tu responsable si necesitas más aclaración.`
              } 
              this.sendMail(mail)
            }
          })
          .catch(error => console.log('rechazarPermiso', error))
        } else if(this.item.tipoSolicitud === 'CAMBIO HORARIO' || this.item.tipoSolicitud === 'TELETRABAJO') {
          let solicitud = {
            estadoSolicitud: 3, //estadoSolicitud 3 es DENEGADA
            id: this.item.id,
            empleado: this.item.empleado,
            fechaSolicitud: this.item.fechaSolicitud,
            idAutorizadorOf: this.item.idAutorizadorOf,
            observaciones: this.item.observaciones,
            tipoSolicitud: this.item.tipoSolicitud,
            datosSolicitud: this.item.datosSolicitud,
            idautArea2: this.item.idautArea2
          }
          this.aprobarCambiosEmpleado(solicitud) //Misma llamada que aprobar pero con estadoSol != (por eso tmpoco envíamos email)
          .then((response) => {
            this.$emit('refresh')
          })
          .catch(error => {
           console.log('aprobarCambiosEmpleado', error);
          })
        }
        if (this.origin === 1) reset()
      }).onDismiss(() => {
        reset()
      })
    }
  }
    
}
</script> 