
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
          { path: 'personalMain', 
            name: 'personalMain', 
            component: () => import('components/Personal/personalMain.vue'), 
            props: true },
          {
            path: 'personalFormMain/:id',
            name: 'personalFormMain',
            component: () => import('components/Personal/personalFormMain.vue'),
            props: true,
            children: [
              { path: 'personalForm', name: 'personalForm', component: () => import('components/Personal/personalForm.vue'), props: true }
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
