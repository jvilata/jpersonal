import Vue from 'vue'
import { axiosInstance } from 'boot/axios.js'
import login from './store-login'

const state = {
  listaEmpleados: []
}

const mutations = {
  loadListaEmpleados(state, lista) {
    state.listaEmpleados= lista
  }
}

const actions = {
  loadListaEmpleados({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=cpersonal_of/combo&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaEmpleados' + 'No existen datos', { root: true })
        } else {
          commit('loadListaEmpleados', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadListaEmpleados' + error, { root: true })
      })
  },
  calculaResponsable( { commit }, idEmpleado ){
    return 140
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
