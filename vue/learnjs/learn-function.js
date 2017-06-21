/*本部分包含数组的方法*/


function  dobule(num) {
    return num*2
}
function  add(x,y,f) {
    return f(x) + f(y)
}

var result = add(2,3,dobule)

console.log(result)

//map

{
    console.log("----map----")
    let arr = [1,2,3,4,5,6,7,8,9]
    function square(x) {
        return x*x
    }
    {
        let result = arr.map(square)
        console.log(result)
    }
    console.log(arr.map(String))
}

//reduce
{
    console.log("---reduce---")
    let arr = [1,2,3,4]
    let result = arr.reduce(function (x,y) {
        return x*y
    })
    console.log(result)

    let result2 = arr.reduce(function (x,y) {
        return x*10 + y
    })
    console.log(result2)
}

//filter
{
    console.log("---filter---")
    let arr =[1,2,3,4,5,6,7,8,9,10,16,22,145]
    let result = arr.filter(function (element,index,self) {
        return element%2 !== 0
    })
    //filter的三个参数分别是array的某个元素，元素的位置，数组本身
    console.log(`过滤偶数的结果：${result}`)
}

//利用filter巧妙去除数组的重复元素
{
    let arr = ["zc","Zc","Zc","aa",123]
    let result = arr.filter(function (item,index,self) {
        return self.indexOf(item) === index     //由于indexOf方法总是返回元素位置的第一个索引，后续的重复元素位置与index不相等，就被过滤了
    })
    console.log(`过滤重复项的结果：${result}`)
}


//sort

{
    console.log("---sort---")
    let arr = [1,5,2,90,15,36,45,65,255]
    let res = arr.sort(function (x,y) {
        if(x>y)
            return 1;
        return 0;
    })
    console.log(`按从小到大排序的结果：${res}`)
}
{
    let arr = ['Google', 'apple', 'Microsoft'];
    var res =arr.sort(function (s1, s2) {
        x1 = s1.toLowerCase();
        x2 = s2.toLowerCase();
        if (x1 < x2) {
            return -1;
        }
        if (x1 > x2) {
            return 1;
        }
        return 0;
    });
    console.log(`按字母排序的结果：${res}`)
}


//闭包
{
    function sum(arr) {
        var add = function () {
            return arr.reduce(function (x,y) {
                return x+y
            })
        }
        return add
    }
    var f =sum([1,2,3])
    console.log(f())
}
{
    function count() {
        var arr = []
        for (var i=1;i<=3;i++){
            arr.push(function () {
                return i*i
            })
        }
        return arr
    }
    var res = count()
    console.log(`错误引用循环变量:${res[0]()},${res[1]()},${res[2]()}`)  //这种做法错误。返回函数不要引用任何循环变量或者后续会发生变化的变量
}
//如果一定要引用循环变量的办法
{
    function count() {
        let arr = []
        for (var i=1;i<=3;i++){
            arr.push((function (n) {
                return function () {
                    return n*n
                }
            })(i))
        }
        return arr
    }
    let res = count()
    console.log(`正确引用循环变量:${res[0]()},${res[1]()},${res[2]()}`)
}

//借助闭包封装私有变量

{
    function create_counter(initial) {
        var x = initial ? initial:0
        return{
            inc:function () {
                x +=1;
                return x
            }
        }
    }
    var c1 = create_counter()
    var c2 = create_counter(10)
    console.log(`c1.inc():${c1.inc()},${c1.inc()}`)
    console.log(`c2.inc():${c2.inc()},${c2.inc()}`)
}

//generator  ------ generator用'function*'声明，与函数不同的是generator可以用yield返回多次
{
    function* fib(max) {
        var t,a=0,b=1;
        for(var i=0;i<max;i++){
            yield  a;
            t=a+b;
            a=b;
            b=t;
        }
        return
    }
    var f=fib(5)
    console.log(`${JSON.stringify(f.next())},${JSON.stringify(f.next())},${JSON.stringify(f.next())}，${JSON.stringify(f.next())},${JSON.stringify(f.next())},${JSON.stringify(f.next())}`)
    for(var x of fib(5)){
        console.log(x)
    }
}
{

    function* next_id() {
        for(var x=1 ;x<100;x++){
            yield x
        }

    }
    //测试:
    var x,
        text="",
        g = next_id();
    for (var x = 1; x <= 50; x ++) {
        text += g.next().value + ","
    }
    text = text.substring(0,text.lastIndexOf(","))
    console.log(text)
}