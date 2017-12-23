import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

const CSS = css({
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
});

export default class Tab extends React.Component {
    render() {
        return (
            <div className={ CSS }>
                { this.props.children }
            </div>
        );
    }
}

Tab.propTypes = {
    title: PropTypes.string
};
