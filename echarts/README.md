# Echarts
## 资料
 >  https://echarts.apache.org/zh/index.html
 >  https://www.makeapie.com/explore.html#sort=rank~timeframe=all~author=all
## 开发
```
    var myChart = echarts.init(document.getElementById('main'));
    var option={}
    myChart.setOption(option);
```
## 知识点
1. 引入图片的方法
```javascript
var domImg = document.createElement('img')
domImg.style.height = domImg.height = domImg.width = domImg.style.width = '8px'
domImg.style.opacity=0.1
domImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURQgcajHk/SKeySrB5Bx/shNTk3XNSEwAAAAGdFJOU4yMjIyMjE9afYoAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAlSURBVAjXY2AAA0UhBgYWQUEHBiZBQQMQS4GBwVAYKMEaAFEAACK5Ac0MBL09AAAAAElFTkSuQmCC'

itemStyle: {
    borderColor:'#000d2d',
    normal: {
        areaColor: {
            image: domImg,
            repeat: 'repeat'
        },
        borderColor:'#000c2d'
    },
    emphasis: {
        areaColor: '#357cf8' 
    }
},
```
2. 提示框跑出图表之外
```javascript
tooltip : {
    confine: true
}
```


3. 折线图可以实现断点
在数据中用''代替

4. 使用GL

