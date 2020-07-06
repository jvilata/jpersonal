<template>
  <div style="height: 85vh">
    <q-item class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
      <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
      <q-item-section avatar class="q-ml-sm">
        <q-icon name="note_add" size="md"/>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">
          {{ nomFormulario }}
        </q-item-label>
        <q-item-label >
            <small @click="verNormativa"><u>Normativa de permisos y vacaciones</u></small>
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

    <q-tab-panels v-model="ltab" animated >
      <q-tab-panel v-for="(tab, index) in menuItems" :key="index" :name="tab.link.name"  class="q-pa-none">
        <router-view @close="$emit('close')"/>
      </q-tab-panel>
    </q-tab-panels>
    <!-- podemos poner tabs en el pie para dispositivos moviles pero quita pantalla y no me gusta bg-primary text-white -->
    <q-tabs 
      v-model="ltab" 
      dense
      active-color="white"
      indicator-color="white"
      align="justify"
      narrow-indicator
      class="absolute-bottom bg-primary text-blue-grey-2">
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
import { mapState } from "vuex";
import { openURL } from "quasar";

export default {
  props: ['value', 'id', 'keyValue'],
  data() {
    return {
      nomFormulario: 'Solicitud de permisos',
      nuevoPermiso: false,
      ltab: '',
      menuItems: [
        {
          title: 'Permisos pendientes',
          link: { name: 'permisosPendientes' }
        },
        {
          title: 'Permisos concedidos',
          link: { name: 'permisosConcedidos' }
        }
      ]
    }
  },
  computed: {
    ...mapState('permisos', ['permisosPendientes', 'permisosConcedidos'])
  },
  methods: {
    verNormativa() {
      // Instalar inAppBrowser para ios
      openURL('http://www.edicomgroup.com')
    }
  },
    mounted () {
      this.$router.replace({ name: this.menuItems[0].link.name, params: { id: this.id, value: this.value } })
    } 
}
</script>