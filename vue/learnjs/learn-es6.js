/**
 * Created by msi on 2017/6/14.
 */
{
    //let声明的变量只在本轮循环有效
    var a=[]
    var b=[]
    for(var i=0;i<10;i++){
        a[i] = function () {
            console.log(i)
        }
    }
    for(let i =0;i<10;i++){
        b[i] = function () {
            console.log(i)
        }
    }
    a[6]()
    b[6]()
    //var需要用闭包实现
    var c=[]
    for (var i=0;i<10;i++){
        c[i] = (function (n) {
            return function () {
                console.log(n)
            }
        })(i)
    }
    c[6]()
}
{

}