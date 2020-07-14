<template>
  <q-slide-item left-color="positive" right-color="negative" >
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
                  <itemPermiso v-if="item.tipoSolicitud == 'PERMISO'" :item="item"/> 
                  <itemCambioHor v-if="item.tipoSolicitud == 'CAMBIO HORARIO'" :item="item"/>
                  <itemTeletrab v-if="item.tipoSolicitud == 'TELETRABAJO'" :item="item"/>
                  <itemOtrosCambios v-if="item.tipoSolicitud == 'OTROS CAMBIOS'" :item="item"/>
                  <div class="row justify-center text-center">
                    <div class="col-xs-6 justify-center">
                      <q-btn color="red" label="RECHAZAR" />
                    </div>
                    <div class="col-xs-6 justify-center">
                      <q-btn color="primary" label="ACEPTAR"  />
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
      <q-icon name="done"/>
    </template>
    <template v-slot:right>
      <q-icon name="close"/>
    </template>
  </q-slide-item>
</template>

<script>
import { date } from 'quasar'

export default {
  props: ['item', 'id'],
  components: {
    itemPermiso: require('components/Aprobacion/DesplegablesAprob/aprobacionPermiso.vue').default,
    itemCambioHor: require('components/Aprobacion/DesplegablesAprob/aprobacionCambioHor.vue').default,
    itemTeletrab: require('components/Aprobacion/DesplegablesAprob/aprobacionTeletrab.vue').default,
    itemOtrosCambios: require('components/Aprobacion/DesplegablesAprob/aprobacionOtrosCambios.vue').default

  },
  methods: {
    formatDate (pdate) {
      return date.formatDate(pdate, 'DD/MM/YYYY')
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
    }).onOk(() => {
    //
    }).onCancel(() => {
    }).onDismiss(() => {
    })
    }
  }
}
</script>