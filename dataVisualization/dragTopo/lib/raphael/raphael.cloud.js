'use strict';

(function(gb) {

    var cloud = {
        path: 'M110.01,53.41c0-9.65-7.82-17.46-17.47-17.46c-1.15,0-2.28,0.11-3.37,0.33' +
            'C85.73,27.9,77.51,21.99,67.9,21.99c-7.27,0-13.73,3.38-17.95,8.64c-2.71-1.39-5.78-2.18-9.03-2.18' +
            'c-10.33,0-18.82,7.87-19.82,17.94c-11.45,0.57-20.57,10-20.57,21.6c0,11.96,9.69,21.65,21.65,21.65c0.84,0,1.67-0.06,2.49-0.15' +
            'c4.63,9.76,14.54,16.52,26.06,16.52c6.93,0,13.29-2.44,18.26-6.5c3.81,2.87,8.54,4.6,13.7,4.6c10.45,0,19.23-7.04,21.92-16.63' +
            'c1.7,0.56,3.52,0.87,5.41,0.87c9.65,0,17.47-7.82,17.47-17.47C127.48,61.22,119.66,53.41,110.01,53.41z',
        // width: 126.96,
        // height: 84.02,
        cx: 64.01,
        cy: 64,
        reg: /[a-zA-Z\-,]/g
    };

    var pArr = cloud.path.split(cloud.reg);
    var sArr = new Array();
    var split = cloud.reg.exec(cloud.path);
    while (0 !== cloud.reg.lastIndex) {
        sArr.push(split[0]);
        split = cloud.reg.exec(cloud.path);
    }

    var CLOUD = {};

    /**
     * paper: raphael paper object
     * opt
     */
    CLOUD.draw = function(paper, opt) {

        var zoom = opt && opt.zoom ? opt.zoom : 2;
        var cx = opt && opt.cx ? opt.cx : 200;
        var cy = opt && opt.cy ? opt.cy : 100;
        var fill = opt && opt.fill ? opt.fill : '#ccc';
        var stroke = opt && opt.stroke ? opt.stroke : '#ccc';

        var npArr = new Array();
        var mFlag = false;
        var xyCount = 0;
        for (var i = 0, len = pArr.length; i < len; i++) {

            if ('' !== pArr[i]) {
                if (mFlag) {
                    if (0 === xyCount % 2) {
                        npArr.push((parseFloat(pArr[i]) - cloud.cx) * zoom + cx);
                    } else {
                        npArr.push((parseFloat(pArr[i]) - cloud.cy) * zoom + cy);
                    }
                } else {
                    npArr.push(parseFloat(pArr[i]) * zoom);
                }
            }

            npArr.push(sArr[i] ? sArr[i] : '');
            if (/[A-Z]/.test(sArr[i])) {
                mFlag = true;
                xyCount = 0;
            } else if (/[a-z]/.test(sArr[i])) {
                mFlag = false;
            } else {
                xyCount++;
            }
        }

        return paper.path(npArr.join('')).attr({
            fill: fill,
            stroke: stroke
        });

    };

    gb.CLOUD = CLOUD;
})(window);