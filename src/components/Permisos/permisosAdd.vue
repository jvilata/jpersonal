 <!-- componente que se llama desde accionesMain y que presenta el formulario de filtro y el boton de busqueda -->
  <template>
  <div>
    <q-card style="width: 330px;" class="q-pa-xs q-gutter-xs">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Solicitar nuevo permiso</div>
        <small @click="verNormativa()"><u>Normativa de permisos y vacaciones</u></small>
      </q-card-section>

      <q-form @submit="solicitarPermiso" class="q-gutter-y-xs">

        <q-input 
          outlined 
          clearable 
          label="Fecha Desde" 
          stack-label 
          :value="formatDate(permisoToAdd.fechaDesde, 'DD/MM/YYYY')"
          :rules="[val => !!val || 'Campo obligatorio']">
          <template v-slot:append>
              <q-icon name="event" class="cursos-pointer">
                <q-popup-proxy ref="qFechaDesde">
                  <wgDate 
                    @input="$refs.qFechaDesde.hide()"
                    v-model="permisoToAdd.fechaDesde" />
                </q-popup-proxy>
              </q-icon>
          </template>
        </q-input>
        <q-input 
          outlined 
          clearable 
          label="Fecha Hasta" 
          stack-label 
          :value="formatDate(permisoToAdd.fechaHasta, 'DD/MM/YYYY')"
          :rules="[val => !!val || 'Campo obligatorio']">
          <template v-slot:append>
              <q-icon name="event" class="cursos-pointer">
                <q-popup-proxy ref="qFechaHasta">
                  <wgDate 
                    @input="{ $refs.qFechaHasta.hide(); calcDiasEfectivos()}"
                    v-model="permisoToAdd.fechaHasta"/>
                </q-popup-proxy>
              </q-icon>
          </template>
        </q-input>
        <q-select
          :disable="disableNumJornadas"
          ref="diasEfectivos"
          label="N. Jornadas"
          stack-label
          outlined
          clearable
          v-model="permisoToAdd.diasEfectivos"
          :options="numJornadas"
          option-value="id"
          option-label="desc"
          emit-value
          map-options
          :rules="[val => !!val || 'Campo obligatorio']"
        />
        <q-select
          label="Tipo Jorn. Libre"
          stack-label
          outlined
          clearable
          v-model="permisoToAdd.tipoDiaLibre"
          :options="listaTiposDiasLibres"
          option-value="id"
          option-label="descripcionDiaLibre"
          emit-value
          map-options
          :rules="[val => !!val || 'Campo obligatorio']"
        />
        <q-input clearable outlined stack-label type="textarea" label="Observaciones" v-model="permisoToAdd.observaciones"/>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="$emit('close')"/><!-- lo captura accionesMain -->
          <q-btn flat type="submit" label="Solicitar" color="primary"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { date } from 'quasar'
import wgDate from 'components/General/wgDate.vue'
import { openURL } from "quasar"

