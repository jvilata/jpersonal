<template>
  <q-layout view="lHh lpR fFf" :class="`shadow-2 rounded-borders ${screen}`">
    <q-header elevated >
      <q-toolbar>
        <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
        <div class="items-center no-wrap absolute-center">
          <div class="text-subtitle1">{{ nomAplicacion }}</div>
          <div class="text-caption">{{ user.nomEmpresa }}</div>
        </div>
        <div class="q-gutter-sm q-pr-md row items-center no-wrap absolute-right">
          <q-btn round dense flat color="grey-8" icon="notifications" @click="openForm({ name: 'permisosMain', label: 'Solicitud de permisos' })">
            <q-badge v-if="justPorPresentar>0" color="red" text-color="white" floating >
              {{ justPorPresentar }}
            </q-badge>
            <q-tooltip>Justificantes Pendientes</q-tooltip>
          </q-btn>
          <q-btn round flat class="bg-red-9 text-weight-light">
            <q-avatar size="40px">
              {{ user.pers.email ? user.pers.email.substring(0,2) : '' }}
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu auto-close :offset="[110, 0]">
              <q-card>
                <q-card-section>
                  <div class="row">
                    <div class="col-4">
                      <q-avatar round flat size="80px" class="bg-red-9 text-white text-weight-light">
                        {{ user.pers.email ? user.pers.email.substring(0,2).toUpperCase() : ''}}
                      </q-avatar>
                    </div>
                    <div class="col">
                      <div class="text-weight-bold">{{ user.pers.nombre }}</div>
                      <div>{{ user.pers.email }}</div>
                      <q-btn flat class="text-weight-light" color="primary" @click="desconectar">Desconectar</q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen"
        show-if-above bordered
        content-class="bg-grey-3"
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        :breakpoint="767"
        :width="220">
      <q-scroll-area style="height: calc(100vh - 170px); margin-top: 100px; border-right: 1px solid #ddd">
        <q-list>
          <div v-for="(link, index) in menuItemsFilter" :key="index">
            <q-item 
              clickable
              @click.native="openForm(link.link)"
              exact
              class="text-grey-8"  >
               <!--Todos los campos son visibles por Los usuarios excepto el de APROBACION - mounted-->
              <q-item-section v-if="link.icon" avatar> <!--Iconos del DRAWER -->
                <q-icon :name="link.icon"  v-if="link.title " />  
              </q-item-section>

              <q-item-section><!--Títulos del DRAWER -->
                <q-item-label v-if="link.title">{{ link.title  }}</q-item-label>
                <q-item-label v-if="link.caption">{{ link.caption }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          
        </q-list>
      </q-scroll-area>
       <!-- div clickable @click="emailUs()" class="text-caption absolute-bottom text-grey-8 q-pb-xl q-pl-md">
        appstore@edicomgroup.com
      </div -->

      <q-img v-if="!miniState" class="absolute-top" src="~assets/logo-edicom.png" :style="screen==='fullScreen' ? 'margin-top:35px' :screen==='sqScreen' ? 'margin-top:20px' : ''"/>
      <q-img v-if="miniState" class="absolute-top" src="~assets/logo-ed1.png" :style="screen==='fullScreen' ? 'margin-top:35px' :screen==='sqScreen' ? 'margin-top:20px' : ''"/>
    </q-drawer>
    <q-footer>
    </q-footer>

    <q-page-container>
      <router-view  @contadorAcciones="(value) => accionesPendientes = value" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MainLayout',

  data () {
    return {
      nomAplicacion: 'EDICOM Mobile',
      accionesPendientes: 0,
      leftDrawerOpen: false,
      miniState: false,
      screen: 'sqScreen',
      menuItems: [ 
        {
          title: 'Consultar/Modificar Datos',
          icon: 'group',
          link: {
            name: 'personalFormMain',
            opcion: 1,
            label: 'Consultar Datos'
          }
        },
        {
          title: 'Solicitud de permisos',
          icon: 'note_add',
          link: {
            name: 'permisosMain',
            opcion: 1,
            label: 'Solicitud de permisos'
          }
        },
        {
          title: 'Buscar Empleado',
          icon: 'search',
          link: {
            name: 'personalMain',
            opcion: 1,
            label: 'Buscar Empleado'
          }
        },
        {
          title: 'Consultar cambios-permisos',
          icon: 'assignment',
          link: {
            name: 'aprobacionMain',
            opcion: 1,
            label: 'Consultar Cambios-Permisos'
          }
        },
        {
          title: 'Aprobación cambios-permisos',
          icon: 'assignment_turned_in',
          link: {
            name: 'aprobacionMain',
            opcion: 2,
            label: 'Aprobación Cambios-Permisos'
          }
        },
        {
          title: 'Consultar Reservas',
          icon: 'screen_search_desktop',
          link: {
            name: 'consReservasMain',
            opcion: 1,
            label: 'Cons.Reservas'
          }
        },
        {
          title: 'Reserva Mesas',
          icon: 'event_seat',
          link: {
            name: 'planosMain',
            opcion: 1,
            label: 'Reserva Mesa'
          }
        },
        {
          title: 'Reserva Padel',
          icon: 'sports_tennis',
          link: {
            name: 'reservaPadelMain',
            opcion: 1,
            label: 'Reserva Padel'
          }
        },
        {
          title: 'Fichajes',
          icon: 'payments',
          link: {
            name: 'fichajesMain',
            opcion: 2,
            label: 'Fichajes'
          }
        },
        {
          title: 'Clientes',
          icon: 'list',
          link: {
            name: 'clientesMain',
            opcion: 3,
            label: 'Clientes'
          }
        },
        {
          title: 'Dashboard',
          icon: 'dashboard',
          link: {
            name: 'dashboardMain',
            opcion: 3,
            label: 'Dashboard'
          }
        },
        {
          title: 'Email Us',
          icon: 'email',
          link: {
            name: 'emailus',
            opcion: 1,
            label: 'Email Us'
          }
        }
        /* {
          title: 'Carga Tele',
          icon: 'dashboard',
          link: {
            name: 'cargaTele',
            opcion: 3,
            label: 'Carga Tele'
          }
        } */
      ]
    }
  },
  computed: {
    ...mapState('login', ['user']),
    ...mapState('permisos', ['justPorPresentar']),
    menuItemsFilter () {
      var arr = []
      this.menuItems.forEach(element => {
          if (element.link.opcion === 1) arr.push(element) // no es nada, solo opcion 1
          if (element.link.opcion === 2 && (this.user.esTMoPM===true || this.user.esUsuarioResponsable===true || this.user.esUsuarioPersonal===true)) {
            // console.log(element)
            arr.push(element) // a los demás pueden ver opcion 2
          }
          if (element.link.opcion === 3 && this.user.esUsuarioResponsable === true) arr.push(element) // si además es un responsable puede verlo todo
      })
      return arr
    }
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    ...mapActions('login', ['desconectarLogin', 'setScreen']),
    ...mapActions('permisos', ['getPermisosConcedidos']),
    openForm (link) {
      if (link.name === 'emailus') {
        this.emailUs()
      } else {
        this.addTab([link.name, link.label, {}, link.opcion ? link.opcion : 1])
      }
    },
    emailUs() {
      window.location.href='mailto:appstore@edicomgroup.com?subject=Informacion JPersonal App'
    },
    desconectar () {
      this.desconectarLogin()
    },
    onDeviceReady() {
      this.screen = 'sqScreen'
      if (device.manufacturer === "Apple") {
        if (device.model.includes('e')) { //Diferenciar iPhone de iPad
          let appleModel = parseFloat((device.model.split("e"))[1].replace(",", "."))
          if ((appleModel >= 10.6 || appleModel === 10.2) && appleModel !== 12.8) {
            //iPhone con pantalla completa (tipo X)
            this.screen = 'fullScreen'
          }
        }
      } else {
         //Android
          this.screen = 'android'
      }
      this.setScreen(this.screen)
    }
  },
  mounted() {
    /* if (this.user.esTMoPM===false && this.user.esUsuarioResponsable===false && this.user.esUsuarioPersonal===false) { 
      var i = this.menuItems.findIndex(opc => opc.link.name === 'aprobacionMain' && opc.link.opcion === 2) 
      this.menuItems.splice(i,1) //splice(i,1) para eliminar elem de Aprobacion cuando no tenga permisos para aprobar
    } */
    document.addEventListener('deviceready', this.onDeviceReady, false)
    var objFilter = { solIdEmpleado: this.user.pers.id, solejercicio: (new Date()).getFullYear() }
    this.getPermisosConcedidos(objFilter)
  }
}
</script>

<style lang="scss">
  @media screen and (min-width: 768px) {
    .q-footer {
      display: none;
    }
  }
.q-header {
  padding-top: 20px;
}

.fullScreen {
  .q-footer {
    padding-bottom: 33px; 
  }
}

  .q-drawer .q-router-link--exact-active {
    color: white !important;
  }
</style>
