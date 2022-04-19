
const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutLogin.vue'),
    children: [
      { path: '', component: () => import('pages/PageLogin.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'mainTabs',
        component: () => import('components/MainTabs/mainTabs.vue'),
        children: [
          { 
            path: 'personalMain', 
            name: 'personalMain', 
            component: () => import('components/Personal/personalMain.vue'), 
            props: true 
          },
          { 
            path: 'cambioHorario', 
            name: 'cambioHorario', 
            component: () => import('components/CambiosPersonal/cambioHorario.vue'), 
            props: true 
          },
          { 
            path: 'teletrabajo', 
            name: 'teletrabajo', 
            component: () => import('components/CambiosPersonal/teletrabajo.vue'), 
            props: true 
          },
          { 
            path: 'otrosCambios', 
            name: 'otrosCambios', 
            component: () => import('components/CambiosPersonal/otrosCambios.vue'), 
            props: true 
          },
          {
            path: 'personalFormMain/:id',
            name: 'personalFormMain',
            component: () => import('components/Personal/personalFormMain.vue'),
            props: true,
            children: [
              { path: 'personalForm', 
                name: 'personalForm', 
                component: () => import('components/Personal/PersonalTabs/personalForm.vue'), 
                props: true 
              },
              { path: 'personalContract', 
                name: 'personalContract', 
                component: () => import('components/Personal/PersonalTabs/personalContract.vue'), 
                props: true 
              },
              { path: 'personalContact', 
                name: 'personalContact', 
                component: () => import('components/Personal/PersonalTabs/personalContact.vue'), 
                props: true 
              },
              { path: 'personalSchedule', 
                name: 'personalSchedule', 
                component: () => import('components/Personal/PersonalTabs/personalSchedule.vue'), 
                props: true 
              },
              { path: 'personalTeletrabajo', 
                name: 'personalTeletrabajo', 
                component: () => import('components/Personal/PersonalTabs/personalTeletrabajo.vue'), 
                props: true 
              },
              { path: 'personalCompetences', 
                name: 'personalCompetences', 
                component: () => import('components/Personal/PersonalTabs/personalCompetences.vue'), 
                props: true 
              }
               
            ]
          },
          { path: 'permisosMain',
            name: 'permisosMain',
            component: () => import('components/Permisos/permisosMain.vue'),
            props: true,
            children: [
              {
                path: 'permisosPendientes', 
                name: 'permisosPendientes', 
                component: () => import('components/Permisos/permisosPendientes.vue'), 
                props: true 
              },
              {
                path: 'permisosConcedidos', 
                name: 'permisosConcedidos', 
                component: () => import('components/Permisos/permisosConcedidos.vue'), 
                props: true 
              }
            ]
          },
          { 
            path: 'verJustificantes', 
            name: 'verJustificantes', 
            component: () => import('components/Permisos/PermisosConcedidos/verJustificantes.vue'), 
            props: true 
          },
          {
            path: 'aprobacionMain/:id',
            name: 'aprobacionMain',
            component: () => import('components/Aprobacion/aprobacionMain.vue'),
            props: true
          },
          { path: 'planosMain', name: 'planosMain', component: () => import('components/Planos/planosMain.vue'), props: true },
          { path: 'consReservasMain', name: 'consReservasMain', component: () => import('components/ConsultaReservas/consReservasMain.vue'), props: true },
          { 
            path: 'clientesMain', 
            name: 'clientesMain', 
            component: () => import('components/Clientes/clientesMain.vue'), 
            props: true 
          },
          { 
            path: 'reservaPadelMain', 
            name: 'reservaPadelMain', 
            component: () => import('components/ReservasPadel/consReservasPadelMain.vue'), 
            props: true 
          },
          {
            path: 'dashboardMain',
            name: 'dashboardMain',
            component: () => import('components/Dashboard/dashboardMain.vue'),
            props: true,
            children: [
              { path: 'panelDatos', name: 'panelDatos', component: () => import('components/Dashboard/dashboardPanelDatos.vue'), props: true },
              { path: 'gridClientes', name: 'gridClientes', component: () => import('components/Dashboard/dashboardGridClientes.vue'), props: true },
              { path: 'dashboardGraficos', name: 'dashboardGraficos', component: () => import('components/Dashboard/dashboardGraficos.vue'), props: true },
              { path: 'dashboardSQL', name: 'dashboardSQL', component: () => import('components/Dashboard/dashboardSQL.vue'), props: true }
            ]
          },
          {
            path: 'fichajesMain', 
            name: 'fichajesMain', 
            component: () => import('components/Fichajes/fichajesMain.vue'), 
            props: true 
          },
          {
            path: 'clubSocialMain',
            name: 'clubSocialMain',
            component:() => import('components/ClubSocial/clubSocialMain.vue'),
            props: true
          }
      ]
      },
      {
        path: 'sinTabs',
        component: () => import('components/MainTabs/sinTabs.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
