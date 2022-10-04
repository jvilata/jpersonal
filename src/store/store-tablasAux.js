// hemos creado este store para crear unas variables globales utiles accesibles desde cualquier componente de la app.
// la mayoria son listas cargadas de la tabla auxiliar de la BD

// en los stores no se ha cargado todavía this.$axios con nuestra configuracion de boot/axios.js, por eso
// lo importo y uso la variable especifica exportada en ese modulo axiosInstance
import { axiosInstance, headerFormData } from 'boot/axios.js'
import login from './store-login'
import querystring from 'querystring'

// state: accesibles en lectura desde componentes a traves de ...mapState('tablasAux', ['listaSINO', 'listaUsers', 'listaTipoAcc'])
const state = {
  listaSINO: [{ id: '1', desc: 'SI' }, { id: '0', desc: 'NO' }],
  listaBoolean: [{ id: true, desc: 'SI' }, { id: false, desc: 'NO' }],
  listaEmpresas: [{ codElemento: '01', valor1: 'EDICOM CAPITAL SL' }],
  listaTiposCliente: [{ id: 1, nombre: 'CLIENTE' }, { id: 2, nombre: 'CLIENTE POTENCIAL' }, { id: 11, nombre: 'EXCLIENTE' }, { id: 4, nombre: 'OTROS' }, { id: 8, nombre: 'COLABORADOR' }, { id: 13, nombre: 'CLIENTE PASARELA' }, { id: 16, nombre: 'CLIENTE DIST' }, { id: 17, nombre: 'CLIENTE USU SER' }, { id: 18, nombre: 'COMPETENCIA' }],
  listaTiposDiasLibres: [],
  listaEstadosSolicitudes: [],
  listaTiposSolicitudes: [],
  listaAreas: [],
  listaSalas: [] //[{ id: 5, desc: 'Sala 5', plano: 'sala5.svg' }, { id: 7, desc: 'Sala 7', plano: 'sala7.svg' }, { id: 8, desc: 'Sala 8', plano: 'sala8.svg' }, { id: 10, desc: 'Sala Sistemas', plano: 'sala10.svg' }]
}
// mutations: solo están accesibles a las actions a traves de commit, p.e., commit('loadUsers')
const mutations = {
  loadUsers (state, users) {
    state.listaUsers = users
  },
  loadTiposDiasLibres (state, lista) {
    state.listaTiposDiasLibres = lista
  },
  loadEstadosSolicitudes (state, lista) {
    state.listaEstadosSolicitudes = lista
  },
  loadTiposSolicitudes(state, lista) {
    state.listaTiposSolicitudes = lista
  },
  loadListaSalas(state, lista) {
    lista.sort((a, b) => a.valor2 < b.valor2 ? 1 : -1)
    state.listaSalas = lista
  },
  loadAreas(state, lista) {
    lista.sort((a, b) => a.valor2 < b.valor2 ? -1 : 1)
    state.listaAreas = lista
  }
}
// actions: accesibles desde componentes a traves de ...mapActions('tablaAux', ['loadTablasAux'])
// actualmente se esta llamando desde components/mainTabs.vue, es decir, cuando se pasa la validacion de usuario
const actions = {
  loadTablasAux () {
    this.dispatch('tablasAux/loadTiposDiasLibres')
    this.dispatch('tablasAux/loadAreas')
    this.dispatch('tablasAux/loadTablaAuxiliar', { codTabla: 14, mutation: 'loadEstadosSolicitudes' })
    this.dispatch('tablasAux/loadTablaTiposSolicitudes', { codTabla: 34, mutation: 'loadTiposSolicitudes' })
    this.dispatch('tablasAux/loadTablaTiposSolicitudes', { codTabla: 37, mutation: 'loadListaSalas' })
  },
  loadTiposDiasLibres({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=tipodia&auth=${login.state.user.auth}`, { params: { solEmpleadoPais: 'ES' } }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadTiposDiasLibres' + 'No existen datos', { root: true })
        } else {
          commit('loadTiposDiasLibres', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadTiposDiasLibres' + error, { root: true })
      })
  },
  loadAreas({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=areasPersonal/list&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadAreas' + 'No existen datos', { root: true })
        } else {
          commit('loadAreas', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadTiposDiasLibres' + error, { root: true })
      })
  },
  loadTablaAuxiliar ({ commit }, tabAux) { // tabAux: { codTabla: x, mutation: 'mutation' }
  axiosInstance.get(`bd_jpersonal.asp?action=tablaAuxiliarGen&auth=${login.state.user.auth}`, { params: {tablaAuxiliar: tabAux.codTabla} }, { withCredentials: true }) // tipo acciones
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
  },
  loadTablaTiposSolicitudes({ commit }, tabAux){
    axiosInstance.get(`bd_jpersonal.asp?action=tablaAuxiliarGen&auth=${login.state.user.auth}`, { params: {tablaAuxiliar: tabAux.codTabla} }, { withCredentials: true }) // tipo acciones
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
  },

  sendMail({ commit }, datos) {
    /*
      to:
      from: edicom@edicom.es
      subject:
      text:
    */
    axiosInstance.post(`bd_jpersonal.asp?action=services/sendmail&auth=${login.state.user.auth}`, querystring.stringify(datos), headerFormData)
    .then((response) => {
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
