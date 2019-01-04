import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ChatDialogWin from './ChatDialogWin';

@observer // 监听当前组件
export default class ChatDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { store } = this.props;
        var { selectedTarget } = store;
        //console.log(selectedTarget && selectedTarget.targetName)
        return (
            <div className="dialog">
                {
                    selectedTarget ?
                        <ChatDialogWin store={store} target={selectedTarget} /> :
                        <div className="none">
                            开启您的无限畅聊吧！
                        </div>
                }
            </div>
        );
    }
}