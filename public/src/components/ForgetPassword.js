import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class ForgetPassword extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { store } = this.props;
        var { image, name } = store;
        return (
            <div className="register-form">
                <div className="header">
                    <div className="title">忘记密码</div>
                    <div className="close" onClick={() => {
                        this.props.onClose && this.props.onClose();
                    }}>×</div>
                </div>
                <div className="block">
                    <div className="input">
                        <input type="text" placeholder="请输入用户名." value="" />
                    </div>
                    <div className="input">
                        <input type="password" placeholder="请输入密码." value="" />
                    </div>
                    <div className="input">
                        <input type="password" placeholder="请输入确认密码." value="" />
                    </div>
                    <div className="btn">
                        <input type="button" value="注册" onClick={() => {

                        }} />
                    </div>
                </div>
            </div>
        );
    }
}