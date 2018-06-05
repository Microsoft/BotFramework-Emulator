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

import { BotConfigWithPath, BotConfigWithPathImpl, uniqueId } from '@bfemulator/sdk-shared';
import {
  Checkbox,
  Colors,
  Column,
  MediumHeader,
  PrimaryButton,
  Row,
  RowJustification,
  TextInputField
} from '@bfemulator/ui-react';
import { css } from 'glamor';
import { EndpointService } from 'msbot/bin/models';
import { IEndpointService, ServiceType } from 'msbot/bin/schema';
import * as React from 'react';

import { CommandServiceImpl } from '../../platform/commands/commandServiceImpl';
import { ActiveBotHelper } from '../helpers/activeBotHelper';
import { DialogService } from './service';

const CSS = css({
  backgroundColor: Colors.DIALOG_BACKGROUND_DARK,
  padding: '32px',
  width: '648px',

  '& .multi-input-row > *': {
    marginLeft: '8px'
  },

  '& .multi-input-row > *:first-child': {
    marginLeft: 0
  },

  '& .button-row': {
    marginTop: '48px'
  },

  '& .bot-create-header': {
    color: Colors.DIALOG_FOREGROUND_DARK,
    marginBottom: '16px'
  },

  '& .secret-checkbox': {
    paddingBottom: '8px',
    color: Colors.DIALOG_FOREGROUND_DARK
  },

  '& .bot-creation-input': {
    border: `solid 1px ${Colors.DIALOG_INPUT_BORDER_DARK}`
  },

  /*
  '& .text-input-label, & input': {
    color: Colors.INPUT_TEXT_DARK
  },

  '& input::placeholder': {
    color: Colors.INPUT_TEXT_PLACEHOLDER_DARK
  },
  */

  '& .bot-creation-cta': {
    minWidth: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textDecoration: 'none',
    color: Colors.APP_HYPERLINK_FOREGROUND_DARK,
    flexShrink: 0,

    ':hover': {
      color: Colors.APP_HYPERLINK_FOREGROUND_DARK
    }
  },

  '& .small-input': {
    width: '200px',
    flexShrink: 0
  },

  '& .secret-row': {
    paddingLeft: '24px',

    '& > .secret-input': {
      width: '176px'  // 200 - 24px
    }
  }
});

export interface BotCreationDialogState {
  bot: BotConfigWithPath;
  endpoint: IEndpointService;
  secret: string;
  secretEnabled: boolean;
  secretsMatch: boolean;
  secretConfirmation: string;
}

export class BotCreationDialog extends React.Component<{}, BotCreationDialogState> {
  constructor(props: {}, context: BotCreationDialogState) {
    super(props, context);

    this.state = {
      bot: BotConfigWithPathImpl.fromJSON({
        name: '',
        description: '',
        secretKey: '',
        services: [],
        path: ''
      }),
      endpoint: new EndpointService({
        type: ServiceType.Endpoint,
        name: '',
        id: uniqueId(),
        appId: '',
        appPassword: '',
        endpoint: ''
      }),
      secret: '',
      secretEnabled: false,
      secretsMatch: false,
      secretConfirmation: ''
    };
  }

