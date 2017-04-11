//->计算BOX在页面中,不超出页面情况下,四个方向的边界值
var oBox = document.getElementById("box");
var minL = 0,
    minT = 0,
    maxL = (document.documentElement.clientWidth || document.body.clientWidth) - oBox.offsetWidth,
    maxT = (document.documentElement.clientHeight || document.body.clientHeight) - oBox.offsetHeight;

//->开始实现拖拽效果
on(oBox, "mousedown", down);
function down(ev) {
    //this->oBox
    this["strX"] = ev.pageX;
    this["strY"] = ev.pageY;
    this["strL"] = this.offsetLeft;
    this["strT"] = this.offsetTop;
    this["MOVE"] = move.myBind(this);
    this["UP"] = up.myBind(this);
    on(document, "mousemove", this["MOVE"]);
    on(document, "mouseup", this["UP"]);

    //->鼠标按下结束所有当前盒子正在运行的动画
    window.clearInterval(this.flyTimer);
    window.clearInterval(this.dropTimer);
}
function move(ev) {
    var curL = ev.pageX - this["strX"] + parseFloat(this["strL"]);
    var curT = ev.pageY - this["strY"] + parseFloat(this["strT"]);
    curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
    curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
    this.style.left = curL + "px";
    this.style.top = curT + "px";

    //->计算水平方向运动的速度
    if (!this["prev"]) {
        this["prev"] = this.offsetLeft;
    } else {
        this["speedFly"] = this.offsetLeft - this["prev"];
        this["prev"] = this.offsetLeft;
    }
}
function up(ev) {
    //this->oBox
    off(document, "mousemove", this["MOVE"]);
    off(document, "mouseup", this["UP"]);

    //->开始水平方向的运动
    //fly.call(this);

    //->开始垂直方向的运动
    //drop.call(this);
}

//->水平方向的动画
function fly() {
    var _this = this,
        speedFly = _this["speedFly"];
    _this.flyTimer = window.setInterval(function () {
        //->当速度的绝对值已经小于0.5,每一次即使加上速度,下一次_this.offsetLeft获取的结果依然是上一次获取的结果，不会在变；此时我们结束动画
        if (Math.abs(speedFly) < 0.5) {
            window.clearInterval(_this.flyTimer);
            return;
        }

        speedFly *= 0.98;//->速度衰减
        var curL = _this.offsetLeft + speedFly;
        if (curL > maxL) {
            curL = maxL;
            speedFly *= -1;
        } else if (curL < minL) {
            curL = minL;
            speedFly *= -1;
        }
        _this.style.left = curL + "px";
    }, 10);
}

//->垂直方向的动画
function drop() {
    var _this = this, speedDrop = 9.8, flag = 0;
    _this.dropTimer = window.setInterval(function () {
        //->到达地面让FLAG累加，不在地面重新置为零，当再也弹不起来的时候,FLAG会累加下去，此时结束动画即可
        if (flag > 1) {
            window.clearInterval(_this.dropTimer);
            return;
        }
        speedDrop += 10;
        speedDrop *= 0.98;
        var curT = _this.offsetTop + speedDrop;
        if (curT > maxT) {
            curT = maxT;
            speedDrop *= -1;
            flag++;
        } else {
            flag = 0;
        }
        _this.style.top = curT + "px";
    }, 10);
}


/*--基于拖拽的抛物线运动(水平方向运动和垂直方向的自由落体运动同时运行)的弹性势能动画--*/
//->水平方向运动的距离以及快慢取决于：手即将松开的一瞬间，我们移动盒子的速度快与慢，最后一瞬间移动的速度快，最后松开的一瞬间移动的距离就会变长，水平速度也会增大；最后一瞬间移动的速度慢，最后松开的一瞬间移动的距离就会变短，水平速度也会减小；
//->浏览器都存在一个最短的反应时间或者是处理时间,例如：不是稍微移动，浏览器就会处理一次，而是在一定时间内，浏览器反应过来你移动了才会处理一次




