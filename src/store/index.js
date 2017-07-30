import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

const state = {
	token: null,
	activeName: 'first',
	username: '',
}

export default new Vuex.Store({
	state,
	mutations,
	actions
})


// const store = new Vuex.Store({
// 	state : {
// 		schedule: {
// 			/*time: [],
// 			content: []*/
// 		},
// 	},
// 	mutations: {
// 		SET_SCHEDULE: (state, {data}) => {
// 			state.schedule = data
// 		}
// 	},
// 	getters: {
// 		openSchedule: state => {
// 			return state.schedule.filter(schedule => !schedule.completed)
// 		}
// 	},
// 	actions: {
// 		LOAD_SCHEDULE: function({commit}){
// 			axios.get('/api/schedule').then(res => {
// 				commit('SET_SCHEDULE', {data : res.data})
// 			}).catch(err => {
// 				console.log(err)
// 			})
// 		}
// 	}
// })

// export default store