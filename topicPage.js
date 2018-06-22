window.onload = function () {
    var articalContainer = document.getElementById("articalContainer");//获取到盛放文章的容器
    var nextBtn = document.getElementById("next");//获取到下一页的按钮
    var prevBtn = document.getElementById("prev");//获取到上一页的按钮
    var tips = document.getElementById("tips");//获取提示框
    var requestInfo;//存储服务器发回的信息
    var pageList;//总共所需的页数
    var timer;
    var artical;
    var localUserInfo = JSON.parse(localStorage.getItem("theUserInfo"));//获取缓存中的登录信息
    var localUserInfoData = localUserInfo.data;//获取缓存中的用户信息
    var infoSend; //= "user_id=38&page=1";//初始化发送信息
    send_info(38,1);
    http_request(infoSend);//发送ajax请求
    
    //点击文章后将文章ID和用户ID存入localstorage并打开一文章页面
    function artical_click(art){
        for (var i=0;i<art.length;i++){
            art[i].onclick = function (){
                localStorage.removeItem("articalInfo");
                var articalId = {"user_id":38,"topic_id":this.id};
                localStorage.setItem("articalInfo",JSON.stringify(articalId));
                // window.location.href = "artical.html";
            }
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


    prevBtn.addEventListener("click",prev_page);//上一页的点击按钮
    nextBtn.addEventListener("click",next_page);//下一页的点击按钮

    //处理要发送的信息
    function send_info(id,page){
        infoSend = "user_id="+id+"&page="+page;
    }
    //end

    //上一页的点击事件详情
    function prev_page(){
        var pageNum = document.getElementById("pageNum");
        var pageNumValue = parseInt(pageNum.innerHTML);
        if (pageNumValue == 1){
            tipsVisible("这已经是第一页啦！");
            return;
        }
        else if (pageNumValue > 1){
            articalContainerInnerHTML = articalContainer.innerHTML;//存储点击按钮前的文章列表
            articalContainer.innerHTML = "";//将文章列表清空以便存放新的文章列表
            pageNumValue -= 1;
            pageNum.innerHTML = pageNumValue;
            send_info(38,pageNumValue);
            http_request(infoSend);
        }
    }
    //end

    //点击下一页时的函数详情
    function next_page(){
        var pageNum = document.getElementById("pageNum");
        var pageNumValue = parseInt(pageNum.innerHTML);
        if(pageNumValue < pageList){
            articalContainerInnerHTML = articalContainer.innerHTML;
            articalContainer.innerHTML = "";
            pageNumValue += 1;
            send_info(38,pageNumValue);
            http_request(infoSend);
            pageNum.innerHTML = pageNumValue;
        }
        else if(pageNumValue >= pageList){
            tipsVisible("这已经是最后一页啦!");
            return;
        }
    }
    //end
    
    //处理返回数据的函数
    function connect(request){
        var topicInfo = new Array (2);//存放文章标题以及文章ID
        var topicHandle = new Array (4);//存放文章类型，回复数，浏览数以及发布时间
        var data = request.data;
        for (var i=0;i<data.length;i++){
            topicInfo[0] = data[i].topic_id;
            topicInfo[1] = data[i].title;
            topicHandle[0] = topic_type(parseInt(data[i].type));//data[i].type;
            topicHandle[1] = data[i].comment_num;
            topicHandle[2] = data[i].browser_num;
            topicHandle[3] = mod_time(data[i].modify_time*1000);
            create_topic_item(topicInfo,topicHandle);
        }
        //当页面上所有文章列表加载完成后获取文章列表并传给文章点击函数
        artical = document.getElementsByClassName("artical");//获取当前页面所有的文章
        artical_click(artical);
        //end

    }
    //end

    //处理文章类型
    function topic_type(typeValue){
        switch(typeValue){
            case 1:
                return "html";
                break;
            case 2:
                return "php";
                break;
            case 3:
                return "java";
                break;
        }
    }
    //end

    //处理发布时间的函数
    function mod_time(time){
        var timer = new Date(time);
        // alert(timer.getDate());
        return (timer.getFullYear()+"/"+(timer.getMonth()+1)+"/"+timer.getDate());
    }
    //end


    //在页面上添加文章的函数
    function create_topic_item(info,handle){
// 两个参数,info存放文章标题和ID，handle存放文章类型，回复，浏览，发布时间,
        var container = document.createElement("div");//创建一个div用于盛放一篇文章
        var title = document.createElement("div");//创建一个div用于盛放标题
        var ul = document.createElement("ul");//创建div盛放操作列表
        var li = new Array (5);
        for(var i=0;i<5;i++){
            li[i] = document.createElement("li");//创建操作列表项
        }

        //创建文本节点
        var titleInner = document.createTextNode(info[1]);//存放文章标题
        var topicHandle = new Array (5);//创建一个数组，存放li里的文本节点
        for (var i=0;i<4;i++){
            topicHandle[i] = document.createTextNode(handle[i]);
        }
        var edit = document.createTextNode("删除/编辑");
        //end

        //添加元素节点
        articalContainer.appendChild(container);
        container.appendChild(title);
        container.appendChild(ul);
        for(var i=0;i<5;i++){
            ul.appendChild(li[i]);
        }
        //end

        //添加文本节点
        title.appendChild(titleInner);
        for (var i=0;i<4;i++){
            li[i].appendChild(topicHandle[i]);//将文本节点添加到li里
        }
        li[4].appendChild(edit);
        //end

        //给元素节点添加属性
        container.setAttribute("class","artical");
        container.setAttribute("id",info[0]);//为文章设置ID属性
        title.setAttribute("class","artical-title");
        ul.setAttribute("class","artical-handle-ul");
        for (var i=0;i<5;i++){
            li[i].setAttribute("class","artical-handle-li");
        }
        //end
    }
    //end

    //根据文章总数计算所需页数的函数
    function page_list(comment){
        var ex = comment%10;
        if(ex == 0){
            pageList = comment/10;
        }
        else{
            pageList = parseInt(comment/10)+1;
        }
    }
    //end

    //发送ajax请求的函数
    function http_request(para){
        var noteHttp;
        var requestInnerInfo;//存放服务器发回的文章信息

        if (window.XMLHttpRequest){
            noteHttp = new XMLHttpRequest();
        }
        else {
            noteHttp = new ActiveXObject("Micrsoft.XMLHTTP");
        }
    
        if (noteHttp){
            noteHttp.open("POST","http://www.ftusix.com/static/data/myNote.php");
            noteHttp.setRequestHeader("content-type","application/x-www-form-urlencoded;charset=UTF-8");
            noteHttp.send(para);
            noteHttp.onreadystatechange = function () {
                if (noteHttp.readyState == 4 && noteHttp.status == 200){
                    requestInnerInfo = JSON.parse(noteHttp.responseText);
                    page_list(parseInt(requestInnerInfo.commentList));
                    connect(requestInnerInfo);//执行处理返回数据的函数
                }
                else if (noteHttp.status == 404){
                    alert("error");
                }
            }
        }
    } 
    //end
}