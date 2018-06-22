window.onload = function () {
    var inner = document.getElementById("inner");//获取整个显示区域用于显示提示信息
    var checkBox = document.getElementById("autoLog");//下次自动登录
    var checked = document.getElementById("checkInImg");//选择下次自动登录
    var vis = window.getComputedStyle(checked);//获取自动登录div的样式表
    var tips = document.getElementById("tip");//提示信息
    var logButton = document.getElementById("logButton");//登录按钮
    var someInfo;//存储服务器返回的错误信息
    var timer;//提示消息的存在时间
    document.getElementById("mobile").value = "";
    document.getElementById("pwd").value = "";

    localStorage.removeItem("theUserInfo");//清楚本地浏览器中localstorage中的名为theUserInfo缓存

    //提示框出现的变化方法
    function tipsVisible(errInf) {
        tips.style.backgroundColor = "rgba(0,0,0,0.7)";
        tips.style.color = "rgba(255,255,255,1)";
        tips.innerText = errInf;
        tips.addEventListener("click",tipsHidden);//点击提示框使其消失
        timer = setTimeout(tipsHidden,3000);//提示框显示三秒钟后调用使其消失的方法
    }
    //end
    //提示框消失的变化方法
    function tipsHidden() {
        tips.style.backgroundColor = "rgba(0,0,0,0)";
        tips.style.color = "rgba(255,255,255,0)";
        clearTimeout(timer);
    }
    //end

    //当输入框获得聚焦时改变边框颜色的方法
    function focusColor() {
        this.style.border = "#ea0f2d 1px solid"
    }
    //方法结束
    //当输入框失去焦点使边框颜色变化的方法
    function blurColor() {
        this.style.border = "#979797 1px solid"
    }
    //方法结束


    //边框失去或获得焦点的事件
    document.getElementById("mobile").onfocus = focusColor;
    document.getElementById("pwd") .onfocus = focusColor;

    document.getElementById("mobile").onblur = blurColor;
    document.getElementById("pwd").onblur = blurColor;
    //end


    //下次自动登录的checkbox的变化
    checkBox.onclick = function () {
        if (vis.visibility == "hidden"){
            checkBox.style.visibility = "hidden";
            checked.style.visibility = "visible";
        }
        else if (vis.visibility == "visible"){
            checkBox.style.visibility = "visible";
            checked.style.visibility = "hidden";
        }
    }
    //end

    //登录事件
    logButton.addEventListener("click",talkToService);
    // logButton.addEventListener("click",getInputValue);
    //end

 //登录事件与后端交互的方法
 function talkToService() {

     var para =JSON.stringify({"mobile":document.getElementById("mobile").value,"pwd":document.getElementById("pwd").value});

    // tipsVisible(document.getElementById("mobile").value);
     //与后端交互的接口
     var xmlHttp;//创建接口对象


     if (window.XMLHttpRequest) {
         xmlHttp = new XMLHttpRequest();
     }
     else {
         xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
     }
     if(xmlHttp){
         xmlHttp.open('POST',"http://www.ftusix.com/static/data/login.php",true);
         xmlHttp.setRequestHeader("content-type","application/json;charset=UTF-8");
         xmlHttp.send(para);
         xmlHttp.onreadystatechange = function () {
             if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
                 someInfo = JSON.parse(xmlHttp.responseText);
                 checkMobNPwd(someInfo);

                 localStorage.setItem("theUserInfo",xmlHttp.responseText);

             }
             else if (xmlHttp.status == 404){
                 someInfo = "无法访问服务器";
                 tipsVisible(someInfo);
             }
         }
     }
     else {
         someInfo = "未知错误";
         tipsVisible(someInfo);
     }
 }
//end
function checkMobNPwd() {
    var password = document.getElementById("pwd");//获取输入的密码
    var mob = document.getElementById("mobile");//获取输入的手机号

    //判断手机号是否为空
    if( mob.value == ""){
        someInfo = "手机号不能为空";
        tipsVisible(someInfo);
        password.value = "";
        return;
    }
    //end
    //判断手机号是否符合格式
    var regPhoneNum = new RegExp("(13|14|15|18|17)[0-9]{9}");
    var phoneNumResult = regPhoneNum.test(mob.value);
    if (phoneNumResult == false){
        someInfo = "手机号码格式不正确";
        tipsVisible(someInfo);
        mob.value = "";
        password.value = "";
        return;
    }
    //end
    //验证登录
    switch (someInfo.status){
        case 0:{
            tipsVisible(someInfo.info);
            mob.value = "";
            password.value = "";
            return;
        }
        break;
        case 1:{
            tipsVisible(someInfo.info);
            mob.value = "";
            password.value = "";
            return;
        }
        break;
    }


    //判断密码是否为空
    if(password == ""){
        someInfo = "密码不能为空";
        tipsVisible(someInfo);
        mob.value = "";
        return;
    }
    //end
    //判断密码是否符合格式
    var regPwd = /[0-9A-Za-z]{6,16}/;
    var pwdResult = regPwd.test(password.value);
    if (pwdResult == false){
        someInfo = "密码格式不正确";
        tipsVisible(someInfo);
        mob.value = "";
        password.value = "";
    }
    //end

}

}