const ws = require('nodejs-websocket');
const robot = require('robot-util');
const { recognize } = require('./index');

const port = 8888;
var timerID = null;

// 开发者工具，最上方选项栏的y:98,第二级选项栏的y:125
var topLevel_Y = 98, secondLevel_Y = 125;
var originPos_X = 0;

var consoleX_fromOrigin = 100, elementsX_fromOrgin = 160, networkX_fromOrigin = 250, applicationX_fromOrigin = 395;
var cacheX_fromNetwork = 285;

function handleRecognize(svg) {
    let res = '0000';
    try {
        res = recognize(svg);
        return res;
    } catch(e) {
        throw e;
    }
}

function updateOriginPos(window_innerWidth) {
    originPos_X = window_innerWidth;
}
// 这里要使用浏览器缓存
function handleCache() {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
        let networkPos = {
            x: originPos_X + networkX_fromOrigin,
            y: topLevel_Y
        }
        let cachePos = {
            x: originPos_X + cacheX_fromNetwork,
            y: secondLevel_Y
        }
        console.log('----move to network---');
        // 选择Network
        robot.moveMouse(networkPos);
        robot.setMouseDelay(1000);
        robot.mouseClickLeft(networkPos);
        console.log('---close disable cache---');
        robot.setMouseDelay(1000);
        robot.moveMouse(cachePos);
        robot.setMouseDelay(1000);
        robot.mouseClickLeft(cachePos);

        // 将鼠标位置移出cache选项
        robot.setMouseDelay(1000);
        robot.moveMouse({
            x: originPos_X,
            y: topLevel_Y
        });

    }, 3000);
}

const server = ws.createServer( connect => {
    connect.on('text', data => {
        try {
            let jsonData = JSON.parse(data);
            if(jsonData._type === 'windowSize') {
                updateOriginPos(jsonData.window_innerWidth);
                handleCache();
                return;
            }
            let code = handleRecognize(jsonData.svg);
            let dateTime = new Date().toLocaleString();
            console.log('time:', dateTime, '---识别结果：', code);
            connect.sendText(code);
        } catch(e) {
            console.log('识别code出错--', e);
        }
    });

    connect.on('close', data => {
        console.log('---close----data----', data);
    });

    connect.on('error', data => {
        console.log('---error----data----', data);
    });
});

server.listen(port, () => {
    console.log('--websocket服务已经启动----，端口：', port);
});