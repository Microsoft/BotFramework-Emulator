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

import { Middleware } from 'redux';
import { ipcRenderer } from 'electron';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const forwardToMain: Middleware = _store => next => action => {
  // ensure that the action is FSA compliant (https://github.com/redux-utilities/flux-standard-action#actions)
  if (!action.type) {
    return next(action);
  }
  // prevent an endless loop of forwarding the action over ipc
  if ((action as any).meta && (action as any).meta.doNotForward) {
    return next(action);
  }

  try {
    // Electron 9 does not allow functions to be sent over ipc (https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendchannel-args)
    // JSON.stringify() removes function properties from objects -- these functions do not need to be maintained in the main process' copy of state
    const processedAction = JSON.parse(JSON.stringify(action));

    // forward the action over ipc to the main process
    ipcRenderer.sendSync('sync-store', processedAction);
    return next(action);
  } catch (e) {
    if (e.message && e.message.includes('circular structure')) {
      // the payload of the action contains a circular JSON structure and cannot be stringified;
      // skip forwarding the action to the main process
      return next(action);
    }
    throw e;
  }
};
