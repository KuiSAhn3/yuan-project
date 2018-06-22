window.onload = function () {
    var a = document.getElementById("navUl").getElementsByTagName("a");
    // var divLength = document.getElementById("broadcastInner").offsetWidth;
    // var imgPlace = document.getElementById("imgPlace");
    // var imgLeft = imgPlace.offsetLeft;
    // var prev = document.getElementById("prev");
    // var next = document.getElementById("next");
    var frame = document.getElementById("theFrame");
    var webTitle = document.getElementsByTagName("title")[0];
    webTitle.innerText = "首页";
    frame.src = "";


    // imgPlace.style.left = -divLength + "px";
    for (var i=0;i<a.length;i++){
        a[i].onclick = function () {

            for(var x=0;x<a.length;x++){
                a[x].className = "noselect";
            }
            // a[i].className = "selected";
            this.className = "selected";
            switch (this){
                case a[0]: {
                        frame.src = "";
                        webTitle.innerText = "未读消息";
                    }
                    break;
                case a[1]: {
                        frame.src = "";
                        webTitle.innerText = "首页";
                }
                    break;
                case a[2]: {
                    frame.src = "";
                    webTitle.innerText = "知识体系";
                }
                    break;
                case a[3]: {
                    frame.src = "";
                    webTitle.innerText = "活动中心";
                }
                    break;
                case a[4]: {
                    frame.src = "";
                    webTitle.innerText = "文章";
                }
                    break;
                case a[5]: {
                    frame.src = "lognIn.html";
                    webTitle.innerText = "登录";
                }
                    break;
                case a[6]: {
                    frame.src = "logUp.html";
                    webTitle.innerText = "注册";
                }
                    break;
            }
        }
    }



}