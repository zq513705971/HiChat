import React from 'react';
import { observer, inject } from "mobx-react";
import io from 'socket.io-client';

import Login from './Login';
import Chat from './Chat';

@inject(["chatStore"]) // 注入对应的store
@observer // 监听当前组件
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            store: this.props.chatStore
        };
    }

    componentDidMount() {
        var self = this;
    }

    render() {
        var { store } = this.state;
        var { logined, connected } = store;
        return (
            !logined ?
                <Login store={store} /> : <Chat store={store} />
        );
    }
}

export default App;
