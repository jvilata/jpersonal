import Vue from 'vue'
import Vuex from 'vuex'

// todos los stores que queramos usar en la app deben importarse aqui y listarlos abajo en modules
import login from './store-login'
import tabs from './store-tabs'
import tablasAux from './store-tablasAux'
import mensajeLog from './store-log'
import permisos from './store-permisos'
import empleados from './store-empleados'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      login,
      tabs,
      tablasAux,
      mensajeLog,
      permisos,
      empleados
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
