/**
 * Created by xiao lei on 2016/5/15.
 */
var utils=(function(){
    var flag='getComputedStyle' in window;
    return {
        //listToArray:类数组转数组
        listToArray:function listToArray(arg){
            if(flag){
                return Array.prototype.slice.call(arg);
            }else{
                var ary=[];
                for(var i=0; i<arg.length; i++){
                    ary.push(arg[i]);
                }
                return ary;
            }
        },
        //jsonParse:JSON格式的字符串转JSON格式数据
        jsonParse:function jsonParse(str){
            return flag?JSON.parse(str):eval('('+str+')');
        },
        //getCss:获取非行间样式
        getCss:function getCss(curEle,attr){
            var val=null;
            var reg=null;
            if(flag){//高级浏览器
                val=getComputedStyle(curEle,null)[attr];
            }else{//低级浏览器
                if(attr=='opacity'){// alpha(opacity=10)
                    val=curEle.currentStyle['filter'];
                    reg=/^alpha\(opacity[=:](\d+(?:\.\d+))?\)$/i;
                    return reg.test(val)?reg.exec(val)[1]/100:1;
                }else{
                    val=curEle.currentStyle[attr];
                }

            }
            reg=/^([+-]?\d+(\.\d+)?)(px|pt|em|rem)?$/i ;//-200px +200px 22.33px px pt em rem
            // reg=/^((\+|-)?\d+(\.\d+)?)(px|pt|em|rem)?$/i;
            return reg.test(val)?parseFloat(val):val;
        },
        //offset:当前元素距离body的偏移量
        offset:function offset(curEle){
            var l=0;
            var t=0;
            var par=curEle.offsetParent;
            l+=curEle.offsetLeft;
            t+=curEle.offsetTop;
            while(par){
                //IE8 offsetLeft/top已经包含了边框，但是其他浏览器不包含边框；
                if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                    l+=par.clientLeft;
                    t+=par.clientTop;
                }
                l+=par.offsetLeft;
                t+=par.offsetTop;
                par=par.offsetParent;

            }
            return {left:l,top:t}
        },
        //win:获取和设置浏览器盒子模型；
        win:function(attr,value){
            if(typeof value==='undefined'){
                return document.documentElement[attr]||document.body[attr];
            }
            document.documentElement[attr]=document.body[attr]=value;
        }

    }
})();