<template>
  <q-layout view="lHh lpR fFf" class="shadow-2 rounded-borders">
    <q-header elevated >
      <q-toolbar>
        <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
        <div class="items-center no-wrap absolute-center">
          <div class="text-subtitle1">{{ nomAplicacion }}</div>
          <div class="text-caption">{{ user.nomEmpresa }}</div>
        </div>
        <div class="q-gutter-sm q-pr-md row items-center no-wrap absolute-right">
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
          <div v-for="link in menuItems" :key="link.title">
            <q-item 
              clickable
              @click.native="openForm(link.link)"
              exact
              class="text-grey-8"  >
              <q-item-section v-if="link.icon" avatar>
                <q-icon :name="link.icon"  v-if="link.title !== 'Aprobación de cambios-permisos'" />
                <q-icon :name="link.icon"  v-if="link.title === 'Aprobación de cambios-permisos' && (user.esTMoPM || user.esUsuarioResponsable || user.esUsuarioPersonal) " />
              </q-item-section>

              <q-item-section>
                <q-item-label v-if="link.title !== 'Aprobación de cambios-permisos'">{{ link.title  }}</q-item-label>
                <q-item-label v-if="link.title === 'Aprobación de cambios-permisos'">{{ (user.esTMoPM || user.esUsuarioResponsable || user.esUsuarioPersonal ? `${link.title}` : '')  }}</q-item-label>
                <q-item-label v-if="link.caption">{{ link.caption }}</q-item-label>
                <q-item-label v-if="link.title === 'Aprobación de cambios-permisos'">{{ (user.esTMoPM || user.esUsuarioResponsable || user.esUsuarioPersonal ? `${link.caption}` : '')  }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-scroll-area>
      <q-img v-if="!miniState" class="absolute-top" src="~assets/logo-edicom.png" />
      <q-img v-if="miniState" class="absolute-top" src="~assets/logo-ed1.png" />
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
      menuItems: [
        {
          title: 'Consultar/Modificar Datos',
          icon: 'group',
          link: {
            name: 'personalFormMain',
            label: 'Consultar Datos'
          }
        },
        {
          title: 'Solicitud de permisos',
          icon: 'note_add',
          link: {
            name: 'permisosMain',
            label: 'Solicitud de permisos'
          }
        },
        {
          title: 'Buscar Empleado',
          icon: 'search',
          link: {
            name: 'personalMain',
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
          title: 'Aprobación de cambios-permisos',
          icon: 'assignment_turned_in',
          link: {
            name: 'aprobacionMain',
            opcion: 2,
            label: 'Aprobación Cambios-Permisos'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    ...mapActions('login', ['desconectarLogin']),
    openForm (link) {
      this.addTab([link.name, link.label, {}, link.opcion ? link.opcion : 1])
    },
    desconectar () {
      this.desconectarLogin()
    }
  }
}
</script>

<style lang="scss">
  @media screen and (min-width: 768px) {
    .q-footer {
      display: none;
    }
  }

  .platform-ios {
    .q-header {
    padding-top: constant(safe-area-inset-top); // for iOS 11.0
    padding-top: env(safe-area-inset-top); // for iOS 11.2 +
    }
    .q-footer {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    }
  }

  .q-drawer .q-router-link--exact-active {
    color: white !important;
  }
</style>
