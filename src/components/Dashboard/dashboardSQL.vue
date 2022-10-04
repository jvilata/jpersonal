<template>
  <div class="row">
    <div class="col">
        <q-form @submit="ejecutarSQL(filterR)" class="q-gutter-y-xs">
            <div class="row" >
            <q-select
              class="col-10"
              label="Tipo gráfico"
              stack-label
              clearable
              v-model="filterR.id"
              :options="listaSQLsFilter"
              @filter="filterSQLs"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              option-value="id"
              option-label="description"
              emit-value
              map-options
            />
            <q-btn class="col-2" type="submit" label="Ejecutar" color="primary"/>
            </div>
        </q-form>
      <q-item >
        <q-item-section align="center">
          <q-table dense
            class="personalGrid-header-table"
            virtual-scroll
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
            :virtual-scroll-sticky-size-start="48"
            row-key="idxxXX"
            :data="registrosSeleccionados"
            :columns="columns"
            table-style="max-height: 55vh; max-width: 96vw"
          >
            <template v-slot:header="props">
              <!-- CABECERA DE LA TABLA -->
              <q-tr :props="props">
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
              <q-tr :props="props" :key="`m_${props.row.idxxXX}`" @mouseover="rowId=`m_${props.row.idxxXX}`">
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  <div :style="col.style">
                    <div>{{ col.value }}</div>
                  </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:bottom>
              <div>
                {{ registrosSeleccionados.length }} Filas
              </div>
            </template>
          </q-table>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>
<script>
// doc in: https://github.com/apexcharts/vue-apexcharts , https://apexcharts.com/
import { numeralInstance } from 'boot/numeral.js'
import { mapActions, mapState } from 'vuex'
import { headerFormData } from 'boot/axios.js'
import querystring from 'querystring'
export default {
  props: ['value', 'ltab'],
  data: function () {
    return {
      tipoGrafico: 'line',
      filterR: {},
      SQLSeleccionado: {},
      registrosSQLs: [],
      listaSQLsFilter: [],
      registrosSeleccionados: [],
      rowId: '',
      columns: [],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('login', ['user'])
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    filterSQLs (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.listaSQLsFilter = this.registrosSQLs.filter(v => v.description.toLowerCase().indexOf(needle) > -1)
      })
    },
    getSQLs (objFilter) {
      this.$axios.get(`bd_jpersonal.asp?action=consultas/sql/combo/movil&auth=${this.user.auth}`, { params: objFilter })
        .then(response => {
          this.registrosSQLs = response.data
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    },
    ejecutarSQL (objFilter) {
      this.$q.loading.show()
      this.SQLSeleccionada = this.registrosSQLs.find(x => x.id === objFilter.id)
      this.$axios.post(`bd_jpersonal.asp?action=sql/ejecutar&auth=${this.user.auth}`, querystring.stringify({ id: this.SQLSeleccionada.id}), headerFormData)
        .then(response => {
          let result = JSON.parse(response.data.resultado)
          this.columns = []
          if (result.length > 0) {
            Object.keys(result[0]).forEach(key => {
              this.columns.push({
                name: key,
                align: 'left',
                label: key,
                field: key,
                sortable: true,
                style: 'width: 150px; whiteSpace: normal'
              })
            })
            this.registrosSeleccionados = result
            let i = 0;
            this.registrosSeleccionados.forEach(element => element.idxxXX = i++)
            this.$q.loading.hide()
          } else {
            this.$q.dialog({ title: 'Aviso', message: 'No hay registros' })
            this.registrosSeleccionados = []
          }
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    }
  },
  mounted () {
    if (this.ltab === 'dashboardSQL') this.getSQLs({ ids: '475,630' })
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
