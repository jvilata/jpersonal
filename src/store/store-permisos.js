import { uid } from "quasar"
import Vue from 'vue'

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
    },
    {
      id: 4,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test4',
      estado: 'PENDIENTE',
    },
    {
      id: 5,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test5',
      estado: 'PENDIENTE',
    },
    {
      id: 6,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test6',
      estado: 'PENDIENTE',
    },
    {
      id: 7,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test7',
      estado: 'PENDIENTE',
    },
    {
      id: 8,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test8',
      estado: 'PENDIENTE',
    },
    {
      id: 9,
      ejercicio: 2020,
      fechaDesde: '2020-07-15 00:00:00',
      fechaHasta: '2020-07-15 00:00:00',
      numJornadas: 1,
      tipoJornadaLibre: 'Vacaciones',
      observaciones: 'test9',
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
  },
  deletePermiso(state, id) {
    let index = state.permisosPendientes.findIndex(perm => perm.id == id);
		Vue.delete(state.permisosPendientes, index)
  } 
}

const actions = {
  addPermiso ({ commit }, payload) {
    commit('addPermiso', payload)
  },
  deletePermiso({ commit }, id){
    commit('deletePermiso', id)
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
