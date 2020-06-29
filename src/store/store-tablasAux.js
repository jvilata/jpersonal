// hemos creado este store para crear unas variables globales utiles accesibles desde cualquier componente de la app.
// la mayoria son listas cargadas de la tabla auxiliar de la BD

// en los stores no se ha cargado todavía this.$axios con nuestra configuracion de boot/axios.js, por eso
// lo importo y uso la variable especifica exportada en ese modulo axiosInstance
import { axiosInstance } from 'boot/axios.js'

// state: accesibles en lectura desde componentes a traves de ...mapState('tablasAux', ['listaSINO', 'listaUsers', 'listaTipoAcc'])
const state = {
  listaUsers: [], // [{id, codEmpresa, email, username, idPersonal}]
  listaSINO: [{ id: '1', desc: 'SI' }, { id: '0', desc: 'NO' }],
  listaEmpresas: [{ codElemento: '01', valor1: 'EDICOM CAPITAL SL' }]
}
// mutations: solo están accesibles a las actions a traves de commit, p.e., commit('loadUsers')
const mutations = {
  loadUsers (state, users) {
    state.listaUsers = users
  }
}
// actions: accesibles desde componentes a traves de ...mapActions('tablaAux', ['loadTablasAux'])
// actualmente se esta llamando desde components/mainTabs.vue, es decir, cuando se pasa la validacion de usuario
const actions = {
  loadTablasAux () {
    // this.dispatch('tablasAux/loadTablaAux', { codTabla: 9, mutation: 'loadTipoAcc' })
    this.dispatch('tablasAux/loadUsers')
  },
  loadUsers ({ commit }) {
    axiosInstance.get('users/bd_users.php/findUsersFilter/', {}, { withCredentials: true })
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadUsers' + 'No existen datos', { root: true })
        } else {
          commit('loadUsers', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadUsers' + error, { root: true })
      })
  },
  loadTablaAux ({ commit }, tabAux) { // tabAux: { codTabla: x, mutation: 'mutation' }
    axiosInstance.get(`tablaAuxiliar/bd_tablaAuxiliar.php/findTablaAuxFilter?codTabla=${tabAux.codTabla}`, {}, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', tabAux.mutation + 'No existen datos', { root: true })
        } else {
          commit(tabAux.mutation, response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', tabAux.mutation + error, { root: true })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
