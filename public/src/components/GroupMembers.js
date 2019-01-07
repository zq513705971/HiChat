import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";

@observer // 监听当前组件
export default class GroupMembers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: []
        };
    }

    componentDidMount() {
        var { store, target } = this.props;
        store.getMembers(target.targetId, (list) => {
            //console.log(list)
            this.setState({
                members: list
            });
        });
    }

    render() {
        var { store, target } = this.props;
        var { members } = this.state;
        var { loginedUser } = store;
        return (
            <div className="group-members">
                <div className="header">群组成员</div>
                <div className="block">
                    <div className="list">
                        {
                            members && members.map((member) => {
                                return (
                                    <div className="group-member" key={target.targetId + "-" + member.targetId}>
                                        <div className="name">
                                            {member.targetName}
                                        </div>
                                        <div className="flag">
                                            {
                                                member.targetId !== loginedUser.userId
                                                    ?
                                                    <img src={require("../images/add.png")} className="circle" />
                                                    :
                                                    undefined
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}