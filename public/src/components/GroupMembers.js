import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class GroupMembers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            memebers: []
        };
    }

    componentDidMount() {
        var { store, target } = this.props;
        store.getMembers(target.targetId, (list) => {
            console.log(list)
            this.setState({
                memebers: list
            });
        });
    }

    render() {
        var { store, target } = this.props;
        return (
            <div className="group-members">
                <div className="header">群组成员</div>
                <div className="block">
                    <div className="list"></div>
                </div>
            </div>
        );
    }
}