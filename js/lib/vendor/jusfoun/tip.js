/* tooltip */
var tipTimerConfig = {
    longer: 0,
    target: null,
    exist: false,
    winEvent: window.event,
    boxHeight: 398,
    boxWidth: 376,
    maxWidth: 376,
    maxHeight: 398,
    tooltip: null,

    showTime: 3500,
    hoverTime: 300,
    displayText: "",
    show: function(val, e) {
        "use strict";
        var me = this;

        if (e != null) {
            me.winEvent = e;
        }

        me.displayText = val;

        me.calculateBoxAndShow();

        me.createTimer();
    },
    calculateBoxAndShow: function() {
        "use strict";
        var me = this;

        //计算文字宽度，调整tooltip
//      var calculate = document.getElementById('tip-div');
//      if (calculate == null) {
//          calculate = document.createElement("div");
//          calculate.className = 'div-tip-hidden'
//          calculate.setAttribute('id', 'tip-div');
//          document.getElementById("menu").appendChild(calculate);
//      }
//      calculate.innerHTML = me.getInnerHtml();
//      var s = calculate.getElementsByTagName('SPAN')[0];
//      me.boxWidth = s.offsetWidth + 8;
//      if (me.boxWidth > me.maxWidth) {
//          me.boxWidth = me.maxWidth;
//      }
//      me.boxHeight = s.offsetHeight + 8;

        var _x = 0;
        var _y = 0;
        var _w = document.documentElement.scrollWidth;
        var _h = document.documentElement.scrollHeight;

        var xMouse = me.winEvent.x + window.scrollX;
        if (_w - xMouse < me.boxWidth) {
            _x = xMouse - me.boxWidth - 10;
        } else {
            _x = xMouse;
        }

        var _yMouse = me.winEvent.y + window.scrollY;
        if (_h - _yMouse < me.boxHeight + 18) {
            _y = _yMouse - me.boxHeight - 25;
        } else {

            _y = _yMouse + 18;
        }

        me.addTooltip(_x, _y);
    },
    addTooltip: function(page_x, page_y) {
        "use strict";
        var me = this;

        me.tooltip = document.createElement("div");
        me.tooltip.style.left = page_x + "px";
        me.tooltip.style.top = page_y + "px";
        me.tooltip.style.position = "absolute";

        me.tooltip.style.width = me.boxWidth + "px";
        me.tooltip.style.height = me.boxHeight + "px";
        me.tooltip.className = "three-tooltip";

        var divInnerHeader = me.createInner();
//      divInnerHeader.innerHTML = me.getInnerHtml(me.boxWidth);
        divInnerHeader.innerHTML = me.displayText;
        me.tooltip.appendChild(divInnerHeader);

        document.body.appendChild(me.tooltip);
    },
    createInner: function() {
        "use strict";
        var me = this;
        var divInnerHeader = document.createElement('div');
        divInnerHeader.style.width = me.boxWidth + "px";
        divInnerHeader.style.height = me.boxHeight + "px";
        return divInnerHeader;
    },
    ClearDiv: function() {
        "use strict";
        var delDiv = document.body.getElementsByClassName("three-tooltip");
        for (var i = delDiv.length - 1; i >= 0; i--) {
            document.body.removeChild(delDiv[i]);
        }
    },
//  getInnerHtml: function(w) {
//      "use strict";
//      var tip = new Array();
//      if (w == null) {
//          w = this.maxWidth;
//      }
//      tip.push('<table style="font-size:14px;" width="' + w + 'px">');
//      tip.push("<tr>");
//      tip.push('<td>');
//      tip.push('<span class="tooltip-font-div">' + this.displayText + '</span>');
//      tip.push("</td>");
//      tip.push("</tr>");
//      return tip.join('');
//  },
    createTimer: function(delTarget) {
        "use strict";
        var me = this;
        var delTip = me.tooltip;
        var delTarget = tipTimerConfig.target;
        var removeTimer = window.setTimeout(function() {
            try {
                if (delTip != null) {
                    document.body.removeChild(delTip);
                    if (tipTimerConfig.target == delTarget) {
                        me.exist = false;
                    }
                }
                clearTimeout(removeTimer);
            } catch (e) {
                clearTimeout(removeTimer);
            }
        }, me.showTime);
    },
    hoverTimerFn: function(showTip, showTarget) {
        "use strict";
        var me = this;

        var showTarget = tipTimerConfig.target;

        var hoverTimer = window.setInterval(function() {
            try {
                if (tipTimerConfig.target != showTarget) {
                    clearInterval(hoverTimer);
                } else if (!tipTimerConfig.exist && (new Date()).getTime() - me.longer > me.hoverTime) {
                    //show
                    tipTimerConfig.show(showTip);
                    tipTimerConfig.exist = true;
                    clearInterval(hoverTimer);
                }
            } catch (e) {
                clearInterval(hoverTimer);
            }
        }, tipTimerConfig.hoverTime);
    }
};

//marker.mouseOut = function() {
//  tipTimerConfig.target = null;
//  tipTimerConfig.ClearDiv();
//};
//marker.mouseOver = function() {
//  // 添加 div
//  tipTimerConfig.target = this;
//  tipTimerConfig.longer = new Date().getTime();
//  tipTimerConfig.exist = false;
//  //获取坐标
//  tipTimerConfig.winEvent = {
//      x: 0,
//      y: 0
//  };
//
//  tipTimerConfig.boxHeight = 398;
//  tipTimerConfig.boxWidth = 376;
//
//  //hide
//  tipTimerConfig.ClearDiv();
//  tipTimerConfig.hoverTimerFn(createTooltipTableData(this.info));
//};