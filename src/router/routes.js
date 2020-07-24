
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
            path: 'aprobacionMain',
            name: 'aprobacionMain',
            component: () => import('components/Aprobacion/aprobacionMain.vue'),
            props: true
          },
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
