import { Loading } from 'quasar'
import { axiosInstance, headerFormData } from 'boot/axios.js'
import querystring from 'querystring'
import login from './store-login'

const state = {
  listaEmpleados: [],
  listaPaises: [],
  idautorizador: 0,
  listaPuestos: []
}

const mutations = {
  loadListaEmpleados(state, lista) {
    state.listaEmpleados= lista
  },
  loadListaPaises(state, lista) {
    state.listaPaises= lista
  },
  loadFilialEmpleado(state, filial) {
    state.filialEmpleado= filial    
    console.log('FilialEmpleado', state.filialEmpleado);
  },
  loadBloquesFilialEmpleado(state, bloques) {
    state.bloqueFilialEmpleado= bloques
    console.log('bloqueFilialEmpleado', state.bloqueFilialEmpleado);
  },
  loadListaPuestos(state, lista) {
    state.listaPuestos= lista
  }
} 

const actions = {
  loadListaDetalleEmpleados({ commit }, objFilter) {
    return axiosInstance.get(`bd_jpersonal.asp?action=cpersonal_of&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) 
  },

  loadDetalleEmpleado({ commit }, id) {
    return axiosInstance.get(`bd_jpersonal.asp?action=pers_empleados_of/id/${id}&auth=${login.state.user.auth}`, { }, { withCredentials: true }) 
  },

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

  loadCompetencias({ commit }) {
    return axiosInstance.get(`bd_jpersonal.asp?action=competencias&auth=${login.state.user.auth}`, { params: {idempleado: login.state.user.pers.id} }, { withCredentials: true }) 
  },

  loadListaPaises({ commit }) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=Codigospais/list&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + 'No existen datos', { root: true })
        } else {
          commit('loadListaPaises', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + error, { root: true })
      })
  },

  loadListaPuestos({ commit }, codPuesto ) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=puesto/list&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaPuestos' + 'No existen datos', { root: true })
        } else {
          commit('loadListaPuestos', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadListaPuestos' + error, { root: true })
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

  loadDiasPermisos({ commit }, value) {
    return new Promise((resolve, reject) => {
      let objFilterP = { IdEmpleado: value.empleado, solejercicio: value.ejercicioAplicacion }
      axiosInstance.post(`bd_jpersonal.asp?action=vacaciones/CuentaDiasAprobados&auth=${login.state.user.auth}`, querystring.stringify(objFilterP), headerFormData) //Dias Concedidos
      .then((response) => {
        let dias = { diasConcedidos: response.data, diasPendientes: {} }
        objFilterP = { solIdEmpleado: value.empleado, solejercicio: value.ejercicioAplicacion }
        axiosInstance.get(`bd_jpersonal.asp?action=diasvacaciones&auth=${login.state.user.auth}`, { params: objFilterP }, { withCredentials: true }) //Dias Pendientes
        .then((response) => {
          dias.diasPendientes.tdiasvacaciones = response.data[0].diasdevacaciones
          resolve(dias)
        })
        .catch(error => {
          this.dispatch('mensajeLog/addMensaje', 'loadDiasPendientes' + error, { root: true })
          reject(error)
        })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadDiasConcedidos' + error, { root: true })
        reject(error)
      })
    })
  },

  calcularResponsable( { commit }, params ){
    return axiosInstance.post(`bd_jpersonal.asp?action=cpersonal_of/calcularResponsable&auth=${login.state.user.auth}`, querystring.stringify(params), headerFormData)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
