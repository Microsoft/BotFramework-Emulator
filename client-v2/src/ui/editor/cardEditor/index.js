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

import { css } from 'glamor';
import PropTypes from 'prop-types';
import React from 'react';

import CardJsonEditor from './cardJsonEditor';
import CardOutput from './cardOutput';
import CardPreview from './cardPreview';
import CardTemplator from './cardTemplator';
import Splitter from '../../layout/splitter';

const CSS = css({
    display: "flex",
    position: "relative",
    flexFlow: "row nowrap",
    height: "100%",
    width: "100%",
    backgroundColor: "white",

    " *": { boxSizing: "border-box" },

    " .card-right-panel": {
        display: "flex",
        flexFlow: "column nowrap",
        height: "100%",
        width: "100%",
        padding: "0 24px"
    },

    " .card-horizontal-splitter": {
        width: "100%",
        height: "32px",
        flexShrink: "0",
        cursor: "ns-resize"
    },

    " .card-json-editor-container": {
        height: "100%",
        width: "100%",
        padding: "24px"
    }
});

export default class CardEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.onChangeVerticalSplit = this.onChangeVerticalSplit.bind(this);
        this.saveJsonEditorContainer = this.saveJsonEditorContainer.bind(this);

        this.state = { containerWidth: null };
    }

    // called when the vertical splitter is moved
    onChangeVerticalSplit(newSecondaryPaneSize) {
        const containerWidth = this.editorContainer.getBoundingClientRect().width;
        this.setState(() => ({ containerWidth: containerWidth }));
    }

    saveJsonEditorContainer(element) {
        this.editorContainer = element;
    }

    render() {
        return(
            <div {...CSS}>
                <Splitter
                    vertical={ false }
                    onSecondaryPaneSizeChange={ this.onChangeVerticalSplit }
                >
                    <div className="card-json-editor-container" ref={ this.saveJsonEditorContainer }>
                        <CardJsonEditor cardId={ this.props.cardId } editorWidth={ this.state.containerWidth } />
                    </div>

                    <div className="card-right-panel">
                        <CardPreview cardId={ this.props.cardId } />
                        <CardTemplator cardId={ this.props.cardId } />
                        <CardOutput cardId={ this.props.cardId } />
                    </div>
                </Splitter>
            </div>
        );
    }
}

CardEditor.propTypes = {
    cardId: PropTypes.string.isRequired
};
