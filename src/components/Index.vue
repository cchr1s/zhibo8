<template>
	<div class="global">
		<header>
			<div class="logo">
				<span v-if='!islogin' @click="$router.push({name: 'login'})"></span>
				<span v-if="islogin" class="islogin"></span>
				<i v-if="islogin" @click="logout()">，注销</i>
			</div>
			<div class="sub">
				<h2>直播吧</h2><span v-if="!choose" @click="choose = true">ㄑ</span><span v-if="choose" class="up">ㄑ</span>
			</div>
		</header>
		<div class="mask" v-if="choose" @click="choose = false" @touchmove.prevent @scroll.prevent>
			<div class="choose" v-if="choose">
				<ul>
					<li v-for = "(key, val, index) in category" @click="toggleCate(key)" :class="key.isActive?'active':''">{{key.tab}}<span class="correct" v-if="key.isActive">✔</span></li>
				</ul>
			</div>	
		</div>
		<div class="nav">
			<ul>
				<li v-for = "(key, val, index) in navs" @click="toggleTabs(key)" :class="key.isActive?'active':''">{{key.tab}}</li>
			</ul>
		</div>
		<div class='commonnews' v-if='showNews'>
			<div class="content">
				<div class="list">
					<ul>
						<li class="news_lite" v-for="(item, index) in commonNews" :type="item.classes=='nba'?'basketball':'football'" ref="lite">
							<a @click="$router.push({name:'headline', params:{classes: item.classes,newsTime: item.newsTime, contentId:item.contentId}})">
								<img v-view="item.img" alt="">
								<div>{{item.title}}</div>
								<div>{{item.createTime}}</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="module headline" v-show = "showImportant&& !showNews">
			<header>
				<h3>头条</h3>
			</header>
			<div class="content">
				<div class="list">
					<ul>
						<li class="news_lite" v-for="(item, index) in news">
							<a @click="$router.push({name:'headline', params:{classes: item.classes,newsTime: item.newsTime, contentId:item.contentId}})">
								<!-- <img :src="'/static/img/'+ imgFileName[index]" alt=""> -->
								<img :src="item.img" alt="">
								<div >{{item.title}}</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="module saishi" v-for="($parentIndex, value) in schedule.time.length" v-if='!showNews'>
			<div class="head">
				<h2>{{schedule.time[$parentIndex-1]}}</h2>
			</div>
			<div class="content">
				<div class="list">
					<ul>
						<li class="lite" v-for="($parentIndex,index,value) in schedule.content[$parentIndex-1]" :type='$parentIndex.type' v-show='$parentIndex.important||important' ref="lite">
							<a @click="$router.push({name:'liveroom', params:{matchId: $parentIndex.matchId?$parentIndex.matchId:$parentIndex.name}})">
								<table :id='$parentIndex.matchId'>
									<tbody>
										<tr>
											<td class="s_time">{{$parentIndex.time}}</td>
											<td class="s_home">
												<div v-if = $parentIndex.homeimg>
													<img :src="'http:' + $parentIndex.homeimg" alt="" :onerror="errorImg01">
												</div>
												<div>
													{{$parentIndex.home}}
												</div>
											</td>
											<td>
												<div class="s_name">{{$parentIndex.name}}</div>
												<div class="s_keyword">{{$parentIndex.keyword}}</div>
											</td>
											<td class="s_road">
												<div v-if = $parentIndex.roadimg>
													<img :src="'http:' + $parentIndex.roadimg" alt="" :onerror="errorImg02">
												</div>
												<div>
													{{$parentIndex.road}}
												</div>
											</td>
											<td class="remind">{{$parentIndex.remind}}
												<img :src="'/static/img/clock1.png'" alt="" v-if='!$parentIndex.remind'>
											</td>
										</tr>
									</tbody>
								</table>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import Vuex from 'vuex';
	import VueViewload from 'vue-viewload'
	import {mapState} from 'vuex';
	import * as types from '../store/types'
	import api from '../router/axios'
	Vue.use(VueViewload)
	Vue.use(Vuex);
	Vue.prototype.$http = axios

	export default {
		name: 'cc',
		data(){
			return {
				islogin: false,
				choose: false,
				category :{
					all : {
						tab: '全部',
						isActive: true
					},
					basketball : {
						tab: '篮球',
						isActive: false
					},
					football : {
						tab: '足球',
						isActive: false
					}
				},
				navs : {
					news : {
						tab: '新闻',
						isActive: false
					},
					important : {
						tab: '重要',
						isActive: true
					},
					all : {
						tab: '全部',
						isActive: false
					}
				},
				isActive : null,
				news : [],
				commonNews : [],
				schedule: {
					time: [],
					content: []      				
				},
				showImportant : true,
				important : false,
				showNews: false,
				errorImg01 : 'this.src="/static/img/host.png"',
				errorImg02 : 'this.src="/static/img/visit.png"',
			}
		},
		created(){
			this.getData()			
		},
		computed:{},					
		mounted(){
			if (localStorage.username) {
				this.islogin = true
			}

			//initialize diaplay schedule 3 items
			var item = [1, 2, 3, 4]
			for (let i = 0; i < item.length; i++){
				this.fetchSchedule(item[i])
			}

			//initialize diaplay news 20 items
			for(let j = 0; j < 20;j++){
				this.fetchCommonNews(j)
			}

			var scheduleItem = 5
			var newsItem = 20
			window.addEventListener('scroll', () => {
				/**
				 * console.log(document.documentElement.clientHeight)
				 * console.log(window.innerHeight)
				 * console.log(document.body.scrollTop + ' 滚动高度')
				 * console.log(document.body.offsetHeight+' 文档高度')
				 */
				
				if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight - 60) { 
					this.fetchSchedule(scheduleItem)
					this.fetchCommonNews(newsItem)
					scheduleItem ++
					newsItem ++
				}
			}, false)
	
		},		
		methods:{
			getData (){
				this.$http.get('/api/headline')
					.then(res =>{
						//console.dir(res.data)
						this.news = res.data

						//news random display 4 items
						function randomNewsDisplay(arr, count) {
							var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
							while (i-- > min) {
								index = Math.floor((i + 1) * Math.random());
								temp = shuffled[index];
								shuffled[index] = shuffled[i];
								shuffled[i] = temp;						        
							}						    
							return shuffled.slice(min);						    
						}

						this.news = randomNewsDisplay(this.news, 4)

					}).catch(res=>{
						alert('获取数据出错。。')
					})									
			},
			fetchCommonNews(fetchId){
				this.$http.get('/api/commonNews/'+fetchId+'cc').then(res => {
						if (res.data[0]) {
							this.commonNews.push(res.data[0])
						}
					}).catch(err => {
						console.log(err)
					})
			},
			fetchSchedule(fetchId){
				this.$http.get('/api/schedule/'+ fetchId+'cc')
					.then(res =>{
						for(let i = 0; i< res.data.length;i++){
							if(res.data[i].schedule_time){
								this.schedule.time.push(res.data[i].schedule_time)
								this.schedule.content.push(res.data[i].content)		
							}
						}
						this.chooseImportant()
						this.updateScore()
					}).catch(err=>{
						console.log(err)
					})
			},
			toggleCate(key){
				for (let item in this.category){
					this.category[item].isActive = false
				}
				key.isActive = true
				this.choose = false

				//switch basketball or football
				for(let i = 0; i < this.$refs.lite.length;i++){
					this.$refs.lite[i].style.display = 'block'
					if (key.tab === '篮球' && this.$refs.lite[i].type !== 'basketball') {  							
						this.$refs.lite[i].style.display = 'none'
					}
					if (key.tab === '足球' && this.$refs.lite[i].type !== 'football') { 							
						this.$refs.lite[i].style.display = 'none'
					}					
				} 				
			},
			toggleTabs(key){
				for (let item in this.navs){
					this.navs[item].isActive = false
				}
				key.isActive = true
				if (key.tab === '新闻') {
					this.important = false
					this.showImportant = true
					this.showNews = true
				}

				if (key.tab === '重要') {
					this.important = false
					this.showImportant = true
					this.showNews = false
				}
				if (key.tab === '全部') {
					this.important = true
					this.showImportant = false
					this.showNews = false
				}
			},
			updateScore(){
				//bifen
				this.$http.get('http://bifen4m.qiumibao.com/json/list.htm')
					.then(res => {
						//console.log(res.data)
						if(this.schedule.content[0]){
							for(let k = 0; k < this.schedule.content[0].length; k++){
								var url = this.schedule.content[0][k].url.substring(13)
								for(let i = 0; i < res.data.list.length; i++){
									if (url === res.data.list[i].url) {
										this.schedule.content[0][k].name = res.data.list[i].home_score + ' - ' +res.data.list[i].visit_score
										this.schedule.content[0][k].remind = res.data.list[i].period_cn
									}
								}

							}
						}
					}).catch(err=>{
						console.log(err)
					})
			},
			chooseImportant(){
				//choose for importance
				for (let i = 0; i < this.schedule.content.length;i++) {
					for (let j = 0; j < this.schedule.content[i].length; j++){
						if (this.schedule.content[i][j].homeimg !== '' || this.schedule.content[i][j].roadimg) {
							this.schedule.content[i][j].important = true
						}
					}
				}
			},
			logout() {
				this.islogin = false
	            this.$store.dispatch('UserLogout')	            
	        },		
		},
		watch:{

		}
	}


</script>

<style lang='scss' scoped>
	@import '../style/index'
</style>