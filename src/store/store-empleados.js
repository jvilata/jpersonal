import Vue from 'vue'
import { axiosInstance, headerFormData } from 'boot/axios.js'
import querystring from 'querystring'
import login from './store-login'
import permisos from './store-permisos'

const state = {
  listaEmpleados: [],
  listaPaises: [],
  idautorizador: 0
}

const mutations = {
  loadListaEmpleados(state, lista) {
    state.listaEmpleados= lista
  },
  loadListaPaises(state, lista) {
    state.listaPaises= lista
  },
  loadFilialEmpleado(state, filial) {
    state.filialEmpleado= filial    
    console.log('FilialEmpleado', state.filialEmpleado);
  },
  loadBloquesFilialEmpleado(state, bloques) {
    state.bloqueFilialEmpleado= bloques
    console.log('bloqueFilialEmpleado', state.bloqueFilialEmpleado);
  },
  setResponsable(state, idautorizador) {
    state.idautorizador = idautorizador;
  }
}

const actions = {
  loadListaDetalleEmpleados({ commit }, objFilter) {
    return axiosInstance.get(`bd_jpersonal.asp?action=cpersonal_of&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true }) 
  },

  loadDetalleEmpleado({ commit }, id) {
    return axiosInstance.get(`bd_jpersonal.asp?action=pers_empleados_of/id/${id}&auth=${login.state.user.auth}`, { }, { withCredentials: true }) 
  },

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

  loadCompetencias({ commit }) {
    return axiosInstance.get(`bd_jpersonal.asp?action=competencias&auth=${login.state.user.auth}`, { params: {idempleado: login.state.user.pers.id} }, { withCredentials: true }) 
  },

  loadListaPaises({ commit }) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=Codigospais/list&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + 'No existen datos', { root: true })
        } else {
          commit('loadListaPaises', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + error, { root: true })
      })
  },

  loadListaPuestos({ commit }, anyosExp, areaempleado) {
    //Llamaremos al backend para rellenar la lista y actualizaremos el state 
    axiosInstance.get(`bd_jpersonal.asp?action=puesto/list&auth=${login.state.user.auth}`, { params: {} }, { withCredentials: true }) // tipo acciones
      .then((response) => {
        if (response.data.length === 0) {
          this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + 'No existen datos', { root: true })
        } else {
          commit('loadListaPaises', response.data)
        }
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadListaPaises' + error, { root: true })
      })
  },

  loadFilialEmpleado({ commit }, idempleado) {
    return new Promise((resolve, reject) => {
      var emp = state.listaEmpleados.find(record => record.id === idempleado)
      let objFilter = { pais: emp.paisLaboral }
      axiosInstance.get(`bd_jpersonal.asp?action=filiales/list&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true })
      .then((response) => {
        var filialEmpleado = { filial: response.data[0], bloquesFilial: [] }
        objFilter = { idfilial: filialEmpleado.filial.idfilial }
        axiosInstance.get(`bd_jpersonal.asp?action=filialesbloques/list&auth=${login.state.user.auth}`, { params: objFilter }, { withCredentials: true })
        .then((response) => {
          filialEmpleado.bloquesFilial = response.data
          resolve(filialEmpleado)
        })
        .catch(error => {
          this.dispatch('mensajeLog/addMensaje', 'loadBloquesFilialEmpleado' + error, { root: true })
          reject(error)
        })
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadFilialEmpleado' + error, { root: true })
        reject(error)
      })
    })
  },

  loadDiasPendientes({ commit }, objFilterP) {
    return new Promise((resolve, reject) => {
      axiosInstance.get(`bd_jpersonal.asp?action=diasvacaciones&auth=${login.state.user.auth}`, { params: objFilterP }, { withCredentials: true })
      .then((response) => {
        var diasPendientes = {
          tdiaslibres: 0,
          tdiasvacaciones: response.data[0].diasdevacaciones,
          tdiaspendientes: 0
        }
        resolve(diasPendientes)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadDiasPendientes' + error, { root: true })
        reject(error)
      })
    })
  },

  loadDiasConcedidos({ commit }, objFilterP) {
    return new Promise((resolve, reject) => {
      axiosInstance.post(`bd_jpersonal.asp?action=vacaciones/CuentaDiasAprobados`, querystring.stringify(objFilterP), headerFormData)
      .then((response) => {
        resolve(response)
      })
      .catch(error => {
        this.dispatch('mensajeLog/addMensaje', 'loadDiasConcedidos' + error, { root: true })
        reject(error)
      })
    })
  },

  calculaResponsable( { commit }, [empleado, tiposol] ){
    return new Promise((resolve, reject) => {
      var idautorizador=0; 
      idautorizador = empleado.idautorizador; 
      emailAutorizador = empleado.emailAutorizador;
      if (idautorizador === 0) {
        if (empleado.pais === 'MX') {  // en MX se asigna todo a German si es de cons o dir proy
          if ((empleado.area === 1) || (empleado.area === 2)) {
            idautorizador = 114; // german. Mirar cpersonal_ofrepository.java si se cambia esto
            emailAutorizador='gsanchez@edicom.es';
          }
        } else if (empleado.pais === 'ES') { 
          if(empleado.area  === 2){ // si es de consultoria lo ejecuta todo el RESP TM
            idautorizador = empleado.directorTMCodEmp;
            emailAutorizador=empleado.directorTMEmail;

            //si es un respTM la aprobacion es de ANA
            if(idautorizador === empleado.id){
              idautorizador = empleado.idautArea;
              emailAutorizador = 'adarder@edicom.es';
            }
              
          } else if(empleado.area === 1){
            if(tiposol === 1){ //vacaciones de RESP_PM y PM las aprueba Javi F
              idautorizador = 48;
              emailAutorizador = 'jfernandez@edicom.es';
            } else {
              idautorizador = empleado.directorPMCodEmp;
              emailAutorizador = empleado.directorPMEmail;
                
              //si es RESP_PM lo aprueba ANA 
              if(idautorizador === empleado.id){
                idautorizador = empleado.idautArea;
                emailAutorizador = 'adarder@edicom.es';
              }
            }
          }
        }
        if (idautorizador === 0 || idautorizador  === '') idautorizador = empleado.idautArea; // si no hemos asignado resp asignamos al resp area
      }
      resolve({ idautorizador: idautorizador, emailAutorizador: emailAutorizador })
    })
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
