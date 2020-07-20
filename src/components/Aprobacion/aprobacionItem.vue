<template>
  <q-slide-item left-color="positive" right-color="negative" @left="aceptar" @right="rechazar">
    <q-expansion-item
          clickable
          expand-icon="expand_more"
          class="q-pa-xs full-width column"
          group="porAprobar">
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar icon="person" color="primary" text-color="white" />
            </q-item-section>
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
                      <q-btn v-if="keyValue==2" color="red" label="RECHAZAR" @click="rechazar(2)"/>
                    </div>
                    <div class="col-xs-6 justify-center">
                      <q-btn v-if="keyValue==2" color="primary" label="ACEPTAR" @click="aceptar(2)"/>
                    </div>
                  </div>
                  <div class="row justify-center text-center">
                    <div class="col-xs-12 justify-center q-pt-md">
                      <q-btn v-if="keyValue==1" @click="confirm" style="width: 270px" color="indigo-1"> 
                        <q-icon name="delete" color="grey-9" />
                      </q-btn>
                    </div>
                  </div>
              </q-card-section>
          </q-card>
    </q-expansion-item>
    <template v-slot:left>
      <div class="row items-center">
        <q-icon name="done"/>
        APROBAR
      </div>
    </template>
    <template v-slot:right>
      <div class="row items-center">
        RECHAZAR
        <q-icon name="close"/>
      </div>
    </template>
  </q-slide-item>
</template>

<script>
import { date } from 'quasar'
import { mapActions, mapState } from "vuex";

export default {
  data(){
    return {
      aprobacion: {},
      origin: 0
    }
  },
  props: ['item', 'id', 'keyValue'],
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
            estadoSolicitud: 4,
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
            //console.log('aprobarCambiosEmpleado', response);
            this.$emit('refresh')
            if(this.item.tipoSolicitud === 'CAMBIO HORARIO') {
              let datos = {
                to: this.item.empleadoEmail,
                from: 'edicom@edicom.es',
                subject: 'Se ha APROBADO tu solicitud de ' + this.item.tipoSolicitud,
                text: 'Estimado ' + this.item.empleadoNombre + '\n\n\n Se ha aprobado tu solicitud de ' + this.item.tipoSolicitud + ' de fecha ' +
                  date.formatDate(date.extractDate(this.item.fechaSolicitud,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY') + 
                  '\n\n Observaciones: ' + this.item.observaciones + ' - Aprobado por ' + this.user.pers.nombre + ' el '+ date.formatDate(new Date(), 'DD/MM/YYYY') +
                  '\n\n\n Datos de Solicitud: \n\n Lunes - Jueves: ' +  '\n Hora Entrada 1: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaEntrada1),'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
                  ' - Hora Salida 1: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaSalida1),'YYYY-MM-DDTHH:mm'), 'HH:mm') +
                  '  Hora Entrada 2: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaEntrada2),'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
                  ' - Hora Salida 2: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaSalida2),'YYYY-MM-DDTHH:mm'), 'HH:mm') +
                  '\n\n Viernes: \n Hora Entrada 3: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaEntrada3),'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
                  ' - Hora Salida 3: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaSalida3),'YYYY-MM-DDTHH:mm'), 'HH:mm') +
                  '  Hora Entrada 4: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaEntrada4),'YYYY-MM-DDTHH:mm'), 'HH:mm') + 
                  ' - Hora Salida 4: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).horaSalida4),'YYYY-MM-DDTHH:mm'), 'HH:mm') +
                  '\n\n\n' + this.item.empleadoNombre + ', acepto que la conciliación laboral siempre se encuentra supeditada a las necesidades del departamento, y para que surta efecto es indispensable obtener la correspondiente autorización de su responsable. Acepto que por la misma razón, también es el responsable del departamento quien puede establecer los límites de aplicación con carácter general en su ámbito, así como modificar, revocar o suspender las autorizaciones existentes cuando así lo considere con la debida antelación.' +
                  '\n\n\n\n\n Gracias por tu colaboración \n\n\n EDICOM \n MAIL: rrhh@edicomgroup.com'
              }
              this.sendMail(datos)
            } else {
              let datos = {
                to: this.item.empleadoEmail,
                from: 'edicom@edicom.es',
                subject: 'Se ha APROBADO tu solicitud de ' + this.item.tipoSolicitud,
                text: 'Estimado ' + this.item.empleadoNombre + '\n\n\n Se ha aprobado tu solicitud de ' + this.item.tipoSolicitud + ' de fecha ' +
                  date.formatDate(date.extractDate(this.item.fechaSolicitud,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY') + 
                  '\n\n Observaciones: ' + this.item.observaciones + ' - Aprobado por ' + this.user.pers.nombre + ' el '+ date.formatDate(new Date(), 'DD/MM/YYYY') +
                  '\n\n\n Datos de Solicitud: \n\n Fecha Desde: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).teletrabajoFechaDesde),'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY') + 
                ' - Fecha Hasta: ' + date.formatDate(date.extractDate((JSON.parse(this.item.datosSolicitud).teletrabajoFechaHasta),'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY') +
                '\n\n País Teletrabajo: ' + (JSON.parse(this.item.datosSolicitud).paisTeletrabajo) + ' - Domicilio Teletrabajo: ' + (JSON.parse(this.item.datosSolicitud).domicilioTeletrabajo) +
                '\n\n\n' + this.item.empleadoNombre + ' se compromete a cumplir todos los puntos enumerados en el documento "SGSI Procedimiento de Teletrabajo de EDICOM", y tal y como se expresa en el procedimiento, la empresa se reserva el derecho de poner anular dicho permiso por causas imputables a productividad, necesidades de los clientes, de la empresa o de otros compañeros que también lo necesiten y no sea posible reducir los porcentajes de personal en modalidad de trabajo presencial estipulados y/o necesarios en cada momento.' +
                '\n\n\n\n\n Gracias por tu colaboración \n\n\n EDICOM \n MAIL: rrhh@edicomgroup.com'
              }
              this.sendMail(datos)
            } 
          })
          .catch(error => {
           console.log('aprobarCambiosEmpleado', error);
          })
          
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
            estadoSolicitud: 3,
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
            //console.log('aprobarCambiosEmpleado', response);
            this.$emit('refresh')
          })
          .catch(error => {
           console.log('aprobarCambiosEmpleado', error);
          })
        }
        if (this.origin === 1) reset()
      }).onDismiss(() => {
        //if (this.origin === 1) 
        reset()
      })
    }
  }
}
</script>