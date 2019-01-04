import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from "mobx-react";
import ChatMessage from './ChatMessage';

@observer // 监听当前组件
export default class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { store } = this.props;
        var { historys } = store;

        // historys = historys || [
        //     {
        //         messageId: 1,
        //         time: new Date().getTime(),
        //         direction: "receive",
        //         from: 'zhanqun',
        //         content: '特斯拉Model 3即将获得欧盟销售许可 下月交付大众款 Model 3 成为美国特斯拉公司成立以来最重要的车型，特斯拉正在全球更多市场销售这款受到瞩目的电动车。据外媒最新消息，据一位知情人士透露，特斯拉公司尚未获得欧洲当局的批准在该地区销售 Model 3，但预计这不会妨碍该汽车制造商下个月开始发货。'
        //     }, {
        //         messageId: 2,
        //         time: new Date().getTime(),
        //         direction: "send",
        //         from: 'smallbyte',
        //         content: '新的一年到来，不少媒体开始复盘 2018 年的年度现象。 如果从 2018 年年初算起，直播竞答这爆火后又迅速沉寂的行业现象必然不会被落下。 然而我们回顾这一年，直播竞答仿佛成为直播行业的一次回光返照，此后一年，整个直播行业再无令人瞩目之处。 2018 年的流量红利属于短视频'
        //     }, {
        //         messageId: 3,
        //         time: new Date().getTime(),
        //         direction: "send",
        //         from: 'smallbyte',
        //         content: '新的一年到来，不少媒体开始复盘 2018 年的年度现象。 如果从 2018 年年初算起，直播竞答这爆火后又迅速沉寂的行业现象必然不会被落下。 然而我们回顾这一年，直播竞答仿佛成为直播行业的一次回光返照，此后一年，整个直播行业再无令人瞩目之处。 2018 年的流量红利属于短视频'
        //     }, {
        //         messageId: 4,
        //         time: new Date().getTime(),
        //         direction: "receive",
        //         from: 'zhanqun',
        //         content: '特斯拉Model 3即将获得欧盟销售许可 下月交付大众款 Model 3 成为美国特斯拉公司成立以来最重要的车型，特斯拉正在全球更多市场销售这款受到瞩目的电动车。据外媒最新消息，据一位知情人士透露，特斯拉公司尚未获得欧洲当局的批准在该地区销售 Model 3，但预计这不会妨碍该汽车制造商下个月开始发货。'
        //     }
        // ];
        return (
            <div className="scroll">
                <div className="list">
                    {
                        historys && historys.length > 0 ?
                            historys.map((history) => {
                                return <ChatMessage key={history.messageId} message={history} />
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