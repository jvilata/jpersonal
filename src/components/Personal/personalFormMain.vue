<template>
  <div :class="screen">
    <q-card>
      <q-card-section   class="q-pa-xs">
            <q-item class="q-pa-xs bg-indigo-1 text-grey-8">
              <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
              <q-item-section avatar>
                <q-btn icon="more_vert" flat>
                  <q-menu>
                    <q-list dense>
                      <q-item 
                        v-for="(cambio, index) in cambios"
                        :key="index"
                        :to="{ name: cambio.link.name, params: { id: id, value: value } }"
                        clickable 
                        v-close-popup
                        @click.native="openForm(cambio.link)"
                        >
                        <q-item-section>{{cambio.title}}</q-item-section>
                      </q-item>  
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">
                  {{ user.pers.nombre }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                @click="$emit('close')"
                flat
                round
                dense
                icon="close"/>
              </q-item-section>
            </q-item>
      </q-card-section>
    </q-card>
    <q-tab-panels v-model="ltab" animated >
      <q-tab-panel v-for="(tab, index) in menuItems" :key="index" :name="tab.link.name"  class="q-pa-none">
        <router-view @close="$emit('close')" @ok="showDone"/>
      </q-tab-panel>
    </q-tab-panels>
  
    <q-tabs 
      v-model="ltab" 
      dense
      class="absolute-bottom bg-primary text-blue-grey-2"
      active-color="white"
      indicator-color="white"
      narrow-indicator
      align="justify"
      >
        <q-route-tab v-for="(tab,index) in menuItems"
          no-caps
          :key="index"
          :label="tab.title"
          :name="tab.link.name"
          :to="{ name: tab.link.name, params: { id: id, value: value } }"
          exact>
        </q-route-tab>
    </q-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['value', 'id', 'keyValue'], // se pasan como parametro desde mainTabs. value = { registrosSeleccionados: [], filterRecord: {} }
  data () {
    return {
      ltab: '',
      done: false,
      title: 'Personal',
      cambios: [
        {
          title: 'Cambiar Horario',
          link: { 
            name: 'cambioHorario',
            label: 'Cambio Horario'
          }
        },
        {
          title: 'Teletrabajo',
          link: { 
            name: 'teletrabajo',
            label: 'Teletrabajo'
          }
        },
        {
          title: 'Otros Cambios',
          link: { 
            name: 'otrosCambios',
            label: 'Otros Cambios'
          }
        },
      ],
      menuItems: [
        {
          title: 'Datos Empleado',
          link: { name: 'personalForm' }
        },
        {
          title: 'Datos Contractuales',
          link: { name: 'personalContract' }
        },
        {
          title: 'Datos Contacto',
          link: { name: 'personalContact' }
        },
        {
          title: 'Horario',
          link: { name: 'personalSchedule' }
        },
        {
          title: 'Teletrabajo',
          link: { name: 'personalTeletrabajo' }
        },
        {
          title: 'Competencias adquiridas',
          link: { name: 'personalCompetences' }
        }

      ]
    }
  },
  computed: {
    ...mapState('login', ['user', 'screen'])
  },
  methods: {
    ...mapActions('tabs', ['addTab']),
    openForm (link) {
      this.addTab([link.name, link.label, {}, this.id])
    },
    showDone() {
      this.done = true
      this.timer = setTimeout(() => {
        this.done = false
      }, 800)
    }
  },
  mounted () {
    this.$router.replace({ name: this.menuItems[0].link.name, params: { id: this.id, value: this.value } })
  }
}
</script>

<style lang="scss">
  
  .fullScreen {
    height: calc(100vh - 184px);
    overflow: hidden; 
  }

  .sqScreen {
    height: calc(100vh - 127px);
    overflow: hidden; 
  }

  .android {
    height: calc(100vh - 105px);
    overflow: hidden; 
  }

</style>
