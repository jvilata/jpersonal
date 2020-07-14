// en los stores no se ha cargado todavía this.$axios con nuestra configuracion de boot/axios.js, por eso
// lo importo y uso la variable especifica exportada en ese modulo axiosInstance
/* OJO. REQUIEREINSTALACION DE:
  npm install querystring

  Guardo los datos de login en localstorage, es necesario instalar 'Localstorage' PlugIn en quasar.conf.js
*/
import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import querystring from 'querystring'
import { LocalStorage } from 'quasar'
// state: accesibles en lectura desde componentes a traves de ...mapState('login', ['user'])
const state = {
  loggingIn: false,
  loginError: null,
  loginSuccessful: false,
  user: {}, // { codEmpresa, nomEmpresa, user: {email, idPersonal }, pers: { id, codEmpresa, nombre, nombreAbreviado, email }}
  token: {} // access_token, expires_in (en segundos), id_token, refresh_token, scope, token_type: "Bearer"
}
// mutations: solo están accesibles a las actions a traves de commit, p.e., commit('loginStart')
const mutations = {
  loginStart: state => { state.loggingIn = true },
  loginStop: (state, errorMessage) => {
    state.loggingIn = false
    state.loginError = errorMessage
    state.loginSuccessful = !errorMessage
  },
  setUser: (state, updated) => {
    Object.assign(state.user, updated)
  },
  desconectar: (state) => {
    state.user = {}
  },
  guardarToken: (state, ptoken) => {
    Object.assign(state.token, ptoken)
  }
}
// actions: accesibles desde componentes a traves de ...mapActions('login', ['doLogin'])
const actions = {
  doLogin ({ commit }, loginData) {
    commit('loginStart')
    loginData.auth = btoa(loginData.email + ':' + loginData.password) // token auth basica
    loginData.password = btoa(loginData.password) // base64
    axiosInstance.get(`bd_jpersonal.asp?action=cpersonal_of/logon&auth=${loginData.auth}`, { params: {} }, { withCredentials: true })
      .then((response) => {
        commit('setUser', { codEmpresa: loginData.codEmpresa, nomEmpresa: loginData.nomEmpresa, auth: loginData.auth, pers: response.data }) // llamo a mutation->setUser, en user tengo el login y en pers los datos personales
        LocalStorage.set('email', loginData.email)
        LocalStorage.set('password', loginData.password)
        // this.dispatch('tabs/addTab', ['Acciones', 'Acciones', {}, 1], { root: true }) // llamo a la action->addTab del store->tabs y param: ['acciones','acciones',{},1]
        //Aquí cargaremos datos globales a la app
        this.dispatch('tablasAux/loadTablasAux')
        this.dispatch('empleados/loadListaEmpleados')
        this.dispatch('empleados/loadListaPaises')

        this.$router.push('/sinTabs')
      })
      .catch(error => {
        commit('loginStop', error) // .response.data.error
      })
  },
  
  desconectarLogin ({ commit }) {
    // cerramos todos los tabs y redirigimos al login
    this.dispatch('tabs/removeAllTabs', [], { root: true })
    commit('loginStop', 'Introduzca credenciales')
    commit('desconectar')
    this.$router.push('/')
  },
  guardarToken ({ commit }, ptoken) {
    commit('guardarToken', ptoken)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
