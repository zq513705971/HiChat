import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import * as style from '../styles/app.css';

@observer // 监听当前组件
export default class ChatContactItem extends React.Component {
    constructor(props) {
        super(props);
    }

    _onSelect = () => {
        var { data, store } = this.props;
        store.selectTarget(data);
    }

    render() {
        var { data, store } = this.props;
        var { selectedTarget } = store;
        return (
            <div className="contact-item" onClick={this._onSelect}>
                <div className="contact-image">
                    <img src={require("../images/temp.png")} className="icon" />
                </div>
                <div className="contact-content">
                    <div className="target">{data.targetName}
                    </div>
                    <div className="recent">
                        <div className="recent-msg">
                            {
                                data.recent && data.recent.content
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}