
import { Card, message } from 'antd';
import { useEffect } from 'react';
import { newTerminal } from '../../../utils/terminalUtils';

const terminalTitleTemplate = '[log]#'

const config = {
    // 渲染类型
    rendererType: 'canvas',
    // 是否禁用输入
    disableStdin: false,
    // 光标样式
    cursorStyle: 'underline',
    // 启用时光标将设置为下一行的开头
    convertEol: true,
    // 终端中的回滚量
    scrollback: 300,
    fontSize: 14,
    // 行数
    rows: 28,
    // 光标闪烁
    cursorBlink: true,
    theme: {
        //   字体
        foreground: '#ffffff',
        background: '#000000',
        // 光标
        cursor: 'help',
        lineHeight: 18,
    },
}

const GameLog2 = (props) => {
    // const [data] = useState({path: props.data});
    // console.log(data)
    useEffect(() => {
        
        const terminal = newTerminal(config, terminalTitleTemplate, props.id)
        if(!!window.WebSocket && window.WebSocket.prototype.send) {
            // message.success('您的浏览器支持Websocket通信协议')
        } else{
            message.error('对不起, 您的浏览器不支持Websocket通信协议')
        }
        // 这里的转发标识为/ws
        let wsPath
        if(window.location.host === 'localhost:3000') {
            wsPath = "ws://1.12.223.51:8083/ws"
        } else {
            wsPath = `ws://${window.location.host}/ws`
        }
        const socket = new WebSocket(wsPath)
        socket.onopen= ()=> {
            console.log("webSocket连接成功")
            socket.send("nihao")
            const message = `tailf ${props.path}`
            console.log('path',props.path)
            socket.send(message)
        }
        socket.onerror= ()=> {
            console.log("连接错误");
        }
        socket.onmessage = (e)=> {
            
            terminal.term.writeln(e.data)
        }
        socket.onclose = (e)=> {
            console.log('webSocket 关闭了');
        }
        return ()=> socket.close()
    }, [props.path])


    return (
        <div className="container-children" style={{ height: "100%" }}>
            <div id={props.id}  />
        </div>
    )
}

export default GameLog2