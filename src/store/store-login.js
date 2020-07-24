// en los stores no se ha cargado todavía this.$axios con nuestra configuracion de boot/axios.js, por eso
// lo importo y uso la variable especifica exportada en ese modulo axiosInstance
/* OJO. REQUIEREINSTALACION DE:
  npm install querystring

  Guardo los datos de login en localstorage, es necesario instalar 'Localstorage' PlugIn en quasar.conf.js
*/
import { axiosInstance, headerFormData } from 'boot/axios.js' // headerFormData
import querystring from 'querystring'
import { LocalStorage, Loading } from 'quasar'
// state: accesibles en lectura desde componentes a traves de ...mapState('login', ['user'])
const state = {
  loggingIn: false,
  loginError: null,
  loginSuccessful: false,
  user: {}, // { codEmpresa, nomEmpresa, user: {email, idPersonal }, pers: { id, codEmpresa, nombre, nombreAbreviado, email }}
  token: {}, // access_token, expires_in (en segundos), id_token, refresh_token, scope, token_type: "Bearer"
  screen: ''
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
  },
  esTMoPM: (state, res) => {
    state.user.esTMoPM = (res === 1 ? true : false)
  },
  esSuperUsuarioPersonal: (state, res) => { 
    if(res === 1) state.user.esSuperUsuarioPersonal = true
    else state.user.esSuperUsuarioPersonal = false
  },
  esUsuarioPersonal: (state, res) => { 
    if(state.user.esSuperUsuarioPersonal) state.user.esUsuarioPersonal = true
    else state.user.esUsuarioPersonal = (res === 1 ? true : false)
  },
  esUsuarioResponsable: (state, res) => { 
    state.user.esUsuarioResponsable = (res === 1 ? true : false)
  },
  setScreen(state, screen) {
    state.screen = screen
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
        if(!response.data.id) { throw new Error("Credenciales incorrectas")}
        commit('setUser', { codEmpresa: loginData.codEmpresa, nomEmpresa: loginData.nomEmpresa, auth: loginData.auth, pers: response.data }) // llamo a mutation->setUser, en user tengo el login y en pers los datos personales
        LocalStorage.set('email', loginData.email)
        LocalStorage.set('password', loginData.password)
        
        //Aquí cargaremos datos globales a la app
        Loading.show()
        this.dispatch('tablasAux/loadTablasAux')
        this.dispatch('empleados/loadListaEmpleados')
        this.dispatch('empleados/loadListaEmpleadosRestringido')
        this.dispatch('empleados/loadListaPaises')
        this.dispatch('login/esTMoPM')
        this.dispatch('login/esUsuarioPersonaltmp', 24).then(res => { 
          commit('esSuperUsuarioPersonal', res.data)
          this.dispatch('login/esUsuarioPersonaltmp', 21).then(res => { 
            commit('esUsuarioPersonal', res.data)
          })
        })
        this.dispatch('login/esUsuarioResponsable')

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
  },

  esTMoPM({ commit }){
    axiosInstance.post(`bd_jpersonal.asp?action=equiposETM/esTMoPM&auth=${state.user.auth}`, querystring.stringify({ idpersonal: state.user.pers.idpersonal }), headerFormData )
      .then((response) => {
        commit('esTMoPM', JSON.parse(response.data).resultado)
      })
      .catch(error => {
        console.log('esTMoPM', response.data)
      })
  },

  esUsuarioPersonaltmp({ commit }, tabla){
    return axiosInstance.post(`bd_jpersonal.asp?action=tablaAuxiliar/existe&auth=${state.user.auth}`, querystring.stringify({ idpersonal: state.user.pers.idpersonal, idtabla: tabla }), headerFormData )
  },
  
  esUsuarioResponsable({ commit }){
    axiosInstance.post(`bd_jpersonal.asp?action=tablaAuxiliar/15&auth=${state.user.auth}`, querystring.stringify({ idpersonal: state.user.pers.idpersonal }), headerFormData )
      .then((response) => {
        if(response.data === 0) { 
          axiosInstance.post(`bd_jpersonal.asp?action=areaspersonal/count&auth=${state.user.auth}`, querystring.stringify({ idpersonal: state.user.pers.idpersonal }), headerFormData )
            .then((response) => {
              commit('esUsuarioResponsable', JSON.parse(response.data).resultado)
            })
            .catch(error => {
              console.log('esUsuarioResponsable', response.data)
            })
        } else { 
          commit('esUsuarioResponsable', 1) 
        }
      })
      .catch(error => {
        console.log('esUsuarioResponsable', response.data)
      })
  },

  setScreen({ commit }, screen) {
    commit('setScreen', screen)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
