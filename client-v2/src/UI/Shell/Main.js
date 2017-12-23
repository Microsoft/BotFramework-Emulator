import { connect } from 'react-redux';
import { css } from 'glamor';
import React from 'react';

import AssetExplorer from './AssetExplorer';
import BotExplorer from './BotExplorer';
import Editor from '../Editor';
import EmulatorEditor from './EmulatorEditor';
import ExplorerBar from './ExplorerBar';
import MultiTabs from './MultiTabs';
import NavBar from './NavBar';
import Tab from './MultiTabs/Tab';

css.global('html, body, #root', {
    height: '100%',
    margin: 0,
    minHeight: '100%',
    overflow: 'hidden'
});

const CSS = css({
    backgroundColor: 'yellow',
    display: 'flex',
    minHeight: '100%'
});

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleTabChange = this.handleTabChange.bind(this);

        this.state = {
            tabValue: 0
        };
    }

    handleTabChange(nextTabValue) {
        this.setState(() => ({ tabValue: nextTabValue }));
    }

    render() {
        return (
            <div className={ CSS }>
                <NavBar />
                <ExplorerBar>
                    <BotExplorer />
                    <AssetExplorer />
                </ExplorerBar>
                <MultiTabs
                    onChange={ this.handleTabChange }
                    value={ this.state.tabValue }
                >
                    {
                        this.props.documents.map(document =>
                            <Tab title={ document.title }>
                                <Editor document={ document } />
                            </Tab>
                        )
                    }
                </MultiTabs>
            </div>
        );
    }
}

export default connect(state => ({
    documents: state.editor.documents
}))(Main)
