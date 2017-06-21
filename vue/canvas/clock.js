/**
 * Created by msi on 2017/6/9.
 */

var clock =document.getElementById('clock')
var ctx = clock.getContext('2d')
var r = clock.clientWidth/2
var width = clock.clientWidth
var height = clock.clientHeight
var PI = Math.PI
function sin(angle) {
    return Math.sin((angle*2*PI)/360).toFixed(5)
}
function cos(angle) {
    return Math.cos((angle*2*PI)/360).toFixed(5)
}
function drawLittleCircle(x,y,r,color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x,y,r,0,2*PI,true)
    ctx.fill()
}

function drawBackground() {
    ctx.save()
    ctx.translate(r,r)
    ctx.beginPath()
    ctx.lineWidth = 10

    ctx.arc(0,0,r-5,0,2*PI,true)
    ctx.stroke()


    for (let i = 1;i<=60;i++){
        if (i %5 ==0){
            drawLittleCircle(cos(6*i)*(r-30),sin(6*i)*(r-30),10,"#333")
        }else {
            drawLittleCircle(cos(6*i)*(r-30),sin(6*i)*(r-30),7,"#ccc")
        }
    }

    for (let i = 1;i<=12;i++){
        ctx.beginPath()
        ctx.font='32px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${((i+3)%12 == 0)?12:(i+3)%12}`,cos(30*i)*(r-60),sin(30*i)*(r-60))
    }
}


function drawTimes(hour,minute,second) {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 8
    ctx.fillStyle = "#111"
    ctx.lineCap = "round"
    ctx.rotate((hour%12 + minute/60 )*30*(PI/180))
    ctx.moveTo(0,10)
    ctx.lineTo(0,-r/3)
    ctx.stroke()
    ctx.restore()
    drawMinute(minute,second)
}
function drawMinute(minute,second) {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 6
    ctx.fillStyle = "#111"
    ctx.lineCap = "round"
    ctx.rotate((minute%60 + second/60)*6*(PI/180))
    ctx.moveTo(0,10)
    ctx.lineTo(0,-r/2)
    ctx.stroke()
    ctx.restore()
    drawSecond(second)
}

function drawSecond(second) {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.strokeStyle = "rgb(250,54,26)"
    ctx.lineCap = "round"
    ctx.rotate((second%60)*6*(PI/180))
    ctx.moveTo(0,15)
    ctx.lineTo(0,-r+37)
    ctx.stroke()
    ctx.restore()
}
function draw() {
    ctx.clearRect(0,0,width,height)
    var now = new Date()
    var hour = now.getHours()
    var minute=now.getMinutes()
    var second = now.getSeconds()
    drawBackground();
    drawTimes(hour,minute,second)
    drawLittleCircle(0,0,5,"#fff")
    ctx.restore()
}

setInterval(draw,1000)






