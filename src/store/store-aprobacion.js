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
        // if (response.data.length === 0) {
        //   this.dispatch('mensajeLog/addMensaje', 'getListaCambios' + 'No existen datos', { root: true })
        // } else {
          commit('loadListaCambios', response.data)
          Loading.hide()
        //}
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
        console.log('aprobarPermiso', response);
        this.dispatch('aprobacion/getListaCambios', { empleado: login.state.user.id })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'aprobarPermiso' + error, { root: true })
      })
  },
  rechazarPermiso( { commit }, solicitud) {
    return new Promise((resolve, reject) => {
      axiosInstance.get(`bd_jpersonal.asp?action=reservas/rechazarVac&auth=${login.state.user.auth}`, { params: solicitud }, { withCredentials: true }) // tipo acciones
        .then((response) => {
          console.log(response);
          resolve(response)
          //this.dispatch('aprobacion/getListaCambios', { empleado: login.state.user.id })
        })
        .catch(error => {
          this.dispatch('mensajeLog/addMensaje', 'aprobarPermiso' + error, { root: true })
          reject(error)
        })
      })
  },
  addToVacaciones( { commit }, payload) {         
    return new Promise((resolve, reject) => {
      axiosInstance.post(`bd_jpersonal.asp?action=vacaciones/id&auth=${login.state.user.auth}`, payload, { withCredentials: true })
      .then((response) => {
        //console.log('response', JSON.parse(response.data))
        resolve(JSON.parse(response.data).success)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'addToVacaciones' + error, { root: true })
        reject(error)
      })
    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  },

  aprobarCambiosEmpleado( { commit }, params) {  
    axiosInstance.post(`bd_jpersonal.asp?action=pers_empleados_of/aprobacionCambiosEmpleado&auth=${login.state.user.auth}`, querystring.stringify(params), headerFormData) // tipo acciones
      .then((response) => {
        console.log('aprobarCambiosEmpleado', response);
        this.dispatch('aprobacion/getListaCambios', { empleado: login.state.user.id })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'aprobarCambiosEmpleado' + error, { root: true })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}