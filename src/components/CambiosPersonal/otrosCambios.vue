<template>
    <div>
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
                    v-model="motivoTeletrab" 
                    label="Indique los cambios que desea realizar"
                    type="textarea"
                    @keyup.enter.stop />
            </div>
        </div>
        <div class="row q-pb-md justify-center" >
            <div class="col-xs-10 q-mt-sm" style="max-width: 150px">
                <q-btn color="primary" label="Solicitar Otros   Cambios" style="max-height: 50px"/>
            </div>
        </div>
        <div class="row q-pa-sm" >
            <span class="text-subtitle2">Protección de Datos</span>
            <span>Edicom Capital S.L. (Edicom),con domicilio en España, Parque Tecnológico de Paterna, Charles Robert Darwin 8-10, 46980 Paterna, Valencia,utilizará los datos aquí recabados con la finalidad de llevar a cabo el adecuado desarrollo, cumplimiento y control de la relación laboral,así como la gestión de recursos humanos, incluyendo, entre otras, las siguientes finalidades específicas: evaluación del desempeño, formación,gestión económica derivada de su relación con Edicom, pagos de haberes y gastos, vigilancia de la salud, prevención de riesgos laborales, obtención de certificaciones, cotizaciones, control de absentismo y demás deberes sociales.

                    En el caso específico del dato de las matrículas de los vehículos, este dato se tratará en interés legítimo de Edicom con la finalidad de preservar la seguridad de las personas y bienes, así como de sus instalaciones.

                    Se le informa que podrá ejercer los derechos de acceso, rectificación, supresión, oposición, portabilidad y limitación según lo previsto en el Reglamento (UE) 2017/679, dirigiéndose al Delegado de Protección de Datos:
                        •                 Por correo electrónico en la siguiente dirección: dpo@edicomgroup.com.
                        •                 Por correo postal: EDICOM CAPITAL, S.L. |Parque Tecnológico de Paterna | Charles Robert Darwin 8-10 | 46980 Paterna(Valencia) SPAIN.

                    Puede presentar una reclamación ante la Autoridad de Control competente en materia de Protección deDatos, especialmente cuando no haya obtenido satisfacción en el ejercicio de sus derechos.
            </span>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>