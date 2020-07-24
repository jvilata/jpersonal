import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import login from './store-login'

const state = {
  permisosPendientes: [],
  permisosConcedidos: [],
  justPorPresentar: 0,
  listaJustificantes: []
}

const mutations = {
  loadPermisosPendientes(state, lista) {
    if(!lista.length) state.permisosPendientes = []
    else state.permisosPendientes = lista
  },
  loadPermisosConcedidos(state, lista) {
    if(!lista.length) state.permisosConcedidos = []
    else state.permisosConcedidos = lista.sort((a, b) => { return (a.justificantesNoValidados + a.justificantesValidados) - (b.justificantesNoValidados + b.justificantesValidados) })
  },
  loadContJustificantesPorPresentar(state, lista) {
    if(!lista.length) state.justPorPresentar = 0
    else {
      function justificantesCont (acum, permiso) {
        if ((permiso.tipoDiaLibre === 9 || permiso.tipoDiaLibre === 19)) {
          if ((permiso.justificantesNoValidados === 0 && permiso.justificantesValidados === 0)) {
            acum++
          }
        }
        return acum;
      }
      state.justPorPresentar = lista.reduce(justificantesCont, 0)
    }
  },
  loadJustificantes(state, lista) {
    if(!lista.length) state.listaJustificantes = []
    else state.listaJustificantes = lista
  }
}

const actions = {
  getPermisosPendientes({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)  
    axiosInstance.get(`bd_jpersonal.asp?action=soldias&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
          commit('loadPermisosPendientes', response.data)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'getPermisosPendientes' + error, { root: true })
      })
  },
  getPermisosConcedidos({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)
    axiosInstance.get(`bd_jpersonal.asp?action=vacaciones/todas&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
          commit('loadPermisosConcedidos', response.data)
          commit('loadContJustificantesPorPresentar', response.data)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'getPermisosConcedidos' + error, { root: true })
      })
  },

  addPermisoPendiente({ commit }, payload) {
    return axiosInstance.post(`bd_jpersonal.asp?action=soldias&auth=${login.state.user.auth}`, payload, { withCredentials: true })
  },

  updatePermisoPendiente({ commit }, payload) {
    return axiosInstance.post(`bd_jpersonal.asp?http_method=PUT&action=soldias/${payload.id}&auth=${login.state.user.auth}`, payload, { withCredentials: true })
  },

  deletePermisoPendiente({ commit }, payload){
    return axiosInstance.get(`bd_jpersonal.asp?http_method=DELETE&action=soldias/${payload.id}?&auth=${login.state.user.auth}`, payload, { withCredentials: true })
  },

  getJustificantes({ commit }, payload) {
    axiosInstance.get(`bd_jpersonal.asp?action=attach/J&auth=${login.state.user.auth}`, payload, { withCredentials: true })
    .then((response) => {
      console.log(response)
      commit('loadJustificantes', response.data)
    })
    .catch(error => {
      this.dispatch('mensajeLog/addMensaje', 'getJustificantes' + error, { root: true })
    })
    
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