  render(): JSX.Element {
    const secretCriteria = this.state.secretEnabled ? this.state.secret && this.state.secretsMatch : true;

    const requiredFieldsCompleted = this.state.bot
      && this.state.endpoint.endpoint
      && this.state.bot.name
      && secretCriteria;
    // TODO - localization
    return (
      <div {...CSS}>
        <Column>
          <MediumHeader className="bot-create-header">New bot configuration</MediumHeader>
          <TextInputField className="c" inputClassName="bot-creation-input" value={this.state.bot.name}
            onChanged={this.onChangeName} label={'Bot name'} required={true} />
          <TextInputField inputClassName="bot-creation-input" value={this.state.endpoint.endpoint}
            onChanged={this.onChangeEndpoint}
            placeholder={'Enter a URL for your bot\'s endpoint'} label={'Endpoint URL'}
            required={true} />
          <Row className="multi-input-row">
            <TextInputField
              className="small-input" inputClassName="bot-creation-input" value={this.state.endpoint.appId}
              onChanged={this.onChangeAppId} label={'MSA app ID'} placeholder={'Optional'} />
            <TextInputField className="small-input" inputClassName="bot-creation-input"
              value={this.state.endpoint.appPassword}
              onChanged={this.onChangeAppPw}
              label={'MSA app password'} placeholder={'Optional'} type={'password'} />
          </Row>
          <Checkbox className={'secret-checkbox'} checked={this.state.secretEnabled}
            onChange={this.onToggleSecret} label={'Encrypt your keys'} id={'bot-secret-checkbox'} />
          {
            this.state.secretEnabled &&
            <Row className="multi-input-row secret-row">
              <TextInputField className="secret-input" inputClassName="bot-creation-input" value={this.state.secret}
                onChanged={this.onChangeSecret}
                required={this.state.secretEnabled} label={'Create a secret'} type={'password'} />
              <TextInputField className="secret-input secret-confirmation" inputClassName="bot-creation-input"
                value={this.state.secretConfirmation} onChanged={this.onChangeSecretConfirmation}
                required={this.state.secretEnabled} label={'Confirm your secret'} type={'password'}
                errorMessage={this.state.secret && !this.state.secretsMatch ? 'Secrets do not match' : null} />
            </Row>
          }
          <Row className="multi-input-row button-row" justify={RowJustification.Right}>
            <PrimaryButton secondary={true} text="Cancel" onClick={this.onCancel} className="cancel-button" />
            <PrimaryButton text="Save and connect" onClick={this.onSaveAndConnect}
              disabled={!requiredFieldsCompleted} className="connect-button" />
          </Row>
        </Column>
      </div>
    );
  }

  private onChangeEndpoint = (ep) => {
    const endpoint = { ...this.state.endpoint, endpoint: ep };
    this.setState({ endpoint });
  }

  private onChangeAppId = (appId) => {
    const endpoint = { ...this.state.endpoint, appId };
    this.setState({ endpoint });
  }

  private onChangeAppPw = (appPassword) => {
    const endpoint = { ...this.state.endpoint, appPassword };
    this.setState({ endpoint });
  }

  private onChangeName = (name) => {
    const bot = { ...this.state.bot, name };
    this.setState({ bot });
  }

  private onCancel = (e) => {
    DialogService.hideDialog();
  }

  private onToggleSecret = (e) => {
    this.setState({ secretEnabled: !this.state.secretEnabled, secret: '' });
  }

  private onSaveAndConnect = async (e) => {
    try {
      const path = await this.showBotSaveDialog();
      if (path) {
        this.performCreate(path);
      } else {
        // user cancelled out of the save dialog
        console.log('Bot creation save dialog was cancelled.');
      }
    } catch (e) {
      console.error('Error while trying to select a bot file location: ', e);
    }
  }

  private performCreate = (botPath: string) => {
    const endpoint: IEndpointService = {
      type: this.state.endpoint.type,
      name: this.state.endpoint.name.trim(),
      id: this.state.endpoint.id.trim(),
      appId: this.state.endpoint.appId.trim(),
      appPassword: this.state.endpoint.appPassword.trim(),
      endpoint: this.state.endpoint.endpoint.trim()
    };

    const bot: BotConfigWithPath = BotConfigWithPathImpl.fromJSON({
      ...this.state.bot,
      name: this.state.bot.name.trim(),
      description: this.state.bot.description.trim(),
      services: [endpoint],
      path: botPath.trim()
    });

    const secret = this.state.secretEnabled && this.state.secret ? this.state.secret : null;

    ActiveBotHelper.confirmAndCreateBot(bot, secret)
      .then(() => DialogService.hideDialog())
      .catch(err => console.error('Error during confirm and create bot: ', err));
  }

  private showBotSaveDialog = async (): Promise<any> => {
    // get a safe bot file name
    const botFileName = await CommandServiceImpl.remoteCall('file:sanitize-string', this.state.bot.name);
    // TODO - Localization
    const dialogOptions = {
      filters: [
        {
          name: 'Bot Files',
          extensions: ['bot']
        }
      ],
      defaultPath: botFileName,
      showsTagField: false,
      title: 'Save as',
      buttonLabel: 'Save'
    };

    return CommandServiceImpl.remoteCall('shell:showSaveDialog', dialogOptions);
  }

  private onChangeSecret = (secret) => {
    this.setState({ secret: secret, secretsMatch: secret === this.state.secretConfirmation });
  }

  private onChangeSecretConfirmation = (confirm) => {
    this.setState({ secretConfirmation: confirm, secretsMatch: confirm === this.state.secret });
  }
}
