<template>
  <div>
    <div class="text-h6">Seleccione opción del menú</div>
    <q-btn  flat label="prueba" color="primary" @click="prueba"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    prueba () {
      this.$axios.get('pru.asp')
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
