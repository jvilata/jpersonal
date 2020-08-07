<template>
  <q-slide-item :right-color="provisional ? 'warning' : 'positive'" left-color="negative" @right="(reset) => provisional ? aceptarProvisional(reset, 1) : aceptar(reset, 1)" @left="(reset) => rechazar(reset, 1)">
    <q-expansion-item
          clickable
          v-model="expanded"
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
                  <itemProcesoSel v-if="item.tipoSolicitud == 'PROCESO SELECCION'" :item="item" :keyValue="keyValue"/>

                  <div class="row justify-center text-center">
                    <div class="col-xs-6 justify-center">
                      <q-btn 
                        unelevated
                        v-if="keyValue==2 && (item.estadoSolicitud === 1 || item.estadoSolicitud === 2)" 
                        color="negative" 
                        label="RECHAZAR" 
                        @click="rechazar({}, 2)"/>
                    </div>
                    <div class="col-xs-6 justify-center">
                      <q-btn 
                        unelevated
                        v-if="keyValue==2 && (item.estadoSolicitud === 1 || item.estadoSolicitud === 2)" 
                        :color="provisional ? 'amber-8' : 'positive'" 
                        :label="provisional ? 'PROVISIONAL' : 'APROBAR'" 
                        @click="provisional ? aceptarProvisional({}, 2) : aceptar({}, 2)"/>
                    </div>
                  </div>
                  <div class="row">
                      <q-btn unelevated v-if="keyValue==1 && (item.estadoSolicitudDesc === 'PENDIENTE')" @click="confirm" class="col" color="negative">Eliminar Solicitud</q-btn>
                  </div>
              </q-card-section>
          </q-card>
    </q-expansion-item>
    <template v-slot:right v-if="keyValue==2 && (item.estadoSolicitud === 1 || item.estadoSolicitud === 2)">
      <div v-if="provisional" class="row items-center">
        APROBAR PROVISIONAL
        <q-icon name="query_builder"/>
      </div>
      <div v-else class="row items-center">
        APROBAR
        <q-icon name="done"/>
      </div>
    </template>
    <template v-slot:left v-if="keyValue==2 && (item.estadoSolicitud === 1 || item.estadoSolicitud === 2)">
      <div class="row items-center">
        <q-icon name="close"/>
        RECHAZAR
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
      expanded: false,
      aprobacion: {},
      urlF: urlFotos,
      regper: {},
      // provisional: false
    }
  },
  props: ['item', 'id', 'keyValue'],
  components: {
    itemPermiso: require('components/Aprobacion/DesplegablesAprob/aprobacionPermiso.vue').default,
    itemCambioHor: require('components/Aprobacion/DesplegablesAprob/aprobacionCambioHor.vue').default,
    itemTeletrab: require('components/Aprobacion/DesplegablesAprob/aprobacionTeletrab.vue').default,
    itemProcesoSel: require('components/Aprobacion/DesplegablesAprob/aprobacionProcesoSel.vue').default
  },
  computed: { 
     ...mapState('login', ['user']),
     ...mapState('tablasAux', ['listaEstadosSolicitudes']),
     provisional () {
       var prov = false
       if (this.item.tipoDiaLibre === 1 && this.user.pers.idautArea2 > 0) prov = true
       else prov = false
       return prov
     }
  },
  mounted() {
    // if (this.item.tipoDiaLibre === 1 && this.user.pers.idautArea2 > 0) this.provisional = true
    // else this.provisional = false
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
        this.expanded = false
        this.$q.notify({
        color: 'primary',
        message: `Solicitud eliminada.`
        })
        this.$emit('deleteCambios', this.item.id)
      })
    },

    aceptarProvisional({reset}, origin) {
      this.$q.dialog({
      title: 'APROBAR PROVISIONALMENTE',
      message: '¿Está seguro de que desea APROBAR PROVISIONALMENTE la solicitud?',
      cancel: true,
      persistent: true
      }).onOk(() => {
        this.expanded = false
        if (this.item.tipoDiaLibre != 9 && this.item.tipoDiaLibre != 18 && this.provisional) {
          //Bloque actualizar estado solicitud a Conc.Provisional
          let permisoProv = Object.assign({}, this.item)
          permisoProv.estadoSolicitud = 2
          permisoProv.estadoSolicitudDesc = this.listaEstadosSolicitudes.find(record => record.codElemento == permisoProv.estadoSolicitud).valor1
          permisoProv.observaciones = this.aprobacion.observaciones
          this.updatePermisoPendiente(permisoProv)
          .then((response) => {
            this.$emit('refresh')

            let email = {
              to: `${this.item.empleadoEmail}; ${this.item.empleadoEmailNotif ? this.item.empleadoEmailNotif : ''}`,
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
      title: 'APROBAR SOLICITUD',
      message: '¿Está seguro de que desea APROBAR la solicitud?',
      cancel: true,
      persistent: true
      }).onOk(() => {
        this.expanded = false
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
            var resp = JSON.parse(response.data)
            if (resp.success === true) {
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
                subject: `Solicitud ${this.item.tipoDiaDesc}, aprobada con id: #${this.item.id}# :: ${this.formatDate(permiso.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(permiso.sfechaHasta, 'DD/MM/YYYY')}`
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
                mail.text = `Solicitud ${this.item.tipoDiaDesc}, aprobada con id: #${this.item.id}# :: ${this.formatDate(permiso.sfechaDesde, 'DD/MM/YYYY')} -- ${this.formatDate(permiso.sfechaHasta, 'DD/MM/YYYY')}`
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
        if (origin === 1) this.posInicial(reset)

      }).onDismiss(() => {
        this.$emit('close')
        if (origin === 1) this.posInicial(reset)
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
        this.expanded = false
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
                to: `${this.item.empleadoEmail}; ${this.item.empleadoEmailNotif ? this.item.empleadoEmailNotif : ''}`,
                from: 'edicom@edicom.es',
                subject: `Vacaciones/Permiso denegadas: ${data}`,
                text: `Vacaciones/Permiso denegadas: ${data}. Del ${this.formatDate(solicitud.old_fechaDesde, 'DD/MM/YYYY')} al ${this.formatDate(solicitud.old_fechaHasta, 'DD/MM/YYYY')}\nConsulta con tu responsable si necesitas más aclaración.`
              } 
              this.sendMail(mail)
            }
          })
          .catch(error => console.log('rechazarPermiso', error))
        } else  {
          var datossol = JSON.parse(this.item.datosSolicitud)
          datossol.observaciones = this.item.observaciones + (this.item.observaciones.length>0?'\n':'') + 'Motivo rechazo:' + data
          let solicitud = {
            estadoSolicitud: 3, //estadoSolicitud 3 es DENEGADA
            id: this.item.id,
            empleado: this.item.empleado,
            fechaSolicitud: this.item.fechaSolicitud,
            idAutorizadorOf: this.item.idAutorizadorOf,
            observaciones: datossol.observaciones,
            tipoSolicitud: this.item.tipoSolicitud,
            datosSolicitud: JSON.stringify(datossol),
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
        if (origin === 1) this.posInicial(reset)
      }).onDismiss(() => {
        if (origin === 1) this.posInicial(reset)
      })
    }
  }
    
}
</script> 