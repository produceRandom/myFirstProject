		var commodity = []
		for(let i=2;i<38;i++){
			let img_url = `../IMG/commodity/${i}.png`
			commodity.push({"imgurl":img_url,"seen":true})
		}
		var home = new Vue({
			el:".main",
			data:{
				commodity
			},
			methods:{
				toggleModal:function(item){
					commodity.forEach(function(value,index){
						value.seen = true
					})
					item.seen  = false
				}
			}
		})