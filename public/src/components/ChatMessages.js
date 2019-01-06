import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ChatMessage from './ChatMessage';
import Utils from '../utils/Utils';

@observer // 监听当前组件
export default class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
    }

    _scrollToBottom = () => {
        var scroll = this.refs.scroll;
        var scrollHeight = scroll.scrollHeight;
        scroll.scrollTo(0, scrollHeight);
    }

    componentDidMount() {
        this._scrollToBottom();
    }

    componentDidUpdate() {
        this._scrollToBottom();
    }

    render() {
        var { store } = this.props;
        var { historys } = store;
        return (
            <div ref={"scroll"} className="scroll">
                <div className="list">
                    {
                        historys && historys.length > 0 ?
                            historys.map((history) => {
                                var key = Utils.random(5);
                                return <ChatMessage store={store} key={history.messageId + "-" + key} message={history} />
                            })
                            : <div className="none">
                                开始畅聊吧~~~
                        </div>
                    }
                </div>
            </div>
        );
    }
}