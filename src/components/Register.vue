<template lang="html">
	<div class='global'>
		<header>
			<div class="back">
				<span @click="$router.push({name:'index'})">ㄑ</span>
			</div>
			<div class="sub">
				<h2>注册</h2>
			</div>
		</header>
		<form :model="user" class='reg' ref="user">
			<div>
				<label for="">用户名：</label>
				<input type="text" placeholder="请输入您的用户名" v-model='user.name'>
			</div>
			<div>
				<label for="">手机号：</label>
				<input type="text" placeholder="请输入手机号" v-model='user.tel'>
			</div>
			<div>
				<label for="">密　码：</label>
				<input type="password" placeholder="请输入密码" v-model='user.password'>
			</div>
			<div class="agree">注册即同意《用户协议》</div>
			<button type="submit" @click="submitForm('user')">提交</button>
		</form>
	</div>
</template>
·
<script>
import * as types from '../store/types'
import api from '../router/axios'
export default {
	name: 'register',
	data() {
		return {
			user: {
				tel: '',
				password: '',
				name: '',
				first: 'first'
			}
		}
	},       
	methods: {
		submitForm(formName) {
			let opt = this.user;
			api.userRegister(opt).then(({ data }) => {
				if (data.success) {
					//  Register 设计为了 Login 的组件，所以成功跳转时刷新一次页面
					this.$router.go(0)
					this.$router.push('/login')
				} else {
					alert('此手机号码已存在')
				}
			}).catch((err) => {
				console.log(err);
			})
		}
	}
}
</script>

<style lang='scss' scoped>
	@import '../style/register'
</style>
