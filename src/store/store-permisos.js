import { uid, Notify } from "quasar"
import Vue from 'vue'
import { axiosInstance, headerFormData } from 'boot/axios.js'

const state = {
  permisosPendientes: [
    {
      id: 0,
      ejercicio: 2020,
      fechaDesde: '2020-06-04 00:00:00',
      fechaHasta: '2020-06-04 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test0',
      estado: 'PENDIENTE',
      empleado:'Marta Vilata Darder' 
    },
    {
      id: 1,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test1',
      estado: 'PENDIENTE',
      empleado:'Javier Hernández Cerrillo' 
    },
    {
      id: 2,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test2',
      estado: 'PENDIENTE',
      empleado:'José Blas Vilata Tamarit' 
    },
    {
      id: 3,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test3',
      estado: 'PENDIENTE',
      empleado:'Ana Darder Navarro' 
    },
    {
      id: 4,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test1',
      estado: 'PENDIENTE',
    }
    ],
  permisosConcedidos: [
    {
      id: 10,
      ejercicio: 2020,
      fechaDesde: '2020-06-10 00:00:00',
      fechaHasta: '2020-06-10 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test',
    },
    {
      id: 11,
      ejercicio: 2020,
      fechaDesde: '2020-06-10 00:00:00',
      fechaHasta: '2020-06-10 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test',
    },
    {
      id: 12,
      ejercicio: 2020,
      fechaDesde: '2020-06-10 00:00:00',
      fechaHasta: '2020-06-10 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test',
    }
  ]
}

const mutations = {
  addPermiso (state, payload) {
    payload.id = uid()
    payload.ejercicio = '2020'
    payload.estado = 'PENDIENTE'
    state.permisosPendientes.push(payload)
    Notify.create('Permiso añadido')
  },
  deletePermiso(state, id) {
    let index = state.permisosPendientes.findIndex(perm => perm.id == id);
    Vue.delete(state.permisosPendientes, index)
    Notify.create('Permiso borrado')
  },
  addJustificante (state, [id, justificante]) {
    let index = state.permisosConcedidos.findIndex(perm => perm.id == id);
    state.permisosConcedidos[index].justificante = justificante
    Notify.create('Justificante añadido')
  },
  deleteJustificante (state, id) {
    let index = state.permisosConcedidos.findIndex(perm => perm.id == id);
    state.permisosConcedidos[index].justificante = undefined
    Notify.create('Justificante eliminado')
  }
}

const actions = {
  addPermiso ({ commit }, payload) {
    commit('addPermiso', payload)
  },
  deletePermiso({ commit }, id){
    commit('deletePermiso', id)
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
