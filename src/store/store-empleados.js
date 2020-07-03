import { uid, Notify } from "quasar"
import Vue from 'vue'

const state = {
  empleados: [
    {
      idEmpleado: 1,
      idPersonal: 1,
      nombrePersona: 'Javier Hernández'
    },
    {
        idEmpleado: 2,
        idPersonal: 2,
        nombrePersona: 'Marta Vilata'
    },
    {
        idEmpleado: 3,
        idPersonal: 3,
        nombrePersona: 'Jose Blas Vilata'
    },
    {
        idEmpleado: 4,
        idPersonal: 4,
        nombrePersona: 'Ana Darder'
    },

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