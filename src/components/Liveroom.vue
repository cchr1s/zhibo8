<template>
	<div class="global">
		<header>
			<div class="back">
				<span @click="$router.push({name:'index'})">ㄑ</span>
			</div>
			<div class="sub">
				<h2>{{liveInfo.name}}</h2>
			</div>
		</header>
		<div class="title">
			<div class="home" v-if='!showTitle'>
				<div><img :src="'http://duihui.qiumibao.com/' + liveInfo.type +'/'+ liveInfo.home_logo+'.png'" alt="" :onerror="errorImg01"></div>
				<div class="home_team">{{liveInfo.home_team}}</div>
				<div class="support_home">
					<span >主</span>
					<span><img src="/static/img/zan.png" alt=""></span>
					<span>{{support.homenum}}</span>
				</div>
			</div>
			<div class="score">
				<div v-if='!showTitle'>{{matchData.home_score}} - {{matchData.visit_score}}</div>
				<div v-if='showTitle' class='showTitle'>{{matchData.title}}</div>
				<div class="state" v-if="matchData.pid_text">{{matchData.pid_text}}</div>
				<div class="state" v-if="!showTitle && !matchData.pid_text ">未开始</div>
				<div class="livevideo">
					<span>视频直播</span>
				</div>
			</div>
			<div class="visit" v-if='!showTitle'>
				<div><img :src="'http://duihui.qiumibao.com/' + liveInfo.type +'/'+ liveInfo.visit_logo+'.png'" alt="" :onerror="errorImg02"></div>
				<div class="visit_team">{{liveInfo.visit_team}}</div>
				<div class="support_visit">
					<span>{{support.visitnum}}</span>
					<span><img src="/static/img/zan.png" alt=""></span>
					<span>客</span>	
				</div>
			</div>			
		</div>
		<div class="rate">
			<span :style="'width:'+rate_home"></span>
			<span :style="'width:'+rate_visit"></span>
		</div>
		<div class="content" >
			<ul>
				<li class= 'isActive' :class="active" @click='toggleTabs($event)'>直播</li>
				<li :class="active" @click='toggleTabs($event)'>首发</li>
				<li :class="active" @click='toggleTabs($event)'>数据</li>
				<li :class="active" @click='toggleTabs($event)'>评论{{commentnum}}</li>
				<li :class="active" @click='toggleTabs($event)'>动图</li>
			</ul>
			<div class='live' v-if="islivecontent">
				<div v-for='(item, index) in liveData' class='liveitem' v-if="liveData">
					<div class='host'>
						<div class='hostname'>{{item.user_chn}}</div>
						<div class='time'>{{item.live_time.split(' ')[1].substring(0,5)}}</div>
					</div>
					<div class='livecontent'>{{item.live_text}}</div>
				</div>
				<div v-if="!liveData" class="nodata">
					暂无数据
				</div>			
			</div>
			<div class='shoufa' v-if="isshoufa">
				<div v-if="!shoufa.data|| !shoufa.coach" class='nodata'>
					暂无相关数据
				</div>
				<div class='home' v-if="shoufa.data">
					<div class='team_name'>{{liveInfo.home_team}}</div>
					<div class='coach' >{{shoufa.coach[0]}}</div>
					<ul>
						<li v-for='(item, index) in shoufa.data[shoufa.homeid]'>
							<table>
								<tbody>
									<tr v-if="item.status_cn === '首发'">
										<td class="position" >{{item.position_long_cn}}</td>
										<td class="playername">{{item.player_name_cn}}</td>
										<td class='playernumber'>{{item.shirt_number}}</td>
									</tr>
								</tbody>
							</table>
						</li>
					</ul>
				</div>
				<div class='visit' v-if="shoufa.data">
					<div class='team_name'>{{liveInfo.visit_team}}</div>
					<div class='coach'>{{shoufa.coach[1]}}</div>
					<ul>
						<li v-for='(item, index) in shoufa.data[shoufa.visitid]'>
							<table>
								<tbody>
									<tr v-if="item.status_cn === '首发'">
										<td class="position" >{{item.position_long_cn}}</td>
										<td class="playername">{{item.player_name_cn}}</td>
										<td class='playernumber'>{{item.shirt_number}}</td>
									</tr>
								</tbody>
							</table>
						</li>
					</ul>
				</div>
			</div>
			<div class='totalData' v-if="istotalData">
				<div v-if='!isfootballData && !isnbaData' class="nodata">
					暂无相关数据
				</div>
				<div class='title'>
					<span v-if="isfootballData">{{liveInfo.home_team}}</span>
					<span v-if="isnbaData">比赛统计</span>
					<span v-if="isfootballData">{{liveInfo.visit_team}}</span>
				</div>
				<ul v-if="isfootballData">
					<li v-for='(item, index) in totalData.info'>
						<div class='data'>
							<span>{{totalData.data.home[totalData.infokey[index]]}}</span>
							<span>{{totalData.data.visit[totalData.infokey[index]]}}</span>
						</div>
						<div class='cate'>
							<span :style="{'background-position':totalData.position[index]}"></span>
							<p>{{item}}</p>
						</div>
						<div class='rate'>
							<div class='homerate'>
								<div class='homerate1' :style="{'width': totalData.homerate[index]}"></div>
							</div>
							<div class='visitrate'>
								<div class='visitrate1' :style="{'width': totalData.visitrate[index]}"></div>
							</div>
						</div>
					</li>
				</ul>
				<table v-if="isnbaData">
					<tbody>
						<tr>
							<td></td>
							<td>{{liveInfo.visit_team}}</td>
							<td>{{liveInfo.home_team}}</td>
						</tr>
						<tr>
							<td>剩余暂停</td>
							<td>{{nbaData.full_timeouts_2}}</td>
							<td>{{nbaData.full_timeouts_1}}</td>
						</tr>
						<tr>
							<td>本节犯规</td>
							<td>{{nbaData.team_fouls_2}}</td>
							<td>{{nbaData.team_fouls_1}}</td>
						</tr>
					</tbody>
				</table>
				<table v-if="isnbaData">
					<tbody>
						<tr>
							<td style="background:#fd6b3f;color:#fff">球队</td>
							<td v-for="item in [1,2,3,4]">第{{item}}节</td>
							<td>全场</td>
						</tr>
						<tr>
							<td>{{liveInfo.visit_team}}</td>
							<td v-for="item in [0,1,2,3]">{{nbaData.team2_scores[item]}}</td>
							<td>{{nbaData.visit_score}}</td>
						</tr>
						<tr>
							<td>{{liveInfo.home_team}}</td>
							<td v-for="item in [0,1,2,3]">{{nbaData.team1_scores[item]}}</td>
							<td>{{nbaData.home_score}}</td>
						</tr> 
					</tbody>
				</table>
			</div>
			<div class='comment' v-if="iscomment">
				<h4 v-if='!hotComment.length == 0'>{{commentInfo}}</h4>
				<h3 v-if='!commentChoose'>期待您的热评</h3>
				<div v-for="(item, index) in hotComment" class="list">
					<img :src="item.figureurl" alt="">
					<div class="zan">
						<img src="/static/img/zan.png" alt="" class="up">
						<span>{{item.up}}</span>
						<img src="/static/img/zan.png" alt="" class="down">
						<span>{{item.down}}</span>
					</div>
					<div class="detail">
						<div class='username'>{{item.username}}</div>
						<div class="time">{{item.updatetime}}&nbsp;&nbsp;来自{{item.device.split('-')[1]}}</div>
						<div class="info">{{item.content}}</div>
					</div>
				</div>

				<h4>最新评论</h4>
				<div v-for="(item, index) in latestComment" class="list">
					<img :src="item.figureurl" alt="">
					<div class="zan">
						<img src="/static/img/zan.png" alt="" class="up">
						<span>{{item.up}}</span>
						<img src="/static/img/zan.png" alt="" class="down">
						<span>{{item.down}}</span>
					</div>
					<div class="detail">
						<div class='username'>{{item.username}}</div>
						<div class="time">{{item.updatetime}}&nbsp;&nbsp;来自{{item.device.split('-')[1]}}</div>
						<div class="info">{{item.content}}</div>
					</div>
				</div>
			</div>
			<div class="gallery" v-if='isgallery'>
				<div v-if='!liveInfo.gallery_url' class="nodata">
					暂无相关信息
				</div>
				<ul v-if='liveInfo.gallery_url'>
					<li v-for="(item, index) in gallery.list">
						<div class='title'>{{item.title}}</div>
						<div class="img">
							<img :src="item.thumbnail_url" alt="" v-if='!gifplay'>
							<span v-if='!gifplay' @click='gifPlay($event, item)'>GIF ►</span>
							<img alt="" v-show='gifplay'>							
						</div>
					</li>
				</ul>
			</div>
		</div>		
	</div>	
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import VueViewload from 'vue-viewload'
	Vue.use(VueViewload)
	Vue.prototype.$http = axios

	export default{
		name: 'cc',
		data(){
			return{
				showTitle : false, //whole home visit module
				liveInfo: {
					name: '',
					type: '',
					home_team: '',
					home_logo:'',
					visit_team: '',
					visit_logo: '',
					show_textlive: false,
				},
				matchData: {
					home_score: '',
					visit_score: '',
					pid_text: '',
					title: '',
				},
				support: {
					homenum: 2869,
					visitnum: 1342,
				},
				rate_home: '50%',
				rate_visit: '50%',
				errorImg01 : 'this.src="/static/img/host.png"',
      			errorImg02 : 'this.src="/static/img/visit.png"',
      			active: '',
      			liveData: [],
      			commentnum: 0,
      			iscomment: false,
      			islivecontent: true,
      			commentChoose: true,
      			commentInfo: '热门评论',
				hotComment: [],
				latestComment: [],
				shoufa: {
					homeid: '',
					visitid: '',
					coach: [],
					data: {}
				},
				isshoufa: false,
				istotalData: false,
				isfootballData: false,
				isnbaData: false,
				isgallery: false,
				totalData: {
					info: ['射门','射正','射中门框','传球','直塞','越位','抢断','任意球','犯规','传球成功率','传中成功率','抢断成功率','头球成功率','控球率','角球'],
					infokey: ['total_scoring_att', 'ontarget_scoring_att','post_scoring_att','total_pass','total_through_ball','total_offside','total_tackle','fk_foul_won','fk_foul_lost','pass_percentage','aerial_percentage','tackle_percentage','cross_percentage','possession_percentage','won_corners'],	
					position:['-78px','-144px', '-219px', '-287px','-898px','-968px', '-569px', '-713px','-437px','-360px','-789px','-642px','-847px','-78px','-497px'],
					data: {
						home: {},
						visit: {}
					},
					homerate: [],
					visitrate: []
				},
				nbaData: {},
				gallery: [],
				gifplay: false
			}
		},
		created(){
			this.getData()
		},
		computed:{
			
		},
		mounted(){
			//support rate
			this.rate_home = Math.round((this.support.homenum /(this.support.homenum + this.support.visitnum)) * 100)+'%'
			this.rate_visit = 100 - Math.round((this.support.homenum /(this.support.homenum + this.support.visitnum)) * 100) +'%'

			window.removeEventListener('scroll', () => {
				console.log('remove')
			}, false)
		},
		methods: {
			getData(){
				let matchId =  this.$router.currentRoute.fullPath.split('/')[2]
				//let id = this.$router.currentRoute.fullPath.split('/')[3]
				if (/^[0-9]{6}$/.test(matchId) || /^[0-9]{5}$/.test(matchId)) {
					this.$http.get('http://m.zhibo8.cc/json/match/'+ matchId +'.htm')
						.then(res => {
							console.log(res.data)
							let type = res.data.type
							let id = res.data.zhibo_url.split('/')[res.data.zhibo_url.split('/').length-1].substring(0, res.data.zhibo_url.split('/')[res.data.zhibo_url.split('/').length - 1].indexOf('.'))
							let time = res.data.zhibo_url.split('/')[3]
							let show_textlive = res.data.show_textlive
							let pinglun =  res.data.pinglun.split('-')[2]
							let match_date = res.data.match_date
							let gallery_url = res.data.gallery_url

							this.liveInfo = {
								name: res.data.league.name_cn,
								type: res.data.type,
								home_team: res.data.home_team,
								home_logo: res.data.home_logo,
								visit_team: res.data.visit_team,
								visit_logo: res.data.visit_logo,
								show_textlive: res.data.show_textlive,
								gallery_url : res.data.gallery_url
							}

							//update livedata
							if (this.liveData) {
								live()
								setInterval(liveData, 3000)
							}else{
								//bifen
								this.$http.get('http://bifen4m.qiumibao.com/json/list.htm')
									.then(res => {
										for(let i =0; i < res.data.list.length;i++){
											if (res.data.list[i].id === matchId ) {
												this.matchData = {
													home_score: res.data.list[i].home_score,
													visit_score: res.data.list[i].visit_score,
													pid_text: res.data.list[i].period_cn,
												}
											}
										}
									})
									.catch(err =>{
										console.log(err)
									})
							}							
							shoufaAndData(type, match_date, matchId)
							comment(time, type, id)
							gallery(gallery_url, match_date, matchId)
							
						}).catch(err => {
							console.log(err)
						})

					var shoufaAndData = (type, match_date, matchId) => {
						//shoufa-shuju
						let home_visit_id = []
						if (type == 'zuqiu') {
							this.isfootballData = true
							this.$http.get('https://dc4pc.qiumibao.com/dc/matchs/data/'+match_date+'/match_lineup_'+matchId+'.htm?get='+Math.random())
								.then( res => {
									var keyArray = []
									for(var val in res.data){
										keyArray.push(val)
									}
									this.shoufa.homeid = keyArray[0]
									this.shoufa.visitid = keyArray[1]
									this.shoufa.coach.push(res.data.coach[keyArray[0]])
									this.shoufa.coach.push(res.data.coach[keyArray[1]])
									this.shoufa.data = res.data.data
									home_visit_id.push(keyArray[0])
									home_visit_id.push(keyArray[1])
								}).catch(err=>{
									console.log(err)
									this.shoufa.data = ''
								})
							
							this.$http.get('https://dc4pc.qiumibao.com/dc/matchs/data/'+match_date+'/match_team_statics_'+matchId+'.htm?'+Math.random())
								.then( res =>{
									this.totalData.data.home = res.data.data[home_visit_id[0]]
									this.totalData.data.visit = res.data.data[home_visit_id[1]]
									//compute the rate
									for(let i = 0; i < this.totalData.infokey.length; i++){
										if (/^[0-9]*$/.test(this.totalData.data.home[this.totalData.infokey[i]])) {
											var rate1 = Number(this.totalData.data.home[this.totalData.infokey[i]]) / (Number(this.totalData.data.home[this.totalData.infokey[i]]) + Number(this.totalData.data.visit[this.totalData.infokey[i]]))
											this.totalData.homerate.push(rate1 * 100 + '%')
										} 
										if (String(this.totalData.data.home[this.totalData.infokey[i]]).substr(-1) === '%') {
											var rate2 = this.totalData.data.home[this.totalData.infokey[i]]
											this.totalData.homerate.push(rate2)
										}
										if (this.totalData.data.home[this.totalData.infokey[i]] === '-') {
											var rate3 = '100%'
											this.totalData.homerate.push(rate3)
										}
									}

									for(let i = 0; i < this.totalData.infokey.length; i++){
										if (/^[0-9]*$/.test(this.totalData.data.visit[this.totalData.infokey[i]])) {
											var rate1 = Number(this.totalData.data.visit[this.totalData.infokey[i]]) / (Number(this.totalData.data.home[this.totalData.infokey[i]]) + Number(this.totalData.data.visit[this.totalData.infokey[i]]))
											this.totalData.visitrate.push(rate1 * 100 + '%')
										} 
										if (String(this.totalData.data.home[this.totalData.infokey[i]]).substr(-1) === '%') {
											var rate2 = this.totalData.data.visit[this.totalData.infokey[i]]
											this.totalData.visitrate.push(rate2)
										}
										if (this.totalData.data.home[this.totalData.infokey[i]] === '-') {
											var rate3 = '0%'
											this.totalData.visitrate.push(rate3)
										}
									}
								}).catch(err=>{
									console.log(err)
									//alert('')
								})
						} else {
							this.shoufa.data = ''
						}

						if (type == 'nba') {								
							this.$http.get('https://bifen4pc2.qiumibao.com/json/'+match_date+'/'+matchId+'.htm?get='+Math.random()).then(res => {
								if (res.data) {
									this.isnbaData = true
									this.nbaData = res.data
								}
							}).catch(err => {
								console.log(err)
							})
						}
					}	

					var comment = (time, type, id) =>　{
						//hotcomment
						// id -> pinglun
						this.$http.get('https://cache.zhibo8.cc/json/' + time + '/' + type + '/' + id + '_hot.htm?key=' + Math.random())
							.then(res => {
								this.hotComment = res.data
								for(let i =0; i < this.hotComment.length;i++){
									if (this.hotComment[i].device === '' || this.hotComment[i].device === null) {
										this.hotComment[i].device = 'pc-PC'
									}
								}												
							}).catch(err => {
								//this.commentChoose = false
							})

						this.$http.get('https://cache.zhibo8.cc/json/'+ time + '/' + type + '/' + id +'_count.htm?key=' + Math.random())
							.then(res => {
								this.commentnum = res.data.root_num
								
								//lastest comment
								let page = Math.floor((this.commentnum / 100))
								this.$http.get('https://cache.zhibo8.cc/json/'+ time + '/' + type + '/' + id +'_'+page+'.htm?key=' + Math.random())
									.then(res => {
										this.latestComment = res.data
										for(let i =0; i < this.latestComment.length;i++){
											if (this.latestComment[i].device === null || this.latestComment[i].device === ''){
												this.latestComment[i].device = 'pc-PC' 
											}
										}
									}).catch(err => {
										console.log(err)
									})

							}).catch(err => {
								console.log(err)
							})
					}

					//initialization display
					var live = () =>{
						this.$http.get('https://dingshi4pc.qiumibao.com/livetext/data/cache/max_sid/'+ matchId +'/0.htm?time='+Math.random())
							.then(res => {
								var item = res.data								
								if(item %2 !==0){
									item = item +1
								}
								this.$http.get('http://dingshi4pc.qiumibao.com/livetext/data/cache/livetext/'+ matchId +'/0/lit_page_'+2+'/'+item+'.htm?get='+Math.random())
									.then(res => {
										this.matchData = {
											home_score: res.data[0].home_score,
											visit_score: res.data[0].visit_score,
											pid_text : res.data[0].pid_text
										}
										for(let i= 0;i < res.data.length;i++){
											//filter number
											if (!(/^[0-9]*$/.test(res.data[i]))) {
												this.liveData.unshift(res.data[i]) //reverse
											}
										}
									}).catch(err =>{
										console.log(err)
									})
							}).catch(err => {
								this.liveData = ''
								console.log(err)
							})
					}

					//liveData
					var itemArray = []
					itemArray[0] = 1
					var liveData = () => {
						this.$http.get('https://dingshi4pc.qiumibao.com/livetext/data/cache/max_sid/'+ matchId +'/0.htm?time='+Math.random())
							.then(res => {
								itemArray[1] = res.data
								//console.log(itemArray)
								if (itemArray[1] !== itemArray[0]) {
									let item = itemArray[1]
									if(item %2 ==0){
										console.log(item)
										this.$http.get('http://dingshi4pc.qiumibao.com/livetext/data/cache/livetext/'+ matchId +'/0/lit_page_'+2+'/'+item+'.htm?get='+Math.random())
											.then(res => {
												this.matchData = {
													home_score: res.data[0].home_score,
													visit_score: res.data[0].visit_score,
													pid_text : res.data[0].pid_text
												}
												for(let i= 0;i < res.data.length;i++){
													//filter number
													if (!(/^[0-9]*$/.test(res.data[i]))) {
														this.liveData.unshift(res.data[i]) //reverse
													}
												}
											}).catch(err =>{
												console.log(err)
											})
									}
								}
								itemArray.splice(0, 1)
							}).catch(err => {
								this.liveData = ''
								console.log(err)
							})	
					}

					//gallery
					var gallery = (gallery_url, match_date, matchId) => {
						if (gallery_url){
							this.$http.get('http://m.zhibo8.cc/json/gallery/'+match_date+'/'+matchId+'.htm').then(res => {
								this.gallery = res.data.data
							})
						} 
					}

				} else{
					this.liveData = ''
					this.shoufa.data = ''
					this.showTitle = true
					this.liveInfo.name = decodeURI(matchId)
					this.matchData.title = decodeURI(matchId)
				}
			},			
			toggleTabs(e){
				for(let i = 0; i < e.target.parentNode.children.length; i++){
					e.target.parentNode.children[i].className = ''
				}				
				e.target.className = 'isActive'

				if(e.target.innerHTML.substring(0, 2) == '评论'){
					this.iscomment = true;
					this.islivecontent = false
					this.isshoufa = false
					this.istotalData = false
					this.isgallery = false
				}
				if(e.target.innerHTML == '直播'){
					this.iscomment = false;
					this.islivecontent = true
					this.isshoufa = false
					this.istotalData = false
					this.isgallery = false
				}
				if(e.target.innerHTML == '首发'){
					this.iscomment = false;
					this.islivecontent = false
					this.isshoufa = true
					this.istotalData = false
					this.isgallery = false
				}
				if(e.target.innerHTML == '数据'){
					this.iscomment = false;
					this.islivecontent = false
					this.isshoufa = false
					this.istotalData = true
					this.isgallery = false
				}
				if(e.target.innerHTML == '动图'){
					this.iscomment = false;
					this.islivecontent = false
					this.isshoufa = false
					this.istotalData = false
					this.isgallery = true
				}
			},
			gifPlay(e, item){
				e.target.parentNode.lastChild.style.display = 'block'
				e.target.parentNode.lastChild.setAttribute('src', item.url)
				e.target.parentNode.firstChild.style.display = 'none'
				e.target.style.display = 'none'
			}
		},
		watch:{

		}
	}
