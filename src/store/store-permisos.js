import { uid, Notify } from "quasar"
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
    },
    // {
    //   id: 5,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test2',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 6,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test3',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 7,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test1',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 8,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test2',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 9,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test3',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 10,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test1',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 11,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test2',
    //   estado: 'PENDIENTE',
    // },
    // {
    //   id: 12,
    //   ejercicio: 2020,
    //   fechaDesde: '2020-07-15 00:00:00',
    //   fechaHasta: '2020-07-15 00:00:00',
    //   numJornadas: 1,
    //   tipoJornadaLibre: 'Vacaciones',
    //   observaciones: 'test3',
    //   estado: 'PENDIENTE',
    // }
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
  deletePermisoPendiente(state, id) {
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
  },
  loadPermisosPendientes(state, lista) {
    //Lista se devuelve del backend
    state.permisosPendientes = lista
  }
}

const actions = {
  getPermisosPendientes() {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state (loadPermisos)
    axiosInstance.get(`bd_permisos.asp/findTablaAuxFilter?codTabla=${tabAux.codTabla}`, {}, { withCredentials: true }) // tipo acciones
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

  addPermisoPendiente ({ commit }, payload) { 
    //Llamaremos al backend para insertar el permiso en la tabla PRIV_Solicitud_Dias
    //Si va bien, llamaremos a getPermisosPendientes (.then)
    axiosInstance.get(`bd_permisos.asp/findTablaAuxFilter?codTabla=${tabAux.codTabla}`, {}, { withCredentials: true }) // tipo acciones
      .then((response) => {
        this.dispatch('permisos/getPermisosPendientes')
        Notify.create('Permiso añadido')
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'addPermisoPendiente' + error, { root: true })
      })
  },
  deletePermisoPendiente({ commit }, id){
    commit('deletePermisoPendiente', id)
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
