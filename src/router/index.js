import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/Index'
import headline from '@/components/Headline'
import liveroom from '@/components/Liveroom'
import login from '@/components/Login'
import register from '@/components/Register'
import store from '../store/index.js'

Vue.use(Router)

const router = new Router({
  	routes: [
		{
			path: '/',
			name: 'index',
			component: index
		},
		{
			path: '/headline/:classes/:newsTime/:contentId/',
			name: 'headline',
			component: headline
		},
		{
			path: '/liveroom/:matchId',
			name: 'liveroom',
			component: liveroom
		},
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/register',
			name: 'register',
			component: register
		}
  	]
})

// 验证 token，存在才跳转
/*router.beforeEach((to, from, next) => {
	let token = localStorage.getItem('user')
	//if(to.meta.requireAuth) {
	//	if(user) {
	//		next()
	//	} else {
	//		next({
	//			path: '/login',
	//			query: { redirect: to.fullPath }
	//		})
	//	}
	//} else {
	//	next()
	//}
})*/


export default router