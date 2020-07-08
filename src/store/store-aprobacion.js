import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import login from './store-login'

const state = {
  listaCambios: []
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