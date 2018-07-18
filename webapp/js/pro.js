(function(){
    var dom = document.getElementById("container");
    var box = dom.parentElement

    var myChart = echarts.init(dom);
    var app = {};


    option = null;

    option = {
        title: {
            text: ''
        },

        tooltip: {
            trigger: 'item',
        },

        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [
            {
                type: 'graph',
                layout: 'force',
                force : { //力引导图基本配置
                    //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
                    repulsion : "",//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                    gravity : 0.01,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                    edgeLength :100,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                    layoutAnimation : true //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
                },
                symbolSize: 50,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            "fontSize": 12
                        }
                    }
                },
                data: [],
                links: [],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 1,
                        curveness: 0
                    }
                },
                itemStyle: {
                    normal: {
                        color: ""
                    }
                }
            }
        ]
    };

    getTbNodesInfoList()


    function setData(result){
        var list = result.list
        var arr = []
        for (var i = 0; i < list.length; i++) {
            var demo = {
                name:"节点"+(i+1),
                ip:list[i].addr
            }
            option.series[0].data.push(demo)
            if(list[i].active === "true"){
                demo.color = "green"
                arr.push(option.series[0].data[i].name)
                var obj = {}
                for (var j = 0; j < arr.length; j++) {
                    for (var g = j+1; g < arr.length; g++) {
                        obj ={
                            source: arr[j],
                            target: arr[g]
                        }
                        option.series[0].links.push(obj)
                    }
                }
            }else{
                demo.color = "red"
            }
        }
        option.tooltip.formatter = function(name){
            var res = name.data.ip
            return res;
        }
        option.series[0].itemStyle.normal.color = function(parmars){
            var color = parmars.data.color
            return color
        }
        var boxHeight = box.offsetHeight || "200px"
        option.series[0].force.repulsion = boxHeight/20
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
            window.onresize = myChart.resize;
        }
    }

    function getTbNodesInfoList() {
        //请求参数
        var data = {
            pageNumber: 1,
            pageSize:100,
            start:0
        }

        $.ajax({
            url:'../home/getTbNodesInfoByPage.json',//URI
            contentType:"application/json;charset=UTF-8",//设置头信息
            type:'post',
            cache:false,
            dataType:'json',
            data:JSON.stringify(data),
            success:function(DATA) {
                if(DATA.status==0){
                    console.log(DATA)
                    setData(DATA)
                }else {
                    console.log("query fail:"+DATA);
                    alert("query fail:"+DATA.msg);
                }

            },
            error : function(DATA) {
                console.log("query fail:"+DATA);
            }
        });
    }
}())