<template>
<div style="height: 80vh">
      <q-item clickable v-ripple class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
          <q-icon name="fas fa-filter" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
             {{ nomFormulario }} {{ '#J-'+value.code +'#' }}
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
    <q-item class="row q-ma-xs q-pa-xs">
       
        <q-table
        dense
        class="personalGrid-header-table"
        virtual-scroll
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="listaJustificantes.name"
        :data="listaJustificantes"
        :columns="columns"
        table-style="max-height: 65vh; max-width: 96vw"
        >
        
        <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="11px" flat color="primary" dense icon="cloud_download" @click="abrirURL(props.row)" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        
      </template>

        <template v-slot:bottom>
            <div>
            {{ listaJustificantes.length }} Filas
            </div>
        </template> 

        </q-table> 
    </q-item>

    <q-dialog v-model="expanded"  >
      <q-card style="width: 100vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h7 text-primary">{{ datosImagen.id}}</div>
          <q-space />
          <q-btn flat icon="close" color="primary" @click="expanded = false"/>
        </q-card-section>
        <q-card-section>
          <q-img :src="datosImagen.data"  />
        </q-card-section>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date, openURL } from 'quasar'
import { urlBase } from 'boot/axios.js' // headerFormData

export default {
  props: ['value'],
  data () {
    return {
      nomFormulario: 'Justificantes',
      expanded: false,
      datosImagen: {
        id: 0,
        data: null
      },
      rowId: '',
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id' },
        { name: 'subject', align: 'left', label: 'Asunto', field: 'subject', sortable: true, style: 'min-width: 20px, whiteSpace: normal' },
        { name: 'attachtype', align: 'left', label: 'Tipo', field: 'attachtype' },
        { name: 'attach', label: 'Ubicación', align: 'left', field: 'attach', sortable: true, style: 'width: 20px' },
        { name: 'dates', label: 'Ajuntado', align: 'left', field: 'ts', sortable: true, style: 'width: 20px', format: val => ((val !== null) ? date.formatDate(date.extractDate(val,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY'): '') },
        { name: 'ts', align: 'left', label: 'Modificado', field: 'ts', sortable: true, style: 'width: 130px', format: val => ((val !== null) ? date.formatDate(date.extractDate(val,'YYYY-MM-DDTHH:mm'), 'DD/MM/YYYY'): '') }
      ],
      pagination: { rowsPerPage: 0 }
    } 
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user']),
    ...mapState('tabs', ['tabs']),
    ...mapState('permisos', ['listaJustificantes'])
  },
  methods: { 
      ...mapActions('permisos', ['getJustificantes']),
      abrirURL (justificante) {
        var strUrl = urlBase + `bd_jpersonal.asp?action=attach/${justificante.id}&auth=${this.user.auth}`
        this.$axios.get(strUrl)
          .then(response => {
            if (response.headers['content-type']==='application/jpeg') {
              this.datosImagen.id = justificante.attach
              this.datosImagen.data = strUrl
              this.expanded = true
            } else {
              if (window.cordova === undefined) { // desktop
                openURL(strUrl)
              } else { // estamos en un disp movil
                document.addEventListener('deviceready', () => {
                  window.cordova.InAppBrowser.open(strUrl, '_system') // openURL
                }, false)
              }
            }
          })
      }    
  },
  mounted() { 
      this.getJustificantes(this.value)
  }
}

</script>
<style lang="sass">
  .personalGrid-header-table
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
      /* bg color is important for th; just specify one */
      background-color: $indigo-1

    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0

    /* this is when the loading indicator appears */
    &.q-table--loading thead tr:last-child th
      /* height of all previous header rows */
      top: 48px
</style>