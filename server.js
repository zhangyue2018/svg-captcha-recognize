const ws = require('nodejs-websocket');
const { recognize } = require('./index')

const port = 8888;

const server = ws.createServer( connect => {
    console.log('====新的连接====');
    connect.on('text', data => {
        console.log('--receive data---', data);
        try {
            let jsonData = JSON.parse(data);
            // console.log('---jsonData---', jsonData);
            let code = recognize(jsonData.svg);
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