// import { firebaseAuth } from './firebase'

export default ({ app, router, Vue, store }) => {
  router.beforeEach((to, from, next) => {
    if (to.path !== '/' && !store.state.login.loggingIn) next('/')
    else next()
  })
}
