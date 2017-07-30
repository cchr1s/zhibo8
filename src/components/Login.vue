<template lang="html">
  <div class='global'>
		<header>
			<div class="back">
				<span @click="$router.push({name:'index'})">ㄑ</span>
			</div>
			<div class="sub">
				<h2>登录</h2>
			</div>
		</header>
		<form :model="user" ref="user" class="login">
			<div class="phone">
				<span></span>
				<input type="text" placeholder="请输入手机号" v-model="user.tel">
			</div>
			<div class="password">
				<span></span>
				<input type="password" placeholder="请输入密码" v-model='user.password'>
			</div>
			<button type="submit" @click="submitForm('user')">登录</button>
		</form>
		<router-link to="/register" class="register">注册</router-link>
	</div>
</template>

<script>
import * as types from '../store/types'
import api from '../router/axios'
export default {
	name: 'login',
	data() {
		return {
			user: {
				tel: '',
				password: '',
			},
		}	
	},
	methods: {
		// 登录
		submitForm(formName) {
			let opt = this.user;
			console.log(opt)
			api.UserLogin(opt).then(({ data }) => {
				
				if (data.success) {
					console.log(data)
					this.$store.dispatch('UserLogin', data.token)
					this.$store.dispatch('UserName', data.name)
					let redirect = decodeURIComponent(this.$route.query.redirect || '/');
					this.$router.push({ path: redirect })
				} else{
					alert('账号不存在或密码错误')
				}
			})
		}
	}
}
</script>

<style lang='scss' scoped>
	@import '../style/login'
</style>