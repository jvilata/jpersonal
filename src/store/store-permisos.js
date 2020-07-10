import { Notify } from "quasar"
import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import querystring from 'querystring'
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
    //Lista se devuelve del backend
    /* {
      id: 0,
      ejercicioAplicacion: 2020,
      fechaDesde: '2020-06-04 00:00:00',
      fechaHasta: '2020-06-04 00:00:00',
      fechaSolicitud: "2020-06-29T15:51:27.000+0000",
      diasEfectivos: 1,
      datosTipoDiaLibre: { descripcionDiaLibre: 'Vacaciones' },
      tipoDiaLibre: 1,
      observaciones: 'test0',
      tipoSolicitud: 'PERMISO',
      estadoSolicitud: 1,
      estadoSolicitudDesc: 'PENDIENTE',
      empleado: 140,
      datosEmpleado: { nombre: 'JOSE BLAS VILATA TAMARIT' }
    }, */
    state.permisosPendientes = []
    state.permisosPendientes = lista
  },
  loadPermisosConcedidos(state, lista) {
    //Lista se devuelve del backend
    /* {
      id: 0,
      ejercicioAplicacion: 2020,
      fechaDesde: '2020-06-04 00:00:00',
      fechaHasta: '2020-06-04 00:00:00',
      diasEfectivos: 1,
      datosTipoDiaLibre: { descripcionDiaLibre: 'Vacaciones' },
      tipoDiaLibre: 1,
      observaciones: 'test0',
      empleado: 140,
      datosEmpleado: { nombre: 'JOSE BLAS VILATA TAMARIT' }
    }, */
    state.permisosConcedidos = []
    state.permisosConcedidos = lista
  }
}

const actions = {
  getPermisosPendientes({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)  
    axiosInstance.get(`bd_jpersonal.asp?action=soldias&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'getPermisosPendientes' + 'No existen datos', { root: true })
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
    console.log('payload', payload);
    
    axiosInstance.delete(`bd_jpersonal.asp?http_method=DELETE&action=soldias/${payload.id}?&auth=${login.state.user.auth}&solIdEmpleado=${payload.empleado}&solejercicio=${payload.ejercicioAplicacion}`, payload, { withCredentials: true })
      .then((response) => {
        console.log('delete', response);
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'deletePermisoPendiente' + error, { root: true })
      })
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
