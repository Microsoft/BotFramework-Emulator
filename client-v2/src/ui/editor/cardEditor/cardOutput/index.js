//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import { connect } from 'react-redux'
import { css } from 'glamor'
import React from 'react'
import AdaptiveCardOutputMessage from '../cardOutputMessage';
import { clearCardOutputWindow } from '../../../../data/action/cardActions';

const CSS = css({
    width: "100%",
    height: "100%",
    margin: "12px 0 24px 0",
    fontFamily: "Segoe UI",
    overflow: "hidden",

    " .output-header": {
        paddingLeft: "24px",
        fontFamily: "Segoe UI Semibold",
        textTransform: "uppercase",
        backgroundColor: "#F5F5F5",
        width: "100%",
        height: "24px",
        display: "flex",
        color: "#2B2B2B",
        borderBottom: "1px solid #C6C6C6",

        " > span": {
            display: "flex",
            marginLeft: "auto",
            marginRight: "16px",
            cursor: "pointer"
        }
    },

    " .output-content": {
        overflow: "auto",
        height: "calc(100% - 24px)",
        width: "100%",
        padding: "16px",
        userSelect: "none"
    }
});

const debug = css({ backgroundColor: "white", border: "1px solid black" });

class CardOutput extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.clearOutput = this.clearOutput.bind(this);
    }

    // clears the messages in the output window
    clearOutput() {
        this.props.dispatch(clearCardOutputWindow());
    }

    render() {
        return (
            <div {...CSS} {...debug}>
                <span className="output-header">Output <span onClick={ this.clearOutput }>X</span></span>
                <div className="output-content">
                    {
                        this.props.messages && this.props.messages.length ?
                            this.props.messages.map(msg =>
                                <AdaptiveCardOutputMessage key={ msg } message={ msg } />
                            )
                        :
                            <span>Output is empty...</span>
                    }
                </div>
            </div>
        );
    }
}

export default connect((state, { cardId }) => ({
    messages: state.card.cards[cardId].cardOutput
}))(CardOutput);