</script>

<style lang='scss' scoped>
	@import '../style/liveroom'
</style>

http://up.qiumibao.com/count/getResult.php?jsoncallback=jQuery17202504593513219471_1500360698998&filenames=match_102346_host%2Cmatch_102346_visit&_=1500360699178

https://dingshi4pc.qiumibao.com/livetext/data/cache/livetext/101110/0/lit_page_2/306.htm?get=0.20165658904032657

https://dingshi4pc.qiumibao.com/livetext/data/cache/livetext/101635/0/lit_page_2/622.htm?get=0.7921778563295707

https://dingshi4pc.qiumibao.com/livetext/data/cache/livetext/101563/0/lit_page_2/170.htm?get=0.8197598989360981

http://cache.zhibo8.cc/json/2017/zuqiu/0722shanghaishanggangvsguangzhouhengda_hot.htm?random=0.5345555694623416

https://dc4pc.qiumibao.com/dc/matchs/data/2017-07-22/match_lineup_102182.htm?get=0.43966598853101435

https://dc4pc.qiumibao.com/dc/matchs/data/2017-07-22/match_team_statics_102182.htm?get=0.39952787958747793
http://dc4pc.qiumibao.com/dc/matchs/data/2017-07-22/match_event_102182.htm?get=0.5526928354681742
https://bifen4pc2.qiumibao.com/json/2017-07-27/103245.htm?get=0.3438707904273235