<template>
  <q-page padding class="row justify-center" style="padding-top: 100px">
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
    <!-- <v-bottom-navigation v-if="showAppInstallBanner && isMobile" style="width: 100%;">
     <q-banner class="bg-primary text-white">
            Obtén nuestra aplicación
            <template v-slot:action>
                <q-btn
                  flat
                  @click="installApp"
                  label="Instalar"
                  class="q-px-sm"
                  dense />
            </template>
        </q-banner>
    </v-bottom-navigation> -->
    <div v-if="showAppInstallBanner && isMobile" style="width: 100%;bottom: 0;position: fixed;">
        <q-banner class="bg-primary text-white">
            Obtén nuestra aplicación
            <template v-slot:action>
                <q-btn
                  flat
                  @click="installApp"
                  label="Instalar"
                  class="q-px-sm"
                  dense />
            </template>
        </q-banner>
    </div>
    <q-dialog v-model="showDialogInstallIOs" full-width>
      <q-card class="q-pa-md" style="border-radius: 17px">
          <div class="text-h6">Intstalar aplicación</div>
          <div>Sigue los siguientes pasos para instalar la aplicación en tu móvil</div>
          <div>
            <ol>
              <li>Haz click en <img width="17" height="17" style = "margin-bottom: -2px;" src="~assets/icon_share.png"></li>
              <li>Selecciona la opción añadir a la pantalla de inicio</li>
            </ol>
          </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
let deferredPrompt
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      disableLogin: false,
      showAppInstallBanner: false,
      isMobile: false,
      isAndroid: false,
      showDialogInstallIOs: false,
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
    },
    installApp() {
      this.showAppInstallBanner = false;
      
      if(this.isAndroid){
        deferredPrompt.prompt()
      }else{
        this.showDialogInstallIOs = true
      }
    }
  },

  mounted () {
    // Comprobamos si es un movil.
    this.isMobile = /iPhone|iPad|Pod|Android/i.test(navigator.userAgent) && window.cordova === undefined;
    this.isAndroid = /Android/i.test(navigator.userAgent)
  
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showAppInstallBanner = true
    });
    document.addEventListener('deviceready', this.onDeviceReady, false)
    
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
