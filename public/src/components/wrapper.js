import React from 'react';
const wrapper = WrappedComponent => {
    return class extends React.Component {
        render() {
            return (
                <div className="wrapper">
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    }
}
export default wrapper;