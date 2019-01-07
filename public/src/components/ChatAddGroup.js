import React from 'react';
import { observer, inject } from "mobx-react";
import wrapper from './wrapper';

@observer // 监听当前组件
@wrapper
export default class ChatAddGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    render() {
        var { store } = this.props;
        return (
            <div className="op-target">
                <div className="header">
                    创建群组
            </div>
                <div className="body">
                    <input type="text" placeholder="请输入新建群组名称..." onChange={(e) => {
                        this.setState({
                            value: e.target.value
                        });
                    }} value={this.state.value} />
                </div>
                <div className="footer">
                    <div className="btn">
                        <input className="ok" type="button" value="确定" onClick={() => {
                            if (this.state.value.length == 0) {
                                alert("请输入内容...");
                                return;
                            }
                            this.props.onComplate && this.props.onComplate(this.state.value);
                        }} />
                    </div>
                    <div className="btn">
                        <input className="cancel" type="button" value="取消" onClick={() => {
                            this.props.onCancel && this.props.onCancel();
                        }} />
                    </div>
                </div>
            </div>
        );
    }
}