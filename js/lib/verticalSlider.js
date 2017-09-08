function setSlider(width, height, year, id, callback) {
    //间隔
    var parter = (height - width * 1.5) / 12;
    var month = 0,ealyMonth=null;
    var span = document.createElement("span");
    var oBox = document.createElement("div");
    span.setAttribute("id", "bar");
    var oFather = document.getElementById(id);
    oFather.appendChild(oBox);
    oBox.style.width = width + "px";
    oBox.style.height = height + "px";
    oBox.style.borderRadius = width + "px";
    $(oBox).css({"background-color": "rgba(255, 255, 255, 0.1)", "position": "relative"});
    oBox.appendChild(span);
    var oBar = oBox.children[0];
    oBar.style.width = width * 1.5 + "px";
    oBar.style.height = width * 1.5 + "px";
    oBar.style.left = -(width * 1.5 - width) / 2 + "px";
    $(oBar).css({"background-color": "#fff", "position": "absolute", "border-radius": "50%"});
    $("#" + id+">div").append("<p>" + year + "-01</p>");
    var $p1 = $("#" + id+">div" + ">p").attr("id", "p1");
    $("#p1").css({
        "position": "absolute",
        "top": -40 + "px",
        "left": -width + "px",
        "color": "#8b9dd2",
        "width": "70px",
        "font-size":"14px",
        "font-family":"微软雅黑"
    });
    $("#" + id+">div").append("<p>" + year + "-12</p>");
    var $p2 = $("#" + id +">div"+ ">p").eq(1).attr("id", "p2");
    $("#p2").css({
        "position": "absolute",
        "top": height - 10,
        "left": -width + "px",
        "color": "#8b9dd2",
        "width": "70px",
        "font-size":"14px",
        "font-family":"微软雅黑"
    });
    $("#" + id+">div").append("<em>" + year + "-01</em>");
    var $em1 = $("#" + id +">div"+ ">em").attr("id", "em1");
    $("#em1").css({"position": "absolute", "top": oBar.offsetTop + width / 4 + "px", "left": -width * 3.5 + "px","width":"60px",
        "font-style":"normal",
        "color":"#fff",
        "font-size":"14px",
    "font-family":"微软雅黑"});
    oBar.onmousedown = function (ev) {
        var oEvent = ev || event;
        var disX = oEvent.clientY - oBar.offsetTop;
        document.onmousemove = function (ev) {
            var oEvent = ev || event;
            var l = oEvent.clientY - disX;
            var maxW = oBox.offsetHeight - oBar.offsetHeight;
            if (l < 0) {
                l = 0
            }
            if (l > maxW) {
                l = maxW
            }
            oBar.style.top = l + 'px';
            $("#em1").css({
                "position": "absolute",
                "top": oBar.offsetTop + width / 4 + "px",
                "left": -width * 3.5 + "px",
                "width":"60px",
                "font-style":"normal",
                "color":"#fff",
                "font-size":"14px",
                "font-family":"微软雅黑"
            });
            month = parseInt(oBar.offsetTop / parter);
            if (month == 12) {
                month = month;
            } else if (month <= 8) {
                month = "0" + (month + 1);
            } else {
                month = month + 1;
            }
            $("#em1").html(year + "-" + month);
        };
        document.onmouseup = function () {
            if(ealyMonth!=month){
                callback(year + "-" + month);
            }
            ealyMonth=month;
            document.onmouseup = document.onmousemove = null;
            oBar.releaseCapture && oBar.releaseCapture();
        };
        oBar.setCapture && oBar.setCapture();
        return false;
    };
}