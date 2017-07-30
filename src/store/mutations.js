import * as types from './types'

const mutations = {
	[types.LOGIN]: (state, data) => {
		//console.log(localStorage)
		localStorage.setItem('token', data)
		//localStorage.token = data
		state.token = data
	},
	[types.LOGOUT]: (state) => {
		localStorage.removeItem('username');
		state.token = null
	},
	[types.USERNAME]: (state, data) => {
		localStorage.setItem('username', data)
		state.username = data
	}
}
export default mutations
