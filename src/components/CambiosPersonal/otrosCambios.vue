<template>
  <div class="container">
    <q-item class="q-pa-xs bg-indigo-1 text-grey-8">
          <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
      <q-item-section avatar>
        <q-icon name="edit" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">
          OTROS CAMBIOS
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
        @click="$emit('close')"
        flat
        round
        dense
        icon="close"/>
      </q-item-section>
    </q-item>
      <div class="row q-pa-sm" >
          <div class="col-xs-12">
              <q-input 
                  v-model="recordToSubmit.motivoTeletrab" 
                  label="Indique los cambios que desea realizar"
                  type="textarea"
                  @keyup.enter.stop />
          </div>
      </div>
      <div class="row q-pb-md justify-center text-center" >
          <div class="col-xs-12 q-mt-sm">
              <q-btn @click="solicitarCambios()" :disabled="recordToSubmit.motivoTeletrab.length == 0 ? !disabled : disabled" color="primary" label="Solicitar Otros Cambios" style="height: 60px"/>
          </div>
      </div>
      <div class="justify-bottom text-bottom">
      <span class="text-grey-7">Protección de Datos. </span>
      <div class="row items-end q-my-sm">
        <div class="col-xs-9">
          <span class="text-grey-5"> Edicom Capital S.L. (Edicom),con domicilio en España, Parque Tecnológico de Paterna... 
          </span>
        </div>
        <div class="col-xs-3">
            <span @click="confirm" class="text-primary text-align-right q-pl-sm">Leer Más</span>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex' 

export default {
  props: ['value', 'id', 'keyValue'], 
  data() {
    return {
      recordToSubmit: {
        motivoTeletrab: ''
      },
      protDatos: 'PROTECCIÓN DE DATOS',
      protMas: '',
      disabled: false
  }
  },
  methods: {
    ...mapActions('empleados', ['loadFilialEmpleado']),
    confirm () {
      this.$q.dialog({
        title: 'Protección de Datos',
        message: 'Edicom Capital S.L. (Edicom),con domicilio en España, Parque Tecnológico de Paterna, Charles Robert Darwin 8-10, 46980 Paterna, Valencia,utilizará los datos aquí recabados con la finalidad de llevar a cabo el adecuado desarrollo, cumplimiento y control de la relación laboral,así como la gestión de recursos humanos, incluyendo, entre otras, las siguientes finalidades específicas: evaluación del desempeño, formación,gestión económica derivada de su relación con Edicom, pagos de haberes y gastos, vigilancia de la salud, prevención de riesgos laborales, obtención de certificaciones, cotizaciones, control de absentismo y demás deberes sociales. En el caso específico del dato de las matrículas de los vehículos, este dato se tratará en interés legítimo de Edicom con la finalidad de preservar la seguridad de las personas y bienes, así como de sus instalaciones. Se le informa que podrá ejercer los derechos de acceso, rectificación, supresión, oposición, portabilidad y limitación según lo previsto en el Reglamento (UE) 2017/679, dirigiéndose al Delegado de Protección de Datos: Por correo electrónico en la siguiente dirección: dpo@edicomgroup.com. Por correo postal: EDICOM CAPITAL, S.L. |Parque Tecnológico de Paterna | Charles Robert Darwin 8-10 | 46980 Paterna(Valencia) SPAIN. Puede presentar una reclamación ante la Autoridad de Control competente en materia de Protección deDatos, especialmente cuando no haya obtenido satisfacción en el ejercicio de sus derechos.',
        cancel: true,
        persistent: true,
      }).onOk(() => {
      }).onOk(() => {
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    solicitarCambios() {
      this.loadFilialEmpleado(this.user.pers.id)
      .then(result => {
        var data = {
        descripcion: this.recordToSubmit.motivoTeletrab,
        tipologia: 11, // recopilacion
        encargado: 1174,
        prioridad: 1,
        fechaT: new Date(),
        estado: 'PENDIENTE',
        empleado: this.user.pers.idpersonal,
        solicitante: this.user.pers.idpersonal ,
        delegacion: result.filial.idfilial
        }
        this.$axios.post(`bd_jpersonal.asp?action=tareasLaboral/list&auth=${this.user.auth}`, data)
          .then(result => {
            this.$q.dialog({
            color: 'primary',
            message: `Se ha registrado su solicitud de cambio.`
            }).onOk(() => {
              this.$emit('close')
            })
          })
          .catch(error => { console.log(error.message) })  
      })
      .catch(error => { console.log(error.message) })
      }
  },
  computed:{
    ...mapState('login', ['user'])
  }
    
}
</script>