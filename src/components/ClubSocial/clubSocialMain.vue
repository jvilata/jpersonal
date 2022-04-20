  <!-- componente principal de definicion de formularios. Se apoya en otros 2 componentes: Filter y Grid -->
  <template>
    <div style="height: 85vh">
      <q-item class="q-ma-xs q-pa-xs bg-indigo-1 text-grey-8">
        <!-- cabecera de formulario. Botón de busqueda y cierre de tab -->
        <q-item-section avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ nomFormulario }}
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
      <!-- formulario tabla de resultados de busqueda -->
      <div class="row">
          <div class="col"> 
            <q-card class="q-ma-md">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Aforo Actual</div>
                </q-card-section>
                <q-card-section horizontal class="q-pa-sm">
                  <div class="col-xs-12 col-sm-6">
                     <VueSvgGauge
                    :start-angle="-95"
                    :end-angle="95"
                    :value="parseInt(aforo)"
                    :separator-step="80"
                    :gauge-color="[{ offset: 0, color: '#0b8c5a'}, { offset: 80, color: '#f4c009'} , { offset: 100, color: '#de3a21'}]"
                    :scale-interval="5"
                    :inner-radius="80"
                    :separator-thickness="1"
                    base-color="#d0cdcd"
                    >
                  </VueSvgGauge>
                  </div>
                  <div class="col-xs-12 col-sm-6 q-ma-xl" style="text-align:center">
                    <div class="text-h5">Nº Personas actual</div>
                    <div class="text-h4">{{aforo}}</div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="center">
                    <q-btn flat @click="getAforoActual">Refrescar</q-btn>
                </q-card-actions>
              </q-card>
            </div> 
           <div class="col">
            <!-- <clubSocialGrid
                v-model="listaPersonasFichajes"
                :listaFichajesDetalle="listaFichajesDetalle"
                :listaPersonasHorariosAcum="listaPersonasHorariosAcum"
                /> -->
           </div>
      </div>
    </div>
</template>

<script>
// npm i vue-svg-gauge
import { mapState, mapActions } from 'vuex'
import { axiosInstance, headerFormData } from 'boot/axios.js'
import {VueSvgGauge} from 'vue-svg-gauge'
//import {clubSocialGrid} from 'components/ClubSocial/ClubSocialGrid.vue'

export default {
  props: ['value', 'id', 'keyValue'], 
  data () {
    return {
      nomFormulario: 'Club Social',
      aforo: 0,
      // listaPersonasHorariosAcum: [],
      // listaPersonasFichajes: [],
      // listaFichajesDetalle: []
    }
  },
  computed: {
    ...mapState('login', ['user']) // importo state.user desde store-login
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    getAforoActual () {
      axiosInstance.post(`bd_jpersonal.asp?action=social/center/capacity&auth=${this.user.auth}`, {}, headerFormData) // tipo acciones
        .then((response) => {
          this.aforo = response.data.msg
          this.series = [this.aforo]
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error })
        })
    }
  },
  mounted () {
    this.getAforoActual();
  },
  components: {
      VueSvgGauge,
     // clubSocialGrid: clubSocialGrid
  }
}
</script>