const state = {
  porAprobar: [
      {
        id: 0,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
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
        fechaSolicitud: '04/072020',
        grupoEtm: '',
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
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        fechaDesde: '2020-07-15 00:00:00',
        fechaHasta: '2020-07-15 00:00:00',
        numJornadas: 1,
        tipoJornadaLibre: 'Vacaciones',
        observaciones: 'test1',
        estado: 'PROVISIONAL',
        empleado: {
          idEmpleado: 1,
          idPersonal: 1,
          nombrePersona: 'Javier Hernández Cerrillo'
        },
        tipo: 'PERMISO'
      },
      {
        id: 3,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
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
        tipo: 'OTROS CAMBIOS'
      },
      {
        id: 3,
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        horaentrada1: '',
        horasalida1: '',
        horaentrada2: '',
        horasalida2: '',
        horaentrada3: '',
        horasalida3: '',
        horaentrada4: '',
        horasalida4: '',
        autorizador1: 'Javier Hernández Cerrillo',
        autorizador2: 'José Blas Vilata Tamarit',
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
        fechaSolicitud: '04/072020',
        grupoEtm: '',
        teletrabajofechadesde: '2020-07-15',
        teletrabajofechahasta: '2020-12-15',
        paisteletrabajo: 'MEXICO',
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