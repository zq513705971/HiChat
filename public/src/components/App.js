import React from 'react';
import io from 'socket.io-client';
import * as style from '../styles/app.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appKey: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
            socket: undefined,
            info: 'helloworld',
            userName: '',
            connected: false,
            logined: false
        };

        this.onConnect = this.onConnect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        var self = this;
        const socket = io.connect('http://localhost:3000/' + self.state.appKey, {});
        socket.on('connect', function () {
            console.log('connected to server++++++++++++++++');
            //socket.send('Hi Server...'); 
            self.setState({
                connected: true
            });
        });
        self.setState({
            socket: socket
        });
    }

    onClick() {
        var { socket } = this.state;

        var data = {
            targetId: "shaoqin",
            conversationType: 'PRIVATE',
            content: "helloworld"
        };
        console.log("onClick", data)
        socket.emit("sendMsg", data);
    }

    onConnect() {
        var { socket, connected } = this.state;

        var self = this;
        socket.emit('user/signIn', { userName: this.state.userName }, function (data) {
            //console.log(data);
            self.setState({
                info: JSON.stringify(data),
                logined: true
            });
        });
        socket.on("receivedMsg", function (data) {
            console.log("receivedMsg", data);
        });
        socket.on("newSignIn", function (data) {
            console.log("newSignIn", data);
        });
        socket.on("disconnect", () => {
            self.setState({
                connected: false
            });
        });
    }

    onChange(e) {
        this.setState({
            userName: e.target.value
        });
    }

    render() {
        return (
            <div className="app">
                <input type="text" value="" placeholder="请输入昵称" value={this.state.userName} onChange={this.onChange} />
                <input onClick={this.onConnect} type="button" value="连接" />
                <div>{this.state.info}</div>
                <input onClick={this.onClick} type="button" value="发送消息" />
            </div>
        );
    }
}

export default App;
