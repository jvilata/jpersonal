import { Loading, copyToClipboard } from 'quasar'
import { axiosInstance, headerFormData } from 'boot/axios.js'
import querystring from 'querystring'
import login from './store-login'
import permisos from './store-permisos'
import { getMaxListeners } from 'process'

const state = {
  listaEmpleados: [],
  idautorizador: 0
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
        Loading.hide()
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

  loadFilialEmpleado({ commit }, idempleado) {
    return new Promise((resolve, reject) => {
      var emp = state.listaEmpleados.find(record => record.id == idempleado)
      let objFilter = { pais: emp.paisLaboral }
      axiosInstance.get(`bd_jpersonal.asp?action=filiales/list&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true })
      .then((response) => {
        var filialEmpleado = { filial: response.data[0], bloquesFilial: [] }
        objFilter = { idfilial: filialEmpleado.filial.idfilial }
        axiosInstance.get(`bd_jpersonal.asp?action=filialesbloques/list&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true })
        .then((response) => {
          filialEmpleado.bloquesFilial = response.data
          
          resolve(filialEmpleado)
        })
        .catch(error => {
          this.dispatch('mensajeLog/addMensaje', 'loadBloquesFilialEmpleado' + error, { root: true })
          reject(error)
        })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadFilialEmpleado' + error, { root: true })
        reject(error)
      })
    })
  },

  loadDiasPendientes({ commit }, objFilterP) {
    return axiosInstance.get(`bd_jpersonal.asp?action=diasvacaciones&auth=${login.state.user.auth}`, { params: objFilterP }, { withCredentials: true })
  },

  loadDiasConcedidos({ commit }, objFilterP) {
    return new Promise((resolve, reject) => {
      axiosInstance.post(`bd_jpersonal.asp?action=vacaciones/CuentaDiasAprobados&auth=${login.state.user.auth}`, querystring.stringify(objFilterP), headerFormData)
      .then((response) => {
        console.log('response', response)
        resolve(response)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadDiasConcedidos' + error, { root: true })
        reject(error)
      })
    })
  },

  calcularResponsable( { commit }, params ){
    return axiosInstance.post(`bd_jpersonal.asp?action=cpersonal_of/calcularResponsable&auth=${login.state.user.auth}`, querystring.stringify(params), headerFormData)
  },

  sendMail({ commit }, datos) {
    axiosInstance.post(`bd_jpersonal.asp?action=services/sendmail&auth=${login.state.user.auth}`, querystring.stringify(datos), headerFormData)
    .then((response) => {
      console.log('response', response)
    })
    .catch(error => {
      this.dispatch('mensajeLog/addMensaje', 'sendMail' + error, { root: true })
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
