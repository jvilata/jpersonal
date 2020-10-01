<template>
  <q-page padding class="row q-pa-xl justify-center" style="padding-top: 100px">
    <!-- definimos una pagina de LOGIN que tiene un logo arriba y un formulario de empresa, usu y pass abajo -->
    <div :class="`gutter-sm ${user.platform}`">
      <div class="row justify-center q-pa-lg">
        <q-img src="~assets/logo-edicom.png" style="width: 40vh"/>
      </div>
      <q-card>
        <div class="text-subtitle2 q-pt-md q-pl-md">Identificación de usuario</div>
        <form class="q-pa-md" @submit.prevent="loginSubmit">
            <q-select name="codEmpresa" autocomplete="on" label="Empresa"
              v-model="user.codEmpresa"
              :options="listaEmpresas"
              option-value="codElemento"
              option-label="valor1"
              emit-value
              map-options
            />
            <q-input name="email" v-model="user.email" label="Usuario" type="text" style="font-size: 16px"/>
            <q-input name="password" autocomplete="password" v-model="user.password" type="password" label="Password" style="font-size: 16px"/>
            <div class="row justify-center q-pa-md">
              <q-btn :disable="disableLogin" type="submit" rounded color="primary" class="full-width" label="Entrar"/>
            </div>
            <p v-if="loggingIn">Cargando...</p>
            <p v-if="loginError">{{ loginError }}</p>
            <p v-if="loginSuccessful">Login Successful</p>
          </form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      disableLogin: false,
      user: {
        codEmpresa: '01',
        email: '',
        password: '',
        platform: '',
      }
    }
  },
  computed: {
    // accedo a VUEX al store/store-login a estos states y aqui los puedo usar como si fueran variables locales
    ...mapState('login', [
      'loggingIn',
      'loginError',
      'loginSuccessful'
    ]),
    ...mapState('tablasAux', ['listaEmpresas'])
  },
  methods: {
    // accedo a VUEX al store/store-login a la action doLogin y aqui la podemos invocar como this.doLogin
    ...mapActions('login', ['doLogin']),
    ...mapActions('tablasAux', ['loadTablasAux']),
    cambioDisableLogin() {
      this.disableLogin = false
    },
    loginSubmit () {
      this.disableLogin = true
      this.user.nomEmpresa = this.listaEmpresas.find(emp => emp.codElemento === this.user.codEmpresa).valor1 // nombre de empresa
      this.doLogin(this.user) // para validar con bd propia
      setTimeout(this.cambioDisableLogin, 10000)
    },
    onDeviceReady() {
      this.user.platform = device.platform
    }
  },
  mounted () {
    document.addEventListener('deviceready', this.onDeviceReady, false)

    // this.loadTablasAux()
    this.user.email = this.$q.localStorage.getItem('email')
    this.user.password = (this.$q.localStorage.getItem('password')) // from base64 to string
  }
}
</script>

<style>

.iOS {
  max-width: 100vw;
}


</style>
