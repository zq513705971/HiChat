import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ChatMessage from './ChatMessage';

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
                                return <ChatMessage store={store} key={history.messageId} message={history} />
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