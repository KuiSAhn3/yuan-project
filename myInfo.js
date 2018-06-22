window.onload = function () {
    var headAppear = document.getElementById("userHeadAppear");//显示头像的区域
    var changeAppearButton = document.getElementById("headAppearButton");//更换头像的按钮
    var phoneNumber = document.getElementById("phoneNumber");//显示用户的电话号码
    var male = document.getElementById("male");//性别男
    var female = document.getElementById("female");//性别女
    var nickNameInput = document.getElementById("nickNameInput");
    var submitButton = document.getElementById("submitButton");//提交按钮
    var formDataUpload = document.getElementById("headAppearUpload");//获取头像上传表单
    var userInfo;//存储取自本地缓存的登录信息
    var userInfoDate;//存储取自本地缓存的用户信息
    var userSex;//存储用户性别
    var newUserInfo;//存储用户修改后的信息
    var userAvatar;//存放表单内的数据
    var requestInfo;//存放服务器返回的信息
    var tips = document.getElementById("alertInfo");//提示框
    var timer;



    //选择性别时样式改变的具体方法
    function changeUserSex(sexValue) {
        switch (sexValue){
            case 1:{
                male.className = "selected";
                female.className = "no-select";
            }
            break;
            case 2:{
                male.className = "no-select";
                female.className = "selected";
            }
            break;
        }
    }
    //end

    //判断用户选择的是哪一个性别
    function checkUserSex() {
        if (male.className == "selected" && female.className == "no-select"){
            return 1;
        }
        else if (male.className == "no-select" && female.className == "selected"){
            return 2;
        }
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


    userInfo = JSON.parse(localStorage.getItem("theUserInfo"));//从本地缓存获取登录信息
    userInfoDate = userInfo.data;//获取登录信息里的用户信息

    var imgSrc = "http://www.ftusix.com/static/data/upload/"+userInfoDate[0].avatar;
    headAppear.src = imgSrc;
    //初始化用户头像

    phoneNumber.innerHTML = userInfoDate[0].mobile;
    //初始化用户手机号

    nickNameInput.value = userInfoDate[0].nick_name;
    //初始化用户昵称


    userSex = userInfoDate[0].sex;
    changeUserSex(parseInt(userSex));
    //初始化用户性别

    //选择性别事件
    male.onclick = function () {
        changeUserSex(1);
    }
    female.onclick = function () {
        changeUserSex(2);
    }
    //end

    // changeAppearButton.addEventListener("click",uploadAvatar);





    //点击提交按钮事件
    submitButton.addEventListener("click",submit);


    //按钮事件详情
    function submit() {

        userAvatar = new FormData(formDataUpload);
        userAvatar.append("id",userInfoDate[0].user_id);

        var theUserSex = checkUserSex();//存储用户要更新的性别
        var userNickName = nickNameInput.value;
        var userToken = userInfoDate.token;
        newUserInfo = JSON.stringify({"sex":theUserSex,"nick_name":userNickName,"token":userToken});


        // userAvatar = new FormData(formDataUpload);
        var uploadHttp;
        var avatarHttp;
        if(window.XMLHttpRequest){
            uploadHttp = new XMLHttpRequest();
            avatarHttp = new XMLHttpRequest();
        }
        else {
            uploadHttp = new ActiveXObject("Microsoft.XMLHTTP");
            avatarHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }


        //上传头像
        if (avatarHttp){
            avatarHttp.open("POST","http://www.ftusix.com/static/data/upload.php");
            avatarHttp.send(userAvatar);
            avatarHttp.onreadystatechange = function () {
                if (avatarHttp.readyState == 4 && avatarHttp.status == 200){
                    var avatarRequest = JSON.parse(avatarHttp.responseText);
                    tipsVisible(avatarRequest.info);
                    var avatarData = avatarRequest.data;
                    headAppear.src = "http://www.ftusix.com/static/data/upload/"+avatarData;

                }
                else if (avatarHttp.status == 404){
                    tipsVisible("无法访问头像服务器");
                }
            }
        }


        //上传文本信息
        if (uploadHttp){
            uploadHttp.open("POST","http://www.ftusix.com/static/data/update.php");
            uploadHttp.setRequestHeader("content-type","application/json;charset=UTF-8");
            uploadHttp.send(newUserInfo);
            uploadHttp.onreadystatechange = function () {
                if (uploadHttp.readyState == 4 && uploadHttp.status == 200){
                    requestInfo = JSON.parse(uploadHttp.responseText);
                    tipsVisible(requestInfo.info);
                    localStorage.setItem("theUserInfo",uploadHttp.responseText);
                }
                else if (uploadHttp.status == 404){
                    tipsVisible("无法连接到服务器");
                }
            }
        }
        else {
            tipsVisible("未知错误");
        }
    }
    //end


}