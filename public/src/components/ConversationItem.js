import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class ConversationItem extends React.Component {
    constructor(props) {
        super(props);
    }

    _onClick = () => {
        var { item, store } = this.props;
        store.selectTarget(item);
    }

    render() {
        var { item, store } = this.props;
        //console.log(item);
        return (
            <div className={["item", item.conversationType].join(' ')} onClick={this._onClick}>
                <div className="image">
                    <div className="circle">
                        <img src={item.image || require("../images/temp.png")} className="icon" />
                    </div>
                </div>
                <div className="info">
                    <div className="name">{item.targetName}</div>
                    <div className="recent">
                        {
                            item.recent && item.recent.content
                        }
                    </div>
                </div>
            </div>
        );
    }
}