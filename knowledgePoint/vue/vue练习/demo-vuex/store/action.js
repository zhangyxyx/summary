//处理vuex action操作信息
//异步逻辑
//存放store的核心处理函数

//把将要修改的值发送到mutation中，
//值只允许mutations中修改
export const fun=({commit})=>{
	commit({
		type:'getMsg',
		msg:'我是修改的数据'
	})
}