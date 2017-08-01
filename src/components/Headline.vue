<template>
	<div class="global">
		<header>
			<div class="back">
				<span @click="$router.push({name:'index'})">ㄑ</span>
			</div>
			<div class="sub">
				<h2>直播吧</h2>
			</div>
		</header>
		<div class="content">
			<h2>{{newsContent.title}}</h2>
			<h4>{{newsContent.time}}</h4>
			<!-- <img :src="'/static/img/'+ imgFileName" alt=""> -->
			<img :src="newsContent.img" alt="">
			<p v-for="(item, index) in newsContent.content">{{item}}。</p>			
		</div>
		<div class="comment">
			<h4>{{commentInfo}}</h4>
			<h3 v-if='!commentChoose'>期待您的热评</h3>
			<div v-for="(item, index) in hotComment" class="list">
				<img v-lazy="item.figureurl" alt="">
				<div class="zan">
					<img src="/static/img/zan.png" alt="" class="up" @click="dianzan1(item)">
					<span>{{item.up}}</span>
					<img src="/static/img/zan.png" alt="" class="down" @click="dianzan2(item)">
					<span>{{item.down}}</span>
				</div>
				<div class="detail">
					<div class='username'>{{item.username}}</div>
					<div class="time">{{item.updatetime}}&nbsp;&nbsp;来自{{item.device.split('-')[1]}}</div>
					<div class="info">{{item.content}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import VueLazyload from 'vue-lazyload'	
	Vue.prototype.$http = axios
	Vue.use(VueLazyload)

	export default{
		name:'cc_news',
		data(){
			return{
				imgFileName: '', 
				newsContent:{
					title: '',
					time: '',
					img: '',
					content: []
				},
				commentChoose: true,
				commentInfo: '热门评论',
				hotComment: []
			}
		},
		created(){
			this.getData()
		},
		mounted(){
			window.removeEventListener('scroll', () => {
				console.log('remove')
			}, false)
		},
		methods:{
			getData (){	
				let contentId = this.$router.currentRoute.fullPath.split('/')[4]
				let classes =  this.$router.currentRoute.fullPath.split('/')[2]
				let newsTime = this.$router.currentRoute.fullPath.split('/')[3]	
				this.$http.get('/api/commonNewsContent')
					.then(res =>{
						//console.dir(res.data)						
						for (let i = 0; i < res.data.length; i++){
							if(res.data[i].id === contentId){
								this.newsContent.title = res.data[i].title
								this.newsContent.time = res.data[i].time
								this.newsContent.img = res.data[i].img
								let content = res.data[i].content.split('。').slice(0, res.data[i].content.split('。').length - 1)

								for(let j= 0; j < content.length;j++){
									if(content[j].indexOf('”')>-1){
										content[j] = content[j-1]+'。'+content[j]
										content[j-1]= ''
									}	
								}
								for(let k = 0; k <content.length; k++){
									if (content[k] === '') {
										content.splice(k, 1)
										k = k -1
									}
								}
								this.newsContent.content = content

								//img path
								//let _imgFileName = res.data[i].img.split('/')
								//this.imgFileName = _imgFileName[_imgFileName.length - 1]						
							}
						}
					}).catch(res => {
						this.commentChoose = false
					})
				//comment	
				this.$http.get('http://cache.zhibo8.cc/json/'+newsTime+'/news/'+classes+'/'+contentId+'_hot.htm')
					.then(res => {
						this.hotComment = res.data
						for(let i =0; i < this.hotComment.length;i++){
							if (this.hotComment[i].device === '' || this.hotComment[i].device === null) {
								this.hotComment[i].device = 'pc-PC'
							}
						}												
					}).catch(res => {
						this.commentChoose = false
					})	
			},
			dianzan1(item){
				if (item.userid == 0) {
					item.up++
					item.userid = '1'	
				} 
			},
			dianzan2(item){
				if (item.userid == 0) {
					item.down++
					item.userid = '1'	
				} 
			},
		},
		watch: {

		}				
	}
</script>

<style lang='scss' scoped>
	@import '../style/headline'
</style>

