import Vue from 'vue'
import VueRouter from 'vue-router'

import QuestionView from './components/QuestionView'
import MapView from './components/MapView'
import ListView from './components/ListView'
import DetailView from './components/DetailView'
import FilterView from './components/FilterView'
// import CompareView from './components/CompareView'

Vue.use(VueRouter)

const routes = [
  {path: '/intro', component: QuestionView},
  {path: '/explore', components: {default: MapView, aside: ListView, header: FilterView}},
  {path: '/bookmark', components: {default: MapView, aside: ListView}},
  {path: '/detail/:entityId', components: {default: MapView, aside: DetailView}, props: {default: true, aside: true}},
  // {path: '/compare', component: CompareView},
  {path: '/*', redirect: '/intro'}
]

const router = new VueRouter({mode: 'history', routes})

export default router
