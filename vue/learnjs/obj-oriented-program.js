/**
 * Created by msi on 2017/6/7.
 */

console.log('---构造函数---')
{
    function Student(name) {
        this.name = name;
        this.hello = function () {
            console.log(`hello, ${this.name}`)
        }
    }
    var xiaoming = new Student('xiaoming')
    xiaoming.hello()
    var test = new Student('test')
    console.log(xiaoming.hello === test.hello)

}
{
    console.log('----创建基于原型的对象----')
    function Student(name) {
        this.name = name
    }
    Student.prototype.hello = function () {
        console.log(`hello, ${this.name}`)
    }
    var xiaoming = new Student('xiaoming')
    xiaoming.hello()
    var test = new Student('test')
    console.log(xiaoming.hello === test.hello)
}
{
    console.log("---使用ES6的class写法---")
    class Student{
        constructor(obj){
            this.name = obj.name
        }
        hello(){
            console.log(`hello, ${this.name}`)
        }
    }
    var xiaoming = new Student('小明')
    xiaoming.hello()
}
{
    console.log('---使用class实现继承---')
    class Student{
        constructor(name){
            this.name = name
        }
        hello(){
            console.log(`hello, ${this.name}`)
        }
    }
    class PrimaryStudent extends Student{
        constructor(name,grade){
            super(name);
            this.grade = grade
        }
        showGrade(){
            console.log(`${this.name} is at grades ${this.grade}`)
        }
    }
    var xiaoming = new PrimaryStudent('小明',3)
    xiaoming.showGrade()

}

