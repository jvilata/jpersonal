<template>
  <q-item class="row q-ma-md q-pa-xs">
    <!-- GRID. en row-key ponemos la columna del json que sea la id unica de la fila -->
    <q-table
      virtual-scroll
      :dense="$q.screen.lt.md"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      :data="value"
      :columns="columns"
      title="Acompañantes"
      no-data-label="Próximamente podrás añadir acompañantes."
      table-style="max-height: 55vh; max-width: 90vw"
    >
      <!-- TOP DE LA TABLA-->
      <template v-slot:header="props">
        <!-- CABECERA DE LA TABLA -->
        <q-tr :props="props">
          <q-th></q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
          <div :style="col.style">
            {{ col.label }}
          </div>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.id}`" @mouseover="rowId=`m_${props.row.id}`">
           <q-td>
            <!-- columna de acciones: editar, borrar, etc -->
            <div style="max-width: 70px">
            <!--edit icon . Decomentamos si necesitamos accion especifica de edicion -->
            <q-btn flat
              @click.stop="doEditPartner(props.row)"
              v-if="false"
              round
              dense
              size="sm"
              color="primary"
              icon="edit">
              <q-tooltip>Editar Acompñanante</q-tooltip>
            </q-btn>
             <q-btn flat
              @click.stop="doReSendConsentPartner(props.row)"
              v-if="false"
              round
              dense
              color="primary"
              size="sm"
              icon="outgoing_mail">
              <q-tooltip>Reenviar Consentimiento</q-tooltip>
            </q-btn>
             <q-btn flat
              @click.stop="doDeletePartner(props.row)"
              v-if="false"
              round
              dense
              color="red"
              size="sm"
              icon="delete">
              <q-tooltip>Eliminar Acompñanante</q-tooltip>
            </q-btn>
            </div>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div :style="col.style">
              <div v-if="!['consentimiento', 'visita'].includes(col.name)">{{ col.value }}</div>
              <div v-if="col.name==='consentimiento'"><q-checkbox disable v-model="props.row.consentimiento" /></div>
              <div v-if="col.name==='visita'"><q-checkbox v-model="props.row.visita" @input="doAddVisita(props.row)"/></div>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
          <q-space/>
          <q-btn
            @click.stop="doShowPartnerClean"
            v-if="false"
            round
            dense
            color="primary"
            size="20px"
            icon="add">
            <q-tooltip>Añadir Acompñanante</q-tooltip> 
          </q-btn>
          <q-space/>
      </template>
                  <!-- v-if="user.pers.consentimientoClubSocial" -->
      <!-- <template v-slot:no-data>
          <q-space/>
          <q-btn
            v-if="false"
            @click.stop="doShowPartnerClean"
            round
            dense
            color="primary"
            size="20px"
            icon="add">
            <q-tooltip>Añadir Acompñanante</q-tooltip>
          </q-btn>
          <q-space/>
      </template> -->
    </q-table>
    
    <q-dialog v-model="showFormPartner" >
      <q-card class="q-dialog-plugin">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Datos de Acompñanante</div>
        </q-card-section>
        <q-form class="q-pa-sm q-gutter-y-xs">
          <q-input outlined clearable label="Nombre" v-model="formData.nombre" />
          <q-input outlined clearable label="Dni" v-model="formData.dni" />
          <q-input outlined clearable label="E-mail" v-model="formData.email" />
        </q-form>
        <q-card-actions align="right">
          <q-btn color="primary" label="OK" @click="doSubmitPartner" />
          <q-btn color="primary" label="Cancel" @click="showFormPartner=false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-item>
</template>

<script>
import axios, { axiosInstance, headerFormData } from 'src/boot/axios'
import { mapState} from 'vuex'
export default {
  props: ['value'], // en 'value' tenemos los registrosSeleccionados cargados del personalMain (datos de la tabla)
  data () {
    return {
      showFormPartner: false,
      formData: {id: null},
      rowId: '',
      columns: [
        { name: 'nombre', label: 'Nombre', align: 'left',  field: 'nombre', sortable: true},
        { name: 'email', label: 'E-Mail', align: 'left', field: 'email', sortable: true},
        { name: 'dni', label: 'DNI', align: 'left',  field: 'dni', sortable: true},
        { name: 'consentimiento', label: 'Consentimiento', align: 'left', field: 'consentimiento', sortable: true, format: val => val === 'Verdadero' },
        { name: 'visita', label: 'Asiste', align: 'left', field: 'visita', sortable: true, format: val => val === 'Verdadero' }
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('tablasAux', ['listaSINO']),
    ...mapState('login', ['user'])
  },
  methods: {
    doShowPartnerClean(){
      this.formData = {id: null, nombre : null, dni: null, email: null, consentimiento: null, visita: null, idEmpleado: null, ts: null, usr: null}
      this.showFormPartner = true;
    },
    doEditPartner (data){
      this.formData = data;
      this.showFormPartner = true;
    },
    doDeletePartner(data){
      if(data.id == null)
        return this.$q.dialog({title: 'Error', message : 'No existe un id válido'})
      
      this.$q.dialog({
        title: 'Eliminar Acompañante',
        message: '¿Estás seguro de que desea eliminar al acompañante? Se borrarán todos sus datos',
        cancel:{color: 'primary', flat: true}, 
        ok:{label: 'Eliminar', flat: true, color: 'negative'},
        persistent: true
      }).onOk(() =>{
        axiosInstance.get(`bd_jpersonal.asp?http_method=DELETE&action=social/center/partners/form/${data.id}&auth=${this.user.auth}`, {}, headerFormData)
        .then((response) => {
          var obj = response.data;
          // si tenemos un error lo mostramos
          if(!obj.success) return this.$q.dialog({title: 'Error', message : obj.msg});

          this.$q.dialog({title: 'Exito', message : obj.msg});
          this.$emit('getPartnersSocialCenterList', {});
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
      });
    },

    doReSendConsentPartner(data){
      console.log(data);
      // axiosInstance.post(`bd_jpersonal.asp?action=social/center/partners/send/consent/${data.id}&auth=${this.user.auth}`, {}, headerFormData)
      //   .then((response) => {
      //     console.log(response);
      //     var obj = response.data;
      //     // si tenemos un error lo mostramos
      //     if(!obj.success) return this.$q.dialog({title: 'Error', message : obj.msg});

      //     this.$q.dialog({title: 'Exito', message : obj.msg});
      //   })
      //   .catch(error => {
      //     this.$q.dialog({ title: 'Error', message: error })
      // })
    },

    doAddVisita(data){
      axiosInstance.post(`bd_jpersonal.asp?action=social/center/partners/visit/${data.id}&auth=${this.user.auth}`, {visita: data.visita}, headerFormData)
      .then((response) => {
        var obj = response.data;
        // si tenemos un error lo mostramos
        if(!obj.success) return this.$q.dialog({title: 'Error', message : obj.msg});

        this.$q.dialog({title: 'Exito', message : obj.msg});
        this.$emit('getPartnersSocialCenterList', {});
      })
      .catch(error => {
        this.$q.dialog({ title: 'Error', message: error })
        this.$emit('getPartnersSocialCenterList', {});
      })
    },

    // Se llama desde el dialogo
    doSubmitPartner (){
      // Es un partner nuevo 
      if(this.formData.id == null){
        return this.doAddPartner();
      }

      // 
      this.$axios.post(`bd_jpersonal.asp?action=social/center/partners/form/${this.formData.id}&auth=${this.user.auth}`, this.formData, headerFormData)
      .then((response) => {
        var obj = response.data;
        // si tenemos un error lo mostramos
        if(!obj.success) return this.$q.dialog({title: 'Error', message : obj.msg});

        this.$q.dialog({title: 'Exito', message : obj.msg});
        this.showFormPartner = false;
        this.$emit('getPartnersSocialCenterList', {});
      })
      .catch(error => {
        this.$q.dialog({ title: 'Error', message: error })
      })
    },

    // Creamos un nuevo partner
    doAddPartner(){
      axiosInstance.post(`bd_jpersonal.asp?http_method=PUT&action=social/center/partners/form&auth=${this.user.auth}`, this.formData, headerFormData)
      .then((response) => {
        var obj = response.data;
        // si tenemos un error lo mostramos
        if(!obj.success) return this.$q.dialog({title: 'Error', message : obj.msg});

        this.$q.dialog({title: 'Exito', message : obj.msg});
        this.showFormPartner = false;
        this.$emit('getPartnersSocialCenterList', {});
      })
      .catch(error => {
        this.$q.dialog({ title: 'Error', message: error })
      })
    },

  },
  components: {
  },
  mounted ()  {
    // this.filterRecord = this.filter
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
