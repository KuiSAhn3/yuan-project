window.onload = function () {
    var newPwdInputArea = document.getElementById("newPwdInput");//新密码输入区域
    var newPwdInputBorder = document.getElementById("newPwdInputBorder");//新密码输入框
    var cfPwdInputArea = document.getElementById("cfPwdInput");//确认密码输入区域
    var cfPwdInputBorder = document.getElementById("cfPwdInputBorder");//确认密码输入框
    var smsInputArea = document.getElementById("smsInput");//验证码输入区域
    var smsInputBorder = document.getElementById("smsInputBorder");//验证码输入框
    var smsButton = document.getElementById("smsButton");//获取验证码按钮
    var usrPhoneNum = document.getElementById("usrPhoneNum");//用户手机号码
    var submitBtn = document.getElementById("submitButton");//提交按钮
    var userInfo;//存储取自本地的登录信息
    var userInfoDate;//存储取自本地的用户信息
    var tips = document.getElementById("tips");
    var timer;
    var updateInfo//存储更新后的用户信息
    var updateHttp;//接口对象
    var requestInfo;//存放服务器返回的信息

    clearInput();



    userInfo = JSON.parse(localStorage.getItem("theUserInfo"));//从本地缓存获取登录信息
    userInfoDate = userInfo.data;//获取登录信息里的用户信息

    usrPhoneNum.innerHTML = userInfoDate[0].mobile;
    //初始化用户手机号码

    //发送验证码
    smsButton.onclick = function () {
        if (newPwdInputArea.value == "" && cfPwdInputArea.value == ""){
            tipsVisible("密码不能为空");
        }
        else {
            tipsVisible("验证码为123456");
        }
    }
    //end


    submitBtn.onclick = function () {

        checkInput();

        updateInfo = JSON.stringify({"mobile":userInfoDate[0].mobile,"pwd":newPwdInputArea.value,"pwd2":cfPwdInputArea.value,"sms_code":smsInputArea.value});

        if(window.XMLHttpRequest){
            updateHttp = new XMLHttpRequest();
        }
        else {
            updateHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (updateHttp){
            updateHttp.open("POST","http://www.ftusix.com/static/data/reset.php",true);
            updateHttp.setRequestHeader("content-type","application/json;charset=UTF-8");
            updateHttp.send(updateInfo);
            updateHttp.onreadystatechange = function () {
                if (updateHttp.readyState == 4 && updateHttp.status == 200){
                    requestInfo = JSON.parse(updateHttp.responseText);
                    tipsVisible(requestInfo.info);
                    localStorage.setItem("theUserInfo",updateHttp.responseText);
                }
                else if (updateHttp.status == 404){
                    tipsVisible("无法访问服务器");
                }
            }
        }
        else {
            tipsVisible("未知错误");
        }
    }


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

    //清空输入框
    function clearInput() {
        newPwdInputArea.value = "";
        cfPwdInputArea.value = "";
        smsInputArea.value = "";
    }
    //end

    function checkInput() {
        var pwd1 = newPwdInputArea.value;
        var pwd2 = cfPwdInputArea.value;
        var sms = smsInputArea.value;
        var pwdreg = /[0-9A-Za-z]{6,16}/;

        if (userInfoDate[0].pwd == pwd1){
            tipsVisible("与上次使用的密码相同");
            return;
        }

        //判断第一次密码输入是否符合格式
        if (pwd1 == "" || pwdreg.test(pwd1) == false){
            tipsVisible("请输入格式正确的密码");
            clearInput();
            return;
        }

        //判断第二次没密码输入是否符合格式
        if (pwd2 == "" || pwdreg.test(pwd2) == false){
           tipsVisible("请输入格式正确的密码");
           clearInput();
           return;
        }

        //判断两次密码输入是否一致
        if (pwd1 != pwd2){
            tipsVisible("两次密码输入必须一致");
            clearInput();
            return;
        }

        //判断验证码是否输入
        if (sms == ""){
            tipsVisible("请输入验证码");
            return;
        }
    }

}