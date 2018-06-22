window.onload = function () {
    var links = document.getElementById("userCenterList").getElementsByTagName("a");
    var theFrame = document.getElementById("userCenterFrame");
    theFrame.src = "myInfo.html";

    for (var i = 0;i<links.length;i++){
        links[i].onclick = function () {
            for (var x = 0;x<links.length;x++){
                links[x].className = "noselect";
            }
            //a[x].className = "selected";
            this.className = "selected";
            switch (this){
                case links[0]:{
                    theFrame.src = "myInfo.html";
                }
                break;
                case links[1]:{
                    theFrame.src = "changePwd.html";
                }
                    break;
                case links[2]:{
                    theFrame.src = "";
                }
                    break;
                case links[3]:{
                    theFrame.src = "";
                }
                    break;
                case links[4]:{
                    theFrame.src = "";
                }
                    break;
                case links[5]:{
                    theFrame.src = "";
                }
                    break;
            }
        }
    }

}