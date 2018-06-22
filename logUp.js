window.onload = function () {
    var mobile = document.getElementById("mobile");//获取手机号码输入框
    var passWord = document.getElementById("pwd");//获取密码输入框
    var cfPassWord = document.getElementById("confPwd");//获取确认密码输入框
    var sms = document.getElementById("sms");//获取验证马输入框
    var sentSms = document.getElementById("sentSms");//获取发送验证码按钮
    var registerButton = document.getElementById("registerButton");//获取注册按钮
    var tips = document.getElementById("tips");//获取提示框
    var timer;//时间
    var someInfo;//存储提示框中药弹出的内容
    var paraObject = {};//存储数据的对象
    var para;//存储数据


    mobile.value = "";//页面加载完成后所有输入框的内容为空
    passWord.value = "";
    cfPassWord.value = "";
    sms.value = "";

    //用于清空所有输入框的方法
    function clearInput() {
        mobile.value = "";
        passWord.value = "";
        cfPassWord.value = "";
        sms.value = "";
    }
    //end

    //边框获得焦点时的事件
    mobile.addEventListener('focus',borderOnFocus);
    passWord.addEventListener('focus',borderOnFocus);
    cfPassWord.addEventListener('focus',borderOnFocus);
    sms.addEventListener('focus',borderOnFocus);
    //end

    //边框失去焦点时的事件
    mobile.addEventListener('blur',borderOnBlur);
    passWord.addEventListener('blur',borderOnBlur);
    cfPassWord.addEventListener('blur',borderOnBlur);
    sms.addEventListener('blur',borderOnBlur);
    //end

    //失去和获得焦点时的事件本体
    function borderOnFocus() {
        this.style.border = "#ea0f2d 1px solid";
    }
    function borderOnBlur() {
        this.style.border = "#979797 1px solid";
    }
    //end

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

    //点击获取验证码时的事件
    sentSms.addEventListener('click',alertSms);

    //点击获取验证码时的方法本体
    function alertSms() {
        if (mobile.value == ''){
            someInfo = "请输入电话号码";
            tipsVisible(someInfo);
        }
        else {
            someInfo = "验证码为123456";
            tipsVisible(someInfo);
        }
    }
    //end
    
    //注册按钮事件
    registerButton.addEventListener('click',talkToService);

    function talkToService() {

        //将获取到的数据拼接在对象中并转换为JSON格式的字符串
        paraObject = {"mobile":mobile.value,"pwd":passWord.value,"sms_code":sms.value};
        para = JSON.stringify(paraObject);
        //end

        //创建接口对象
        var jsonHttp;

        if(window.XMLHttpRequest){
            jsonHttp = new XMLHttpRequest();
        }
        else{
            jsonHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //end

        //发送数据并接收服务器返回的数据
        if(jsonHttp){
            jsonHttp.open('POST','http://www.ftusix.com/static/data/register.php',true);
            jsonHttp.setRequestHeader('Content-type',"application/json;charset=UTF-8");
            jsonHttp.send(para);
            jsonHttp.onreadystatechange = function () {
                if (jsonHttp.readyState == 4 && jsonHttp.status == 200){
                    someInfo = JSON.parse(jsonHttp.responseText);
                    alertTipsInfo(someInfo);//处理服务器返回的数据
                }
                else if (jsonHttp.status == 404){
                    someInfo = "无法访问服务器";
                    tipsVisible();
                }
            }
        }
        else {
            someInfo = "未知错误";
            tipsVisible(someInfo);
        }
        //end
    }


    function alertTipsInfo() {
        var mobValue = mobile.value;
        var pwdValue = passWord.value;
        var cfPwdValue = cfPassWord.value;

        //判断手机号码是否为空
        if (mobValue == ""){
            someInfo = "手机号码不能为空";
            tipsVisible(someInfo);
            clearInput();
            return;
        }
        //end

        //判断手机号码是否符合大陆手机号码格式
        var regPhoneNum = new RegExp("(13|14|15|18|17)[0-9]{9}");
        var phoneNumResult = regPhoneNum.test(mobValue);
        if (phoneNumResult == false){
            someInfo = "手机号码格式不正确";
            tipsVisible(someInfo);
            clearInput();
            return;
        }
        //end

        //判断密码是否为空
        if(pwdValue == ""){
            someInfo = "密码不能为空";
            tipsVisible(someInfo);
            clearInput();
            return;
        }
        //end

        //判断密码是否符合格式
        var regPwd = /[0-9A-Za-z]{6,16}/;
        var pwdResult = regPwd.test(pwdValue.value);
        if (pwdResult == false){
            someInfo = "密码格式不正确";
            tipsVisible(someInfo);
            clearInput();
        }
        //end

        //判断两次密码是否相同
        if (pwdValue != cfPwdValue){
            someInfo = "两次输入的密码不相同";
            tipsVisible(someInfo);
            clearInput();
            return;
        }
        //end

        //验证登录
        switch (someInfo.status){
            case 0:{
                tipsVisible(someInfo.info);
                clearInput();
                return;
            }
                break;
            case 1:{
                tipsVisible(someInfo.info);
                return;
            }
                break;
        }
        //end


    }


}