import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import login from './store-login'

const state = {
  listaCambios: []
}

const mutations = {
  loadListaCambios(state, lista) {
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
  aprobarPermiso( { commit }, solicitud) {
    axiosInstance.get(`bd_jpersonal.asp?action=reservas/aprobarVac&auth=${login.state.user.auth}`, { params: solicitud }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        console.log(response);
        this.dispatch('aprobacion/getListaCambios', { empleado: login.state.user.id })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'aprobarPermiso' + error, { root: true })
      })
  },
  rechazarPermiso( { commit }, solicitud) {
    axiosInstance.get(`bd_jpersonal.asp?action=reservas/rechazarVac&auth=${login.state.user.auth}`, { params: solicitud }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        console.log(response);
        this.dispatch('aprobacion/getListaCambios', { empleado: login.state.user.id })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'aprobarPermiso' + error, { root: true })
      })
  },
  addToVacaciones( { commit }, payload) {
    
    axiosInstance.post(`bd_jpersonal.asp?action=vacaciones/id&auth=${login.state.user.auth}`, payload, { withCredentials: true })
      .then((response) => {
        console.log('response', response)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'addToVacaciones' + error, { root: true })
      })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}