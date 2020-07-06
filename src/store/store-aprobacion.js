import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import login from './store-login'

const state = {
  listaCambios: [
      {
        id: 0,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        fechaDesde: '2020-06-04 00:00:00',
        fechaHasta: '2020-06-04 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test0',
        estado: 'APROBADO',
        empleado: {
          idEmpleado: 2,
          idPersonal: 2,
          nombrePersona: 'Marta Vilata Darder'
        },
        tipo: 'PERMISO'
      },
      {
        id: 1,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'PENDIENTE',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'PERMISO'
      },
      {
        id: 2,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'PROVISIONAL',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'PERMISO'
      },
      {
        id: 3,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'DENEGADO',
        empleado: {
          idEmpleado: 2,
          idPersonal: 2,
          nombrePersona: 'Marta Vilata Darder'
        },
        tipo: 'OTROS CAMBIOS'
      },
      {
        id: 3,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        horaentrada1: '',
        horasalida1: '',
        horaentrada2: '',
        horasalida2: '',
        horaentrada3: '',
        horasalida3: '',
        horaentrada4: '',
        horasalida4: '',
        autorizador1: 'Javier Hernández Cerrillo',
        autorizador2: 'José Blas Vilata Tamarit',
        estado: 'PENDIENTE',
        empleado: {
          idEmpleado: 2,
          idPersonal: 2,
          nombrePersona: 'Marta Vilata Darder'
        },
        tipo: 'CAMBIO HORARIO'
      },
      {
        id: 3,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        teletrabajofechadesde: '2020-07-15',
        teletrabajofechahasta: '2020-12-15',
        paisteletrabajo: 'MEXICO',
        observaciones: 'test1',
        estado: 'PENDIENTE',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'TELETRABAJO'
      },
  ]
}

const mutations = {
  loadListaCambios(state, lista) {
    /*
    consentimientos: null
    datosSolicitud: "{"solIdEmpleado":44,"solejercicio":2019,"sfdesde":"2019-12-31","sfhasta":"2019-12-31","ndias":1,"tipoDia":1,"observaciones":"","tdiaslibres":"25","tdiastotales":"32","tdiaspendientes":"0","tdiasVacaciones":"7","tdiasBaja":"0","tdiasEspeciales":"0"}"
    denegada: false
    diasEfectivos: 1
    ejercicioAplicacion: 2019
    empleado: 44
    empleadoArea: 16
    empleadoEmail: "adarder@edicom.es"
    empleadoEmailNotif: ""
    empleadoFoto: "45.jpg"
    empleadoGrupoETM: ""
    empleadoIdpersonal: 45
    empleadoNombre: "ANA MARIA DARDER NAVARRO"
    estadoSolicitud: 1
    estadoSolicitudDesc: "PENDIENTE"
    fechaDesde: "2019-12-31T00:00:00"
    fechaHasta: "2019-12-31T00:00:00"
    fechaSolicitud: "2019-11-26T09:20:54"
    id: 46930
    idAutorizadorOf: 140
    idautArea2: 0
    nomAutArea2: null
    nomAutorizadorOf: "JOSE BLAS VILATA TAMARIT"
    nuevaVersion: true
    observaciones: ""
    sfechaDesde: "2019-12-31T00:00:00"
    sfechaHasta: "2019-12-31T00:00:00"
    tipoDiaDesc: "Vacaciones"
    tipoDiaLibre: 1
    tipoSolicitud: "PERMISO" 
    */
    state.listaCambios = lista
  }
}

const actions = {
  getListaCambios({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)
    axiosInstance.get(`bd_jpersonal.asp?action=soldias/solicitudesPendientes&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'getListaCambios' + 'No existen datos', { root: true })
        } else {
          commit('loadListaCambios', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'getListaCambios' + error, { root: true })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}