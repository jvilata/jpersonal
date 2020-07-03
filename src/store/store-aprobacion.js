const state = {
  porAprobar: [
      {
        id: 0,
        ejercicio: 2020,
        fechaDesde: '2020-06-04 00:00:00',
        fechaHasta: '2020-06-04 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test0',
        estado: 'APROBADO',
        empleado: {
          idEmpleado: 2,
          idPersonal: 2,
          nombrePersona: 'Marta Vilata Darder'
        },
        tipo: 'PERMISO'
      },
      {
        id: 1,
        ejercicio: 2020,
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'PENDIENTE',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'PERMISO'
      },
      {
        id: 2,
        ejercicio: 2020,
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'CONC. PROVISIONAL',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'PERMISO'
      },
      {
        id: 3,
        ejercicio: 2020,
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'DENEGADO',
        empleado: {
          idEmpleado: 2,
          idPersonal: 2,
          nombrePersona: 'Marta Vilata Darder'
        },
        tipo: 'PERMISO'
      },
      {
        id: 3,
        ejercicio: 2020,
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'PENDIENTE',
        empleado: {
          idEmpleado: 2,
          idPersonal: 2,
          nombrePersona: 'Marta Vilata Darder'
        },
        tipo: 'CAMBIO HORARIO'
      },
      {
        id: 3,
        ejercicio: 2020,
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'PENDIENTE',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'TELETRABAJO'
      },
  ]
}

const mutations = {
  
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}