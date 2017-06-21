/**
 * Created by msi on 2017/6/8.
 */

{
    const PI = Math.PI
    var base = document.getElementById("base")
    var ctx
    if (base.getContext){
        ctx = base.getContext('2d')
    }
    //笑脸
    ctx.beginPath()
    ctx.arc(50,50,50,0,2*PI,true)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(30,30,5,0,2*PI,true)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(70,30,5,0,2*PI,true)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(50,50,30,0,PI,false)
    ctx.stroke()


    //贝塞尔曲线
    ctx.beginPath()
    ctx.moveTo(175,45)
    ctx.quadraticCurveTo(150,0,125,45)
    ctx.stroke()


    //文本
    ctx.font="48px serif"
    ctx.fillText("hello world",200,48)
    ctx.strokeText("hello world",200,96)

    //样式
    for (var i=0;i<6;i++){
        for (var j=0;j<6;j++){
            ctx.strokeStyle =`rgb(0,${Math.floor(255-42.5*i)},${Math.floor(255-42.5*j)})`;
            ctx.beginPath();
            ctx.arc(12.5+j*25,112.5+i*25,10,0,Math.PI*2,true);
            ctx.stroke();
        }
    }

    for (var i=0;i<6;i++){
        for (var j=0;j<6;j++){
            ctx.fillStyle = 'rgb(' + Math.floor(255-42.5*i) + ',' +
                Math.floor(255-42.5*j) + ',0)';
            ctx.fillRect(j*25+200,i*25+100,25,25);
        }
    }



    ctx.beginPath()
    ctx.fillStyle="rgb(255,211,0)"
    ctx.fillRect(0,280,50,50)
    ctx.fillStyle="rgb(102,204,0)"
    ctx.fillRect(50,280,50,50)
    ctx.fillStyle="rgb(0,153,255)"
    ctx.fillRect(0,330,50,50)
    ctx.fillStyle="rgb(255,51,0)"
    ctx.fillRect(50,330,50,50)


    ctx.fillStyle = 'rgba(255,255,255,0.2)'

    for (var i=0;i<7;i++){
        ctx.beginPath()
        ctx.arc(50,330,10+10*i,0,2*PI,true)
        ctx.fill()
    }
}
{
    //ball
    const  PI = Math.PI
    var ball = document.getElementById("ball")
    var ctx = ball.getContext('2d')
    ctx.beginPath()
    ctx.arc(400,100,10,0,2*PI,true)
    ctx.fill()


}
