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
  user: {}, // { codEmpresa, nomEmpresa, user: { id, codEmpresa, email, username, idPersonal }, pers: { id, codEmpresa, nombre, nombreAbreviado, email }}
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
    if (loginData.firebaseToken) commit('guardarToken', loginData.firebaseToken) // si viene de firebase tendremos token
    // para esta llamada al backend es necesario pasar los parametros en formato formData (campos de formulario)
    // tenemos que convertir los atributos del objeto loginData a campos (fields) de un formData
    if (!loginData.action) loginData.action = 'login' // añadimos el atributo action que espera el backend si no lo tiene
    loginData.password = btoa(loginData.password) // base64
    axiosInstance.post('login.asp', querystring.stringify(loginData), headerFormData)
      .then((response) => {
        // const str = response.data.replace(/'/g, '"') // el JSON que devuelve no es correcto porque es con comillas simples y hay que pasarlo a dobles
        const user = response.data //Devuelve el nombre de usuario (user.login)
        if (user.failure) {
          throw new Error('Credenciales incorrectas. Inténtelo de nuevo')
        } else {
          // si el usuario existe, busco sus datos personales
          axiosInstance.get('bd_personal.asp?action=findPersonal', { params: { login: user.login } })
            .then((response) => {
              if (response.data.failure) throw new Error(response.data.failure)
              if (response.data.length === 0) {
                throw new Error('No existe persona asociada al usuario. Inténtelo de nuevo')
              } else {
                user.email = response.data[0].email
                commit('setUser', { codEmpresa: loginData.codEmpresa, nomEmpresa: loginData.nomEmpresa, user: user, pers: response.data[0] }) // llamo a mutation->setUser, en user tengo el login y en pers los datos personales
                LocalStorage.set('email', loginData.email)
                LocalStorage.set('password', loginData.password)
                // this.dispatch('tabs/addTab', ['Acciones', 'Acciones', {}, 1], { root: true }) // llamo a la action->addTab del store->tabs y param: ['acciones','acciones',{},1]
                this.$router.push('/sinTabs')
              }
            })
            .catch(error => {
              commit('loginStop', error) // .response.data.error
            })
        }
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
