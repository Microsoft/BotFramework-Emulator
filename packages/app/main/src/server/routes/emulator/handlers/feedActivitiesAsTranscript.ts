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

import { Next, Request, Response } from 'restify';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';

import { EmulatorRestServer } from '../../../restServer';
import { WebSocketServer } from '../../../webSocketServer';
import { Conversation } from '../../../state/conversation';

/** Feed activities into the conversation as a transcript */
export function createFeedActivitiesAsTranscriptHandler(emulatorServer: EmulatorRestServer) {
  return (req: Request, res: Response, next: Next): any => {
    const { conversationId } = req.params;
    let activities = req.body;

    try {
      const conversation: Conversation = emulatorServer.state.conversations.conversationById(conversationId);
      if (!conversation) {
        res.send(NOT_FOUND, `Could not find conversation with id: ${conversationId}`);
        return next();
      }
      activities = conversation.prepTranscriptActivities(activities);
      activities.forEach(activity => {
        WebSocketServer.sendToSubscribers(conversation.conversationId, activity);
        emulatorServer.logger.logActivity(conversation.conversationId, activity, activity.recipient.role);
      });
    } catch (e) {
      res.send(INTERNAL_SERVER_ERROR, e);
      return next();
    }

    res.send(OK);
    res.end();
    next();
  };
}
