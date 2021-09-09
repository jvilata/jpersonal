import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import login from './store-login'
import querystring from 'querystring'
import { Loading } from 'quasar'

const state = {
  listaCambios: []
}

const mutations = {
  loadListaCambios(state, lista) {
    if(!lista.length) { state.listaCambios = [] }
    else { state.listaCambios = lista }
  }
}

const actions = {
  getListaCambios({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)
    axiosInstance.get(`bd_jpersonal.asp?action=soldias/solicitudesPendientes&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
          commit('loadListaCambios', response.data)
          Loading.hide()
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'getListaCambios' + error, { root: true })
        Loading.hide()
      })
  },
  
  deleteCambios( { commit }, objToDelete) {
    axiosInstance.get(`bd_jpersonal.asp?http_method=DELETE&action=soldias/${objToDelete.id}&auth=${login.state.user.auth}`, { }, { withCredentials: true }) // tipo acciones
      .then((response) => {
          this.dispatch('aprobacion/getListaCambios', objToDelete.filterR)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'deleteCambios' + error, { root: true })
      })
  },
  // esta funcion ya no se llamara, se hace todo desde addToVacaciones
  generarReservasVacaciones( { commit }, solicitud) {
    return axiosInstance.get(`bd_jpersonal.asp?action=reservas/aprobarVac&auth=${login.state.user.auth}`, { params: solicitud }, { withCredentials: true })
  },
  rechazarPermiso( { commit }, solicitud) {
    return axiosInstance.get(`bd_jpersonal.asp?action=reservas/rechazarVac&auth=${login.state.user.auth}`, { params: solicitud }, { withCredentials: true })
  },
  addToVacaciones( { commit }, payload) {    
    var formData = new FormData()
    formData.append('idSol', payload.idSol)
    formData.append('observaciones', payload.observaciones)
    formData.append('fDesdeSust', payload.fDesdeSust)
    formData.append('fHastaSust', payload.fHastaSust)
    formData.append('sustituto', payload.sustituto)
    return axiosInstance.post(`bd_jpersonal.asp?action=soldias/create/vacaciones&auth=${login.state.user.auth}`, formData, { withCredentials: true })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  },

  aprobarCambiosEmpleado( { commit }, params) {  
    return axiosInstance.post(`bd_jpersonal.asp?action=pers_empleados_of/aprobacionCambiosEmpleado&auth=${login.state.user.auth}`, querystring.stringify(params), headerFormData)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}