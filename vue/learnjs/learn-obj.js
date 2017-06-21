//初步
var xiaoming = {
    name:"小明",
    birth:1995,
    age:function () {
        var y = new Date().getFullYear()
        return y - this.birth
    },
    height:180,
    weight:65,
    job:"web"
}



//删除
console.log("----删除----")
console.log(xiaoming.age())
delete xiaoming.age
console.log(xiaoming.age)

//判断属性是否存在
console.log("----判断属性是否存在----")
{
    let result = "name" in xiaoming
    console.log(result)
}
{
    let result = "scholl" in xiaoming
    console.log(result)
}
{
    let result = "toString" in xiaoming
    console.log(result)
}
//判断是否是自身的属性
console.log("----判断是否自身属性----")
{
    let result = xiaoming.hasOwnProperty("name")
    console.log(result)
}
{
    let  result = xiaoming.hasOwnProperty("toString")
    console.log(result)
}

//关于方法（关于this）
console.log("----关于方法（关于this）----")

function  getAge() {
    var y = new Date().getFullYear()
    return y-this.birth
}

xiaoming.age = getAge
//此时获取age只能用xiaoming.age()，直接运行getAge会无值，因为函数中this指向问题
console.log(`用xiaoming.age()方式调用:${xiaoming.age()},\n直接运行getAge():${getAge()}`)

//或者可以通过以下方式调用,注：apply和call的唯一区别是，apply传入一个参数的数组，call是把参数按顺序传入，没参数就留空
console.log("或者可以通过以下方式调用:")
console.log(`运行getAge.apply(xiaoming,[]):${getAge.apply(xiaoming,[])}`)
console.log(`运行getAge.call(xiaoming):${getAge.call(xiaoming)}`)

{
    console.log("---关于数字的toString---")
    console.log(`用123..toString(两个点):${123..toString()} \n或者用(123).toString()：${(123).toString()}`)
}