export default {
  props: ['value', 'empleadoP'], // value es el objeto con los campos de filtro que le pasa accionesMain con v-model
  data () {
    return {
      permisoToAdd: {
        empleado: 0,
        ejercicioAplicacion: 0,
        fechaDesde: '',
        fechaHasta: '',
        diasEfectivos: '',
        tipoDiaLibre: 0
      },
      numJornadas: ['1', '0.5', '0.25'],
      disableNumJornadas: false,
      done: false
    }
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes', 'permisosConcedidos']),
    ...mapState('tablasAux', ['listaTiposDiasLibres']),
    ...mapState('empleados', ['listaEmpleados']),
    ...mapState('login', ['user'])
  },
  components: {
    wgDate: wgDate
  },
  mounted () {
    this.permisoToAdd.fechaDesde = new Date ()
    this.permisoToAdd.fechaHasta = new Date ()
    this.calcDiasEfectivos()
    this.permisoToAdd.tipoDiaLibre = 1
    this.permisoToAdd.empleado = this.value.filterRecord.empleado
    this.permisoToAdd.ejercicioAplicacion = this.value.filterRecord.ejercicioAplicacion
  },
  methods: {
    ...mapActions('permisos', ['addPermisoPendiente']),
    ...mapActions('empleados', ['calculaResponsable']),
    ...mapActions('mensajeLog', ['addMensaje']),
    ...mapActions('tablasAux', ['sendMail']),
    formatDate (pdate, mask) {
      return date.formatDate(pdate, mask)
    },
    verNormativa() {
      let filialAbrev = this.empleadoP.filialEmpleado.filial.abrev
      let url = 'https://gestion.edicom.es/fichajes/NormasDeRegimenInternoEDICOM_'
      switch (filialAbrev) {
        case 'ES':
          url += 'ES.pdf'
          break;
        case 'MX':
          url += 'MX.pdf'
          break;
        case 'FR':
          url += 'FR.pdf'
          break;
        case 'AR':
          url += 'AR.pdf'
          break;
        case 'US':
          url += 'US.pdf'
          break;
        case 'BR':
          url += 'BR.pdf'
          break;
        case 'CO':
          url += 'CO.pdf'
          break;
        default: 
          url += 'ES.pdf'
      }
      console.log('url', url)
        if (window.cordova === undefined) { // desktop
          openURL(url)
        } else { // estamos en un disp movil
          document.addEventListener('deviceready', () => {
            window.cordova.InAppBrowser.open(url, '_system') // openURL
          }, false)
        }
    },
    calcDiasEfectivos() {
      if (this.permisoToAdd.fechaDesde && this.permisoToAdd.fechaHasta) {
        let diasEfectivos = date.getDateDiff(this.permisoToAdd.fechaHasta, this.permisoToAdd.fechaDesde, 'days') + 1
        if (diasEfectivos > 1) {
          this.permisoToAdd.diasEfectivos = diasEfectivos
          this.disableNumJornadas = true
        } else {
          this.permisoToAdd.diasEfectivos = 1
          this.disableNumJornadas = false
        }
      }
    },
    solicitarPermiso() {
      //Creamos el registro de la solicitud
      let solicitud = {
        ejercicioAplicacion: this.permisoToAdd.ejercicioAplicacion,
        empleado: this.permisoToAdd.empleado,
        sfechaDesde: this.formatDate(this.permisoToAdd.fechaDesde, 'YYYY-MM-DD'),
        sfechaHasta: this.formatDate(this.permisoToAdd.fechaHasta, 'YYYY-MM-DD'),
        diasEfectivos: this.permisoToAdd.diasEfectivos,
        tipoDiaLibre: this.permisoToAdd.tipoDiaLibre,
        observaciones: this.permisoToAdd.observaciones,
        idAutorizadorOf: this.empleadoP.autorizador.idAutorizadorOf,
        estadoSolicitud: 1,
        tipoSolicitud: 'PERMISO',
        nuevaVersion: true,
        fechaSolicitud: this.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ssZ'),
        datosSolicitud: JSON.stringify({
          solIdEmpleado: this.permisoToAdd.empleado,
          solejercicio: this.permisoToAdd.ejercicioAplicacion,
          sfdesde: this.formatDate(this.permisoToAdd.fechaDesde, 'YYYY-MM-DD'),
          sfhasta: this.formatDate(this.permisoToAdd.fechaHasta, 'YYYY-MM-DD'),
          ndias: this.permisoToAdd.diasEfectivos,
          tipoDia: this.permisoToAdd.tipoDiaLibre,
          observaciones: this.permisoToAdd.observaciones,
          tdiaslibres: this.empleadoP.diasPendientes.tdiaslibres,
          tdiastotales: this.empleadoP.diasPendientes.tdiasvacaciones,
          tdiaspendientes: this.empleadoP.diasPendientes.tdiaslibres,
          tdiasVacaciones: this.empleadoP.diasConcedidos.tdiasVacaciones,
          tdiasBaja: this.empleadoP.diasConcedidos.tdiasBaja,
          tdiasEspeciales: this.empleadoP.diasConcedidos.tdiasEspeciales 
          })
       }

      //Comprobaciones
      var binsertar = true

      if  (solicitud.tipoDiaLibre === 1) { //Si son vacaciones
        if ( (this.empleadoP.diasPendientes.tdiaslibres - this.empleadoP.diasPendientes.tdiaspendientes - solicitud.diasEfectivos != 0) &&
             (this.empleadoP.diasPendientes.tdiaslibres - this.empleadoP.diasPendientes.tdiaspendientes - solicitud.diasEfectivos) < this.empleadoP.filialEmpleado.filial.solicitudMinima ) {
          this.alerta('Atención',"No tiene suficientes días libres para hacer esta petición. Por favor corrija la entrada. Debe dejar saldo mínimo de "+this.empleadoP.filialEmpleado.filial.solicitudMinima+' días')
          binsertar = false
        } else {
          binsertar = this.solicitarSegunReglas2017(solicitud)
        }
      }
      if ( (solicitud.tipoDiaLibre >= 10) && (solicitud.tipoDiaLibre <= 15) || solicitud.tipoDiaLibre === 17) { //Permiso NO Retribuido
        
        if ( solicitud.diasEfectivos < 1 ) { //Solo permito dias completos
          this.alerta('Atención',"Sólo se permiten permisos no retribuidos de día completo, considere cambiar por Vacaciones. Por favor corrija la entrada")
          binsertar = false
        } else if ( this.empleadoP.diasPendientes.tdiaslibres >= (solicitud.diasEfectivos + this.empleadoP.diasPendientes.tdiaspendientes) ) {
          this.alerta('Aviso',"Mientras queden suficientes vacaciones la empresa recomienda no tomar permisos no retribuidos. Por favor corrija la entrada si lo considera conveniente");
        }
      }

      //LLAMADA BACKEND
      if (binsertar) {
        this.$q.loading.show()
        this.addPermisoPendiente(solicitud)
        .then((response) => {
          this.$q.loading.hide()
          if (JSON.parse(response.data).success) {
            this.$q.notify({
              color: 'primary',
              message: 'Solicitud registrada correctamente'
            })
            this.$emit('close')
            this.$emit('refresh')
            this.$emit('ok')
            //Send email
            let emp = this.listaEmpleados.find(record => record.id == solicitud.empleado)
            let mail = {
              to: this.empleadoP.autorizador.emailAutorizador,
              from: 'edicom@edicom.es',
              subject: `Nueva solicitud vacaciones/permiso/baja de ${emp.name}`,
              text: `Del ${this.formatDate(solicitud.sfechaDesde, 'DD/MM/YYYY')} al ${this.formatDate(solicitud.sfechaHasta, 'DD/MM/YYYY')}. Observaciones: ${solicitud.observaciones ? solicitud.observaciones : ''}.\nRevísala cuando puedas para su aprobación.\nSaludos.`
            } 
            this.sendMail(mail)

          } else {
            Notify.create('No se ha podido registrar su solicitud')
          }
        })
        .catch(error => {
          this.addMensaje('solicitarPermiso' + error)
        })
      }

    },

    solicitarSegunReglas2017(solicitud) {
      let binsertar = false

      //Inicializamos variables locales para comprobaciones
      let nDiasSueltos = 0
      let nRepeticionesBloque = 0
      let maxRepeticionesBloque = 0
      let conflictoMinimo = 0
      let permiso

      //Cargamos datos auxiliares para las comprobaciones
      let filial = this.empleadoP.filialEmpleado.filial
      let bloques = this.empleadoP.filialEmpleado.bloquesFilial

      let diasEntreBloques = filial.diasEntreBloques
      let nroDiasFraccionados = filial.nroDiasFraccionados
      let fraccionMinima = filial.fraccionMinima

      //Bucle Permisos Pendientes
      for (let i = 0; i < this.permisosPendientes.length; ++i) {
        permiso = this.permisosPendientes[i]
        if (permiso.tipoDiaLibre === 1) { //Si son vacaciones
          if (permiso.diasEfectivos <= 1) { nDiasSueltos += permiso.diasEfectivos } //Si es un dia suelto -> Lo voy contando
          else if (((Math.abs(date.getDateDiff(solicitud.sfechaDesde, permiso.sfechaHasta, 'days'))) <= diasEntreBloques) ||
                   ((Math.abs(date.getDateDiff(solicitud.sfechaHasta, permiso.sfechaDesde, 'days'))) <= diasEntreBloques) ) {
                     conflictoMinimo = true
          }
          if (permiso.diasEfectivos === solicitud.diasEfectivos) { //Bucle comprobacion bloques
            for (let j = 0; j < bloques.length; j++) {
              if (permiso.diasEfectivos === bloques[j].bloque) {
                nRepeticionesBloque++
              }
            }
          }
        }
      }
      //Bucle Permisos Concedidos
      for (let i = 0; i < this.permisosConcedidos.length; ++i) {
        permiso = this.permisosConcedidos[i]
        if (permiso.tipoDiaLibre === 1) { //Si son vacaciones
          if (permiso.diasEfectivos <= 1) { nDiasSueltos += permiso.diasEfectivos } //Si es un dia suelto -> Lo voy contando
          else if (((Math.abs(date.getDateDiff(solicitud.sfechaDesde, permiso.sfechaHasta, 'days'))) <= diasEntreBloques) ||
                   ((Math.abs(date.getDateDiff(solicitud.sfechaHasta, permiso.sfechaDesde, 'days'))) <= diasEntreBloques) ) {
            conflictoMinimo = true
          }
          if (permiso.diasEfectivos === solicitud.diasEfectivos) { //Bucle comprobacion bloques
            for (let j = 0; j < bloques.length; j++) {
              if (permiso.diasEfectivos === bloques[j].bloque) {
                nRepeticionesBloque++
              }
            }
          }
        }
      }

      //Comprobaciones
      if (solicitud.diasEfectivos < filial.solicitudMinima) {
        this.alerta('Atención','No se pueden pedir una fracción inferior a '+filial.solicitudMinima+' días')
      } else if (solicitud.diasEfectivos <= 1) { //COMPROBACIONES PARA DIAS SUELTOS
        binsertar = true
        if (solicitud.diasEfectivos < fraccionMinima) { //Si solicito una fracción menor a la fracción mínima
          this.alerta('Atención','No se puede pedir una fracción inferior a '+fraccionMinima+' días');
          binsertar = false
        } else if ((nDiasSueltos + solicitud.diasEfectivos) === nroDiasFraccionados) { //Si agoto los días sueltos
          this.alerta('Aviso','Esta solicitud agota los días sueltos. El resto de días que quedan por solicitar deberían estar concatenados a algún periodo vacacional')
        } else if (nDiasSueltos + solicitud.diasEfectivos > nroDiasFraccionados) { //Si excedo los días sueltos
          this.alerta('Atención','Esta solicitud excede los días sueltos disponibles. Solicite otro periodo.')
          binsertar = false
        }
      } else if (bloques.length > 0) { //COMPROBACIONES PARA BLOQUES (Solo compruebo si tengo bloques configurados)
        if ( // (solicitud.ejercicioAplicacion === 2021 && solicitud.diasEfectivos > 15) || //Solo 2021 convencion permito bloques de 15 o más dias
            (this.empleadoP.diasPendientes.tdiaslibres === solicitud.diasEfectivos + this.empleadoP.diasPendientes.tdiaspendientes)) { //Si agota los dias libres -> No compruebo bloques
          binsertar = true
        } else { //Comprobamos si existe un bloque configurado igual
          let encontrado = false
          for (let i = 0; ( (!encontrado) && (i < bloques.length) ); ++i) {
            if (solicitud.diasEfectivos === bloques[i].bloque) { //Encontrado uno igual
              encontrado = true
              maxRepeticionesBloque = bloques[i].repeticiones
            }
          }
          if (!encontrado) { //No coincide con ningún bloque configurado
            this.alerta('Atención','Debe solicitar dias sueltos de uno en uno o bloques según disponibilidad')
            binsertar = false
          } else {
            binsertar = true
          }
        }
        if (binsertar) {
          if ((solicitud.ejercicioAplicacion != 2021) && //No es año de convención
              (this.empleadoP.diasPendientes.tdiaslibres != solicitud.diasEfectivos + this.empleadoP.diasPendientes.tdiaspendientes) && //No agota días libres
              (conflictoMinimo)) {
            this.alerta('Atención',"Debe dejar "+diasEntreBloques+" días entre bloques")
            binsertar = false
          }
        }
        if (binsertar) {
          if (maxRepeticionesBloque > 0 && nRepeticionesBloque >= maxRepeticionesBloque) {
            this.alerta('Atención',"Sólo se puede solicitar un máximo de "+maxRepeticionesBloque+" bloque/s")
            binsertar = false
          }
        }
      } else { binsertar = true }

      return binsertar
    },

    alerta (titulo, mensaje) {
      this.$q.dialog({
        title: titulo,
        message: mensaje
      })
    }
  }
}
</script>