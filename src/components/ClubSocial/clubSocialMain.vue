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
          <div class="col-xs-12 col-sm-3"> 
            <q-card class="q-ma-md">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">CONTROL DE AFORO</div>
                </q-card-section>
                <q-card-section class="q-pa-lg">
                  <div>
                     <VueSvgGauge
                    :start-angle="-110"
                    :end-angle="110"
                    :value= "parseInt(aforo)"
                    :separator-step="5"
                    :max = "limite"
                    :gauge-color="[{ offset: 0, color: '#64bf8a' }, { offset: 100, color: '#347AB0' }]"
                    :scale-interval="1"
                    :inner-radius="60"
                    :separator-thickness="1"
                     base-color="#d0cdcd"
                    >
                     <div style="display: flex; justify-content: center;margin-top: 75px; font-size: 20px;">
                      <span style=" max-width: 100px">{{ aforo }} / {{limite}}</span>
                      </div>
                  </VueSvgGauge>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="center">
                    <q-btn flat @click="getAforoActual">Refrescar</q-btn>
                </q-card-actions>
              </q-card>
          </div> 
          <div class="col-xs-12 col-sm-8">
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
      limite: 65
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
<style lang="stylus">
  #app {
    .inner-text {
      &--1, &--3 {
        display: flex
        justify-content: center
        margin-top: 85px
        font-size: 20px
        color: #de3a21
        font-weight: bold
        span { max-width: 100px }
      }
      &--3 {
        margin-top: 70px
      }

    }
  }
</style>