import { Notify, Loading } from "quasar"
import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import login from './store-login'

const state = {
  permisosPendientes: [],
  permisosConcedidos: []
}

const mutations = {
  addJustificante (state, [id, justificante]) {
    let index = state.permisosConcedidos.findIndex(perm => perm.id == id);
    state.permisosConcedidos[index].justificante = justificante
    Notify.create('Justificante añadido')
  },
  deleteJustificante (state, id) {
    let index = state.permisosConcedidos.findIndex(perm => perm.id == id);
    state.permisosConcedidos[index].justificante = undefined
    Notify.create('Justificante eliminado')
  },
  loadPermisosPendientes(state, lista) {
    state.permisosPendientes = []
    state.permisosPendientes = lista
  },
  loadPermisosConcedidos(state, lista) {
    state.permisosConcedidos = []
    state.permisosConcedidos = lista
  }
}

const actions = {
  getPermisosPendientes({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)  
    axiosInstance.get(`bd_jpersonal.asp?action=soldias&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        console.log('PendientesDone');
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'getPermisosPendientes' + 'No existen datos', { root: true })
          commit('loadPermisosPendientes', response.data)
        } else {
          commit('loadPermisosPendientes', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'getPermisosPendientes' + error, { root: true })
      })
  },
  getPermisosConcedidos({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)
    axiosInstance.get(`bd_jpersonal.asp?action=vacaciones/todas&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        console.log('ConcedidosDone');
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'getPermisosConcedidos' + 'No existen datos', { root: true })
        } else {
          commit('loadPermisosConcedidos', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'getPermisosConcedidos' + error, { root: true })
      })
  },
  deletePermisoPendiente({ commit }, payload){
    return axiosInstance.get(`bd_jpersonal.asp?http_method=DELETE&action=soldias/${payload.id}?&auth=${login.state.user.auth}`, payload, { withCredentials: true })
  },



  addJustificante ({ commit }, [id, justificante]) {
    commit('addJustificante',[id, justificante] )
  },
  deleteJustificante ({ commit }, id) {
    commit('deleteJustificante', id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
