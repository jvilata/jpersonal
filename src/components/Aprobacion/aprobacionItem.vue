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
                  <itemPermiso v-if="item.tipoSolicitud == 'PERMISO'" :item="item" @input="value => permisoModif(value)"/> 
                  <itemCambioHor v-if="item.tipoSolicitud == 'CAMBIO HORARIO'" :item="item"/>
                  <itemTeletrab v-if="item.tipoSolicitud == 'TELETRABAJO'" :item="item"/>
                  <itemOtrosCambios v-if="item.tipoSolicitud == 'OTROS CAMBIOS'" :item="item"/>

                  <div class="row justify-center text-center">
                    <div class="col-xs-6 justify-center">
                      <q-btn color="red" label="RECHAZAR" @click="rechazar"/>
                    </div>
                    <div class="col-xs-6 justify-center">
                      <q-btn color="primary" label="ACEPTAR" @click="aceptar"/>
                    </div>
                  </div>
                  <div class="row justify-center text-center">
                    <div class="col-xs-12 justify-center q-pt-md">
                      <q-btn @click="confirm" style="width: 270px" color="indigo-1"> 
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
import { mapActions } from "vuex";

export default {
  props: ['item', 'id'],
  components: {
    itemPermiso: require('components/Aprobacion/DesplegablesAprob/aprobacionPermiso.vue').default,
    itemCambioHor: require('components/Aprobacion/DesplegablesAprob/aprobacionCambioHor.vue').default,
    itemTeletrab: require('components/Aprobacion/DesplegablesAprob/aprobacionTeletrab.vue').default,
    itemOtrosCambios: require('components/Aprobacion/DesplegablesAprob/aprobacionOtrosCambios.vue').default
  },
  mounted() {
    console.log('item', this.item);
  },
  methods: {
    ...mapActions('aprobacion', ['aprobarPermiso', 'addToVacaciones', 'rechazarPermiso']),
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
    },
    permisoModif(value) {
      console.log('permisoModif', value); 
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
        if (this.item.tipoSolicitud === 'PERMISO') {
          this.addToVacaciones(this.item)
          //this.aprobarSol()
        }
        reset()
      }).onCancel(() => {
        this.$emit('close')
        reset()
      })
    },
    aprobarSol() {
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
        //this.rechazarSol()
        console.log('>>>> OK, received', data)
        reset()
      }).onDismiss(() => {
        reset()
        })
    },

    rechazarSol() {
      let solicitud = {
        old_fechaDesde: this.item.sfechaDesde,
        old_fechaHasta: this.item.sfechaHasta,
        tecnico: this.item.empleadoIdpersonal
      }
      this.rechazarPermiso(solicitud)
    }
  }
}
</script>