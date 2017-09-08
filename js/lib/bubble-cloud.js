(function(window) {
    if(typeof d3 === "undefined") throw new Error("Please include D3.js Library first.");
    /**
     * 泡沫云图.
     */
    function BubbleCloudChart(el, w, h) {
        var me = this;
        me.domElement = el;
        me.width = w;
        me.height = h;
        me._force = d3.layout.force()
            .gravity(0)
            .charge(0)
            .on("tick", function(d) {
                me._force_tickHandler.bind(me)(d);
            })
            .on("end", function(d) {
                me._tickEnd = true;
                me._bubbles.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")"
                });
            });

    }

    BubbleCloudChart.prototype = {
        constructor: BubbleCloudChart,
        padding: {
            left: 20,
            right: 30,
            top: 50,
            bottom: 20
        },
        /**
         * 此图形对应的绘制容器.
         * @type {Element}
         */
        domElement: null,
        /**
         * 图形的宽.
         * @type {number}
         */
        width: 100,
        /**
         * 图形的高.
         * @type {number}
         */
        height: 100,
        /**
         * 泡沫的最小半径.
         * @type {number}
         */
        minRadius: 20,
        /**
         * 泡沫的最大半径.
         * @type {number}
         */
        maxRadius: 50,
        /**
         * 名称的最小半径.
         * @type {number}
         */
        minFontSize: 10,
        /**
         * 名称的最大半径.
         * @type {number}
         */
        maxFontSize: 25,
        /**
         * 自定义分类信息.
         * 分类信息需具备如下结构:
         * name - 分类名称
         * color - 分类颜色
         * @type {Array}
         */
        categories: null,
        /**
         * 自定义泡沫名称获取方法,可指定每个泡沫的名称.
         * @type {function}
         */
        labelFunction: function(d) {
            return d.name;
        },
        /**
         * 自定义泡沫权重获取方法,可指定每个泡沫的权重,将依据权重比率自动设置泡沫尺寸.
         * @type {function}
         */
        weightFunction: function(d) {
            return d.size;
        },
        /**
         * 自定义泡沫分类获取方法.
         * @type {function}
         */
        categoryFunction: function(d) {
            return d.group;
        },
        /**
         * 点击事件监听.
         * @type {function}
         */
        clickHandler: null,
        /**
         * 自定义绘制方法,若未设置则使用默认方法.
         * @type {function}
         */
        customDrawFunction: function(g, d, radius, color) {
            g.append("circle")
                .attr("r", radius)
                .style("fill", color)
                .style("opacity", "1");
        },

        /**
         * 泡沫间扩散距离的填充,可影响泡沫云图的疏密度.
         * @type {number}
         */
        collisionPadding: 30,
        /**
         * 泡沫间的最小扩散距离,可影响泡沫云图的疏密度.
         * @type {number}
         */
        minCollisionRadius: 40,

        iconPadding: 150,

        _jitter: 0.618,
        _force: null,
        _categoryMap: null,
        _svg: null,
        _ballGroup: null,
        _bubbles: null,
        _legend: null,
        _radiusScale: null,
        _fontSizeScale: null,
        _width: 0,
        _height: 0,
        _tickEnd: false,

        init: function() {
            var me = this;
            me._width = me.width - me.padding.right - me.padding.left;
            me._height = me.height - me.padding.top - me.padding.bottom;

            me._radiusScale = d3.scale.linear().range([me.minRadius, me.maxRadius]);
            me._fontSizeScale = d3.scale.linear().range([me.minFontSize, me.maxFontSize]);

            me._force.size([me._width, me._height]);

            d3.select(me.domElement).selectAll().remove();

            me._svg = d3.select(me.domElement)
                .append("svg")
                .attr("width", me.width)
                .attr("height", me.height);

            me._categoryMap = {};
            if(me.categories) me.categories.forEach(function(c) {
                me._categoryMap[c.name] = c;
            });

            me._legend = me._svg.append("g").attr("transform", "translate(20, 20)");

            if(me.categories) me.categories.forEach(function(c, i) {
                if(!c.name) return;
                var gLegend = me._legend.append("g")
                    .on("click", function(d) {
//                      d.select("circle").
                    });
                gLegend.append("circle")
                    .attr({
                        r: 8,
                        transform: "translate(" + (i * me.iconPadding) + ", 0)",
                        "cursor": "pointer",
                        fill: c.color
                    });
                gLegend.append("text")
                    .text(c.name)
                    .attr({
                        transform: "translate(" + (20 + i * me.iconPadding) + ", 0)",
                        fill: "#FFFFFF",
                        "font-size": "16px",
                        "font-family": "微软雅黑",
                        "cursor": "pointer",
                        dy: ".3em"
                    });
            });
        },

        _data: null,
        data: function(value) {
            var me = this;
            if(arguments.length < 1) return me._data;
            me._data = value;

            var labelFunction = me.labelFunction || function(d) {
                return d.label || "";
            };
            var weightFunction = me.weightFunction || function(d) {
                return d._weight || 1;
            };
            var categoryFunction = me.categoryFunction || function(d) {
                return d.category || "";
            };

            me._radiusScale.domain([
                d3.min(me._data, weightFunction),
                d3.max(me._data, weightFunction)
            ]);

            me._fontSizeScale.domain([
                d3.min(me._data, weightFunction),
                d3.max(me._data, weightFunction)
            ]);

            me._svg.selectAll(".node").remove();

            me._ballGroup = me._svg.append("g")
                .attr("transform", "translate(" + me.padding.left + "," + me.padding.top + ")")
                .attr("class", "node");

            me._bubbles = me._ballGroup.selectAll("g")
                .data(me._data)
                .enter()
                .append("g")
                .style("cursor", "pointer")
                .on("click", function(d) {
                    if(me.clickHandler instanceof Function) me.clickHandler.call(null, d);
                });

            me._bubbles.each(function(d) {
                var radius = me._radiusScale(weightFunction(d));
                var c = me._categoryMap[categoryFunction(d)];
                var color = c ? c.color : "#000000";
                return me.customDrawFunction(d3.select(this), d, radius, color);
            });

            me._bubbles.append("text")
                .attr({
                    "text-anchor": "middle",
                    dy: ".3em"
                })
                .attr("font-size", function(d) {
                    return me._fontSizeScale(weightFunction(d));
                })
                .attr("fill", "#FFFFFF")
                .attr("font-family", "微软雅黑")
                .text(labelFunction);

            this._data.forEach(function(d, i) {
                d.fr = Math.max(me.minCollisionRadius, me._radiusScale(weightFunction(d)));
            });

            me._tickEnd = false;
            me._force.nodes(this._data).start();

            while(!me._tickEnd) {
                me._force.tick();
            }
        },

        _force_tickHandler: function(e) {
            this._bubbles.each(this._gravity(e.alpha * 0.1))
                .each(this._collide(this._jitter));
        },

        _gravity: function(a) {
            var cx = this._width / 2;
            var cy = this._height / 2;
            var ax = a / 3;
            var ay = a;

            return function(d) {
                d.x += (cx - d.x) * ax;
                d.y += (cy - d.y) * ay;
            }
        },

        _collide: function(j) {
            var data = this._data;
            var collisionPadding = this.collisionPadding;
            return function(d) {
                data.forEach(function(d2) {
                    if(d !== d2) {
                        var x = d.x - d2.x;
                        var y = d.y - d2.y;
                        var dis = Math.sqrt(x * x + y * y);
                        var minDis = d.fr + d2.fr + collisionPadding;
                        if(dis < minDis) {
                            dis = (dis - minDis) / dis * j;
                            var mx = x * dis;
                            var my = y * dis;
                            d.x -= mx;
                            d.y -= my;
                            d2.x += mx;
                            d2.y += my;
                        }
                    }
                });
            }
        }
    };

    if(window) window.BubbleCloudChart = BubbleCloudChart;
})(window);