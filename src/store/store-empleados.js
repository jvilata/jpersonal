import Vue from 'vue'
import { axiosInstance } from 'boot/axios.js'
import login from './store-login'

const state = {
  listaEmpleados: [],
  filialEmpleado: {},
  bloqueFilialEmpleado: [],
  empleadoSelec: {},
  idautorizador: 0
}

const mutations = {
  loadListaEmpleados(state, lista) {
    state.listaEmpleados= lista
  },
  loadFilialEmpleado(state, filial) {
    state.filialEmpleado= filial    
    console.log('FilialEmpleado', state.filialEmpleado);
  },
  loadBloquesFilialEmpleado(state, bloques) {
    state.bloqueFilialEmpleado= bloques
    console.log('bloqueFilialEmpleado', state.bloqueFilialEmpleado);
  },
  setEmpleadoSelec(state, empleado) {
    state.empleadoSelec = empleado
    console.log('empleado', state.empleadoSelec);
  },
  setResponsable(state, idautorizador) {
    state.idautorizador = idautorizador;
  }
}

const actions = {
  loadListaEmpleados({ commit }, objFilter) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=cpersonal_of/combo&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaEmpleados' + 'No existen datos', { root: true })
        } else {
          commit('loadListaEmpleados', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadListaEmpleados' + error, { root: true })
      })
  },

  loadFilialEmpleado({ commit }) {
    console.log('empleado', state.empleadoSelec);
    let objFilter = { pais: state.empleadoSelec.pais_laboral }
    axiosInstance.get(`bd_jpersonal.asp?action=filiales/list&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true })
      .then((response) => {
       commit('loadFilialEmpleado', response.data[0])
       this.dispatch('empleados/loadBloquesFilialEmpleado')
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadFilialEmpleado' + error, { root: true })
      })
  },

  loadBloquesFilialEmpleado({ commit }) {
    let objFilter = { idfilial: state.filialEmpleado.idfilial }
    axiosInstance.get(`bd_jpersonal.asp?action=filialesbloques/list&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true })
      .then((response) => {
       commit('loadBloquesFilialEmpleado', response.data)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadBloquesFilialEmpleado' + error, { root: true })
      })
  },

  calculaResponsable( { commit }, [empleado, tiposol] ){
    var idautorizador=0; 
    idautorizador = empleado.idautorizador; 
    if (idautorizador == 0) {
      if (empleado.pais=="MX") {  // en MX se asigna todo a German si es de cons o dir proy
        if ((empleado.area==1) || (empleado.area==2)) {
          idautorizador = 114; // german. Mirar cpersonal_ofrepository.java si se cambia esto
          empleado.emailAutorizador='gsanchez@edicom.es';
        }
      } else if (empleado.pais=="ES") { 
        if(empleado.area == 2){ // si es de consultoria lo ejecuta todo el RESP TM
          idautorizador = empleado.directorTMCodEmp;
          empleado.emailAutorizador=empleado.directorTMEmail;

          //si es un respTM la aprobacion es de ANA
          if(idautorizador == empleado.id){
            idautorizador = empleado.idautArea;
            empleado.emailAutorizador = "adarder@edicom.es";
          }
            
        }else if(empleado.area == 1){
          if(tiposol == 1){ //vacaciones de RESP_PM y PM las aprueba Javi F
            idautorizador = 48;
            empleado.emailAutorizador = "jfernandez@edicom.es";
          }else{
            idautorizador = empleado.directorPMCodEmp;
            empleado.emailAutorizador=empleado.directorPMEmail;
              
            //si es RESP_PM lo aprueba ANA 
            if(idautorizador == empleado.id){
              idautorizador = empleado.idautArea;
              empleado.emailAutorizador = "adarder@edicom.es";
            }
          }
        }
      }
      if (idautorizador==0 || idautorizador === '') idautorizador = empleado.idautArea; // si no hemos asignado resp asignamos al resp area
    }
    commit('setResponsable', idautorizador)
  },

  setEmpleadoSelec( {commit}, empleado) {
    commit('setEmpleadoSelec', empleado)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
