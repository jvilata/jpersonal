<template>
  <div class="row">
    <div class="col">
        <q-form @submit="getKPIValores(filterR)" class="q-gutter-y-xs">
            <div class="row" >
            <q-select
              class="col-10"
              label="Tipo gráfico"
              stack-label
              clearable
              v-model="filterR.idkpi"
              :options="listaKpisFilter"
              @filter="filterKpisDefinicion"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              option-value="idkpi"
              option-label="descripcion"
              emit-value
              map-options
            />
            <q-btn class="col-2" type="submit" label="Buscar" color="primary"/>
            </div>
        </q-form>
      <q-item >
        <q-item-section align="center">
          <apexchart ref="evol1" height= "400px" width="1000px" :type="tipoGrafico" :options="chartOptions" :series="series"></apexchart>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>
<script>
// doc in: https://github.com/apexcharts/vue-apexcharts , https://apexcharts.com/
import { numeralInstance } from 'boot/numeral.js'
import { mapActions } from 'vuex'
export default {
  props: ['value'],
  data: function () {
    return {
      tipoGrafico: 'line',
      filterR: {},
      kpiSeleccionado: {},
      registrosKPIDefinicion: [],
      registrosKPIValores: [],
      listaKpisFilter: [],
      chartOptions: {
        labels: [],
        legend: {
          show: true,
          position: 'top'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opt) {
            if (val > 1000) return numeralInstance(val / 1000).format('0,0') + 'k'
            else return numeralInstance(val).format('0,0')
          },
          style: {
            fontSize: '10px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'normal'
            // colors: ['dark']
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return numeralInstance(val).format('0,0.00')
            }
          }
        }
      },
      series: [] // { name:'nom serie', type: 'line', data: [] }
    }
  },
  methods: {
    ...mapActions('login', ['desconectarLogin']),
    filterKpisDefinicion (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.listaKpisFilter = this.registrosKPIDefinicion.filter(v => v.descripcion.toLowerCase().indexOf(needle) > -1)
      })
    },
    getKPIDefinicion (objFilter) {
      this.$axios.get('bd_kpis.asp?action=findKPIDefinicion', { params: objFilter })
        .then(response => {
          this.registrosKPIDefinicion = response.data
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    },
    getKPIValores (objFilter) {
      this.kpiSeleccionado = this.registrosKPIDefinicion.find(x => x.idkpi === objFilter.idkpi)
      this.$axios.get('bd_kpis.asp?action=findKPIValores', { params: objFilter })
        .then(response => {
          this.registrosKPIValores = response.data
          this.cargarDatosGrafico()
        })
        .catch(error => {
          this.$q.dialog({ title: 'Error', message: error.response.statusText })
          this.desconectarLogin()
        })
    },
    cargarDatosGrafico () {
      this.tipoGrafico = 'line'
      this.series = []
      this.registrosKPIValores.sort(function (a, b) { // ordeno el array por etiquetavalor
        return a.etiquetavalor.localeCompare(b.etiquetavalor)
      })
      var etiqAnt = ''
      var arr = []
      this.registrosKPIValores.forEach(row => {
        if (row.etiquetavalor !== etiqAnt) {
          arr.push(row.etiquetavalor) // la cambiar de etiqueta guardo la anterior
          etiqAnt = row.etiquetavalor
        }
      })
      this.chartOptions = {
        labels: arr, // es un array de strings
        plotOptions: {
          pie: {
            donut: {
              size: '40%'
            },
            dataLabels: {
              offset: 20,
              minAngleToShowLabel: 10
            }
          }
        }
      }

      this.registrosKPIValores.sort(function (a, b) { // ordeno el array por serie
        return a.serie.localeCompare(b.serie)
      })

      if (this.kpiSeleccionado.presentacion === '5') { // cuando es donut se carga distinto
        arr = []
        this.registrosKPIValores.forEach(row => {
          arr.push(row.serie)
          this.series.push(parseFloat(row.valor))
        })
        this.chartOptions = {
          labels: arr // es un array de strings
        }
        this.tipoGrafico = 'donut'
      } else {
        var serieAnt = ''
        var obj = {}
        this.registrosKPIValores.forEach(row => {
          if (row.serie !== serieAnt) { // this.serie es un array de objetos {name:'serie', type:'line', data:[1,3,4,..]}
            obj = {
              name: row.serie,
              type: (this.kpiSeleccionado.presentacion === '1' || this.kpiSeleccionado.presentacion === '6' || this.kpiSeleccionado.presentacion === '7' ? 'line'
                : (this.kpiSeleccionado.presentacion === '2' || this.kpiSeleccionado.presentacion === '3' || this.kpiSeleccionado.presentacion === '4' ? 'column'
                  : 'pie')),
              data: []
            }
            this.series.push(obj) // la cambiar de serie guardo la anterior
            serieAnt = row.serie
          }
          obj.data.push(row.valor)
        })
      }
    }
  },
  mounted () {
    this.getKPIDefinicion(this.value)
  }
}
</script>
