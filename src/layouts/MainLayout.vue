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
          <!--q-btn round dense flat color="grey-8" icon="notifications" @click="openForm({ name: 'Acciones', label: 'Acciones' })">
            <q-badge v-if="accionesPendientes>0" color="red" text-color="white" floating >
              {{ accionesPendientes }}
            </q-badge>
            <q-tooltip>Acciones Pendientes</q-tooltip>
          </q-btn-->
          <q-btn round flat class="bg-red-9 text-weight-light">
            <q-avatar size="40px">
              {{ user.user.email.substr(0,2) }}
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu auto-close :offset="[110, 0]">
              <q-card>
                <q-card-section>
                  <div class="row">
                    <div class="col-4">
                      <q-avatar round flat size="80px" class="bg-red-9 text-white text-weight-light">
                        {{ user.user.email.substr(0,2).toUpperCase() }}
                      </q-avatar>
                    </div>
                    <div class="col">
                      <div class="text-weight-bold">{{ user.pers.nombre }}</div>
                      <div>{{ user.user.email }}</div>
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
              v-if="link.link.name !== 'cambiosDatos'"
              clickable
              @click.native="openForm(link.link)"
              exact
              class="text-grey-8"  >
              <q-item-section v-if="link.icon" avatar>
                <q-icon :name="link.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ link.title }}</q-item-label>
                <q-item-label v-if="link.caption">{{ link.caption }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item 
              v-else 
              class="text-grey-8"
              icon="group_add"
              label="Solicitar Cambios Personales"
              switch-toggle-right-side dense-toggle 
            >
              <q-item
                clickable 
                @click.native="openFormCambiosPersonales(1)" 
                exact 
                :header-inset-level="1"
                class="text-grey-8">
                  <q-item-section>
                    <q-icon name="schedule" />
                  </q-item-section>
                  Cambio Horario
              </q-item>
              <q-item
                clickable 
                @click.native="openFormCambiosPersonales(2)" 
                exact 
                :header-inset-level="1"
                class="text-grey-8">
                <q-item-section>
                    <q-icon name="headset_mic" />
                  </q-item-section>
                  Teletrabajo
              </q-item>
              <q-item
                clickable 
                @click.native="openFormCambiosPersonales(3)" 
                exact 
                :header-inset-level="2"
                class="text-grey-8">
                <q-item-section>
                    <q-icon name="edit" />
                  </q-item-section>
                  Otros Cambios
              </q-item>
            </q-expansion-item>
          </div>
        </q-list>
      </q-scroll-area>
      <q-img v-if="!miniState" class="absolute-top" src="~assets/logo-edicom.png" />
      <q-img v-if="miniState" class="absolute-top" src="~assets/logo-ed1.png" />
    </q-drawer>
    <q-footer>
      <!-- podemos poner tabs en el pie para dispositivos moviles pero quita pantalla y no me gusta
      <q-tabs>
        <q-route-tab v-for="link in menuItems"
          :key="link.title"
          :icon="link.icon"
          :label="link.title"
          :to="link.link"
          exact />
      </q-tabs> -->
    </q-footer>

    <q-page-container>
      <router-view  @contadorAcciones="(value) => accionesPendientes = value"/>
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
          title: 'Consultar Datos',
          icon: 'group',
          link: {
            name: 'personalMain',
            label: 'Consultar Datos'
          }
        },
        {
          title: 'Solicitar Cambios Datos',
          icon: 'group',
          link: {
            name: 'cambiosDatos',
            label: 'Solicitar Cambios Datos'
          }
        },
        {
          title: 'Consultar Cambios Personales',
          icon: 'group',
          link: {
            name: 'consultarCambios',
            label: 'Consultar Cambios Personales'
          }
        },
        {
          title: 'Clientes',
          icon: 'list',
          link: {
            name: 'clientesMain',
            label: 'Clientes'
          }
        },
        {
          title: 'Dashboard',
          icon: 'dashboard',
          link: {
            name: 'dashboardMain',
            label: 'Dashboard'
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
          title: 'Aprobación de cambios-permisos',
          icon: 'how_to_reg',
          link: {
            name: 'aprobacionMain',
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
      this.addTab([link.name, link.label, {}, 1])
    },
    openFormCambiosPersonales (id) {
      if(id === 1) {
        var link = {
          name: 'cambioHorario',
          label: 'Cambio Horario'
        }
        this.addTab([link.name, link.label, {}, 1])
      } else if(id === 2) {
        var link = {
          name: 'teletrabajo',
          label: 'Teletrabajo'
        }
        this.addTab([link.name, link.label, {}, 1])
      } else if(id === 3) {
        var link = {
          name: 'otrosCambios',
          label: 'Otros Cambios'
        }
        this.addTab([link.name, link.label, {}, 1])
      }
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
