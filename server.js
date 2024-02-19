const ws = require('nodejs-websocket');
const { recognize } = require('./index')

const port = 8888;

const server = ws.createServer( connect => {
    connect.on('text', data => {
        try {
            let jsonData = JSON.parse(data);
            let code = recognize(jsonData.svg);
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