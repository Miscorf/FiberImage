import Vue from 'vue'
import Router from 'vue-router'
import plotyContour from '@/components/plotlyContour'
import sse from '@/components/sse'
Vue.use(Router)
export default new Router({
	routes: [
		{
			path:'/',
			name:'plotyContour',
			component: plotyContour
		},
		{
			path:'/sse',
			name:'sse',
			component: sse
		},
		
	]
})