<template>
  <q-slide-item :left-color="provisional ? 'warning' : 'positive'" right-color="negative" @left="(reset) => provisional ? aceptarProvisional(reset, 1) : aceptar(reset, 1)" @right="(reset) => rechazar(reset, 1)">
    <q-expansion-item
          clickable
          expand-icon="expand_more"
          class="q-pa-xs full-width column"
          group="porAprobar">
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar round size="30px">
                <q-img :src="`${urlF}${item.empleadoFoto}`" />
              </q-avatar>
            </q-item-section>

        
                  
            <q-item-section>
                <q-item-label lines="2">{{item.empleadoNombre}}</q-item-label>
                <q-item-label caption>{{item.tipoSolicitud}} </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-badge outline :color="item.estadoSolicitud === 4 ? 'positive' : 
                item.estadoSolicitud === 3 ? 'negative' : 
                item.estadoSolicitud === 2 ? 'warning' : 'primary'" 
                :label="item.estadoSolicitudDesc" />
            </q-item-section>
          </template>

          <q-card>
              <q-card-section>
                  <itemPermiso v-if="item.tipoSolicitud == 'PERMISO'" :item="item" :keyValue="keyValue" :provisional="provisional" @permiso="value => permisoModif(value)"/> 
                  <itemCambioHor v-if="item.tipoSolicitud == 'CAMBIO HORARIO'" :item="item" :keyValue="keyValue"/>
                  <itemTeletrab v-if="item.tipoSolicitud == 'TELETRABAJO'" :item="item" :keyValue="keyValue"/>

                  <div class="row justify-center text-center">
                    <div class="col-xs-6 justify-center">
                      <q-btn 
                        v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')" 
                        color="red" 
                        label="RECHAZAR" 
                        @click="rechazar({}, 2)"/>
                    </div>
                    <div class="col-xs-6 justify-center">
                      <q-btn 
                      v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')" 
                      color="primary" 
                      :label="provisional ? 'APROBAR PROVISIONAL' : 'APROBAR'" 
                      @click="provisional ? aceptarProvisional({}, 2) : aceptar({}, 2)"/>
                    </div>
                  </div>
                  <div class="row justify-center text-center">
                      <q-btn v-if="keyValue==1 && (item.estadoSolicitudDesc === 'PENDIENTE')" @click="confirm" style="width: 270px" color="negative">Eliminar Solicitud</q-btn>
                  </div>
              </q-card-section>
          </q-card>
    </q-expansion-item>
    <template v-slot:left v-if="keyValue==2 && (item.estadoSolicitudDesc === 'PENDIENTE' || item.estadoSolicitudDesc === 'CONC.PROVISIONAL')">
      <div v-if="provisional" class="row items-center">
        <q-icon name="query_builder"/>
        APROBAR PROVISIONAL
      </div>
      <div v-else class="row items-center">
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
      provisional: false
    }
  },
  props: ['item', 'id', 'keyValue'],
  components: {
    itemPermiso: require('components/Aprobacion/DesplegablesAprob/aprobacionPermiso.vue').default,
    itemCambioHor: require('components/Aprobacion/DesplegablesAprob/aprobacionCambioHor.vue').default,
    itemTeletrab: require('components/Aprobacion/DesplegablesAprob/aprobacionTeletrab.vue').default,
  },
  computed: { 
     ...mapState('login', ['user']),
     ...mapState('tablasAux', ['listaEstadosSolicitudes'])
  },
  mounted() {
    if (this.item.tipoDiaLibre === 1 && this.user.pers.idautArea2 > 0) this.provisional = true
    else this.provisional = false

    //console.log('item', this.item);
  },
  methods: {
    ...mapActions('aprobacion', ['generarReservasVacaciones', 'addToVacaciones', 'rechazarPermiso', 'aprobarCambiosEmpleado']),
    ...mapActions('permisos', ['updatePermisoPendiente', 'deletePermisoPendiente']),
    ...mapActions('tablasAux', ['sendMail']),
    
    
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
    permisoModif(value) {
      Object.assign(this.aprobacion, value)
    },
    posInicial(reset) {
      reset()
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

    aceptarProvisional({reset}, origin) {
      this.$q.dialog({
      title: 'ACEPTAR PROVISIONALMENTE',
      message: '¿Está seguro de que desea ACEPTAR PROVISIONALMENTE la solicitud?',
      cancel: true,
      persistent: true
      }).onOk(() => {
        if (this.item.tipoDiaLibre != 9 && this.item.tipoDiaLibre != 18 && this.provisional) {
          //Bloque actualizar estado solicitud a Conc.Provisional
          let permisoProv = Object.assign({}, this.item)
          permisoProv.estadoSolicitud = 2
          permisoProv.estadoSolicitudDesc = this.listaEstadosSolicitudes.find(record => record.codElemento == permisoProv.estadoSolicitud).valor1
          permisoProv.observaciones = this.aprobacion.observaciones

          console.log(permisoProv);
          this.updatePermisoPendiente(permisoProv)
          .then((response) => {
            console.log('response', response.data);
            this.$emit('refresh')

            let email = {
              to: this.item.empleadoEmailNotif,
              from: 'edicom@edicom.es',
              subject: `Vacaciones/Permiso aprobadas provisionalmente: ${this.formatDate(permisoProv.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(permisoProv.sfechaHasta, 'DD/MM/YYYY')}`,
              text: `Vacaciones/Permiso aprobadas provisionalmente: ${this.formatDate(permisoProv.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(permisoProv.sfechaHasta, 'DD/MM/YYYY')}`
            }
            this.sendMail()
          })
          .catch(error => console.log('addPermisoPendiente', error))

          //Bloque generar reservas vacaciones
          let solicitud = {
            old_fechaDesde: this.item.sfechaDesde,
            old_fechaHasta: this.item.sfechaHasta,
            tecnico: this.item.empleadoIdpersonal,
            new_fechaDesde: this.item.sfechaDesde,
            new_fechaHasta: this.item.sfechaHasta,
            diasEfectivos: this.item.diasEfectivos,
            esDudoso: this.provisional
          }
          this.generarReservasVacaciones(solicitud)
          .then((response) => {
            console.log('generarReservasVacaciones', response);
          })
          .catch(error => {
            console.log('generarReservasVacaciones', error);
          })
        }
        
       if (origin === 1) this.posInicial(reset)
      }).onDismiss(() => {
        this.$emit('close')
        if (origin === 1) this.posInicial(reset)
      })
    },

    aceptar({reset}, origin){
      this.$q.dialog({
      title: 'ACEPTAR SOLICITUD',
      message: '¿Está seguro de que desea ACEPTAR la solicitud?',
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
              //Bloque mandar correo-notificación
              let mail = {
                to: `${this.item.empleadoEmail}; ${this.item.empleadoEmailNotif ? this.item.empleadoEmailNotif : ''}`,
                from: 'edicom@edicom.es',
                subject: `Solicitud ${this.item.tipoDiaDes}, aprobada con id: #${this.item.id}# :: ${this.formatDate(solicitud.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(solicitud.sfechaHasta, 'DD/MM/YYYY')}`
              }
              if (this.item.tipoDiaLibre === 9) {
                mail.text = `Hola,\nEsperamos que te recuperes lo antes posible de tu baja y para que podamos tramitar adecuadamente ante los organismos oficiales tu situación, cumpliendo la legislación vigente,  
                             necesitamos que en el momento efectivo de la baja que te sea posible, nos remitas el justificante de la misma. Puedes adjuntarlo enviando un email a: adjuntos@edicom.es, incluyendo como parte del asunto el texto '#J-${this.item.id}#'.
                             También puedes subirlo directamente desde la Aplicación móvil, al permiso correspondiente de la lista de Permisos Concedidos.
                            \n\nPor orden de la Seguridad Social, si te ausentas más de 3 días es necesario una baja médica expedida por tu médico de cabecera y para las ausencias médicas de menos de 3 días requerimos que el P10 de justificante haga la indicación de reposo.
                            \n\nGracias por tu comprensión y que mejores. No dudes en consultarnos cualquier duda.
                            \n\nEDICOM\nDepto. Administración`
                mail.replyto = 'adjuntos@edicom.es'
              } else if (this.item.tipoDiaLibre != 1 && this.item.tipoDiaLibre != 18) {
                mail.text = `\n\nHola,\n Perdona que te molestemos un momento para recordarte que para que podamos tramitar adecuadamente tu permiso, necesitamos que en el momento efectivo del mismo que te sea posible, nos remitas el justificante del mismo.
                             Puedes adjuntarlo enviando un email a: adjuntos@edicom.es, incluyendo como parte del asunto el texto '#J-${this.item.id}#'. También puedes subirlo directamente desde la Aplicación móvil, al permiso correspondiente de la lista de Permisos Concedidos. 
                             \n\nGracias por tu comprensión. No dudes en consultarnos cualquier duda.\n\nEDICOM\nDepto. Administración`
                mail.replyto = 'adjuntos@edicom.es'
              } else {
                mail.text = `Solicitud ${this.item.tipoDiaDes}, aprobada con id: #${this.item.id}# :: ${this.formatDate(solicitud.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(solicitud.sfechaHasta, 'DD/MM/YYYY')}`
              }
            
              this.sendMail(mail)
            }
          })
          .catch(error => console.log('addToVacaciones', error))

          //Bloque generar reservas vacaciones
          let solicitud = {
            old_fechaDesde: this.item.sfechaDesde,
            old_fechaHasta: this.item.sfechaHasta,
            tecnico: this.item.empleadoIdpersonal,
            new_fechaDesde: this.aprobacion.ssustFdesde ? this.aprobacion.ssustFdesde : this.item.sfechaDesde,
            new_fechaHasta: this.aprobacion.ssustFhasta ? this.aprobacion.ssustFhasta : this.item.sfechaHasta,
            diasEfectivos: this.item.diasEfectivos,
            esDudoso: this.provisional
          }
          this.generarReservasVacaciones(solicitud)
          .then((response) => {
            console.log('generarReservasVacaciones', response);
          })
          .catch(error => {
            console.log('generarReservasVacaciones', error);
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
          .then((response) => {
            this.$emit('refresh')
          })
          .catch(error => {
           console.log('aprobarCambiosEmpleado', error);
          })
          //No envíamos email desde aqui porque ya lo hace el backend
          
        }
        if (this.origin === 1) this.posInicial(reset)

      }).onDismiss(() => {
        this.$emit('close')
        if (this.origin === 1) this.posInicial(reset)
      })
    },

    rechazar ({reset}, origin) {
      this.$q.dialog({
        title: 'RECHAZAR SOLICITUD',
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
        if (this.origin === 1) this.posInicial(reset)
      }).onDismiss(() => {
        if (this.origin === 1) this.posInicial(reset)
      })
    }
  }
    
}
</script> 