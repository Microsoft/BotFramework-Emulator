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

import { call, put, takeEvery } from 'redux-saga/effects';
import { dialog, OpenDialogOptions } from 'electron';

import * as AssetExplorerActions from '../../action/assetExplorer';

export default function* promptOpenFolder() {
    yield takeEvery(AssetExplorerActions.PROMPT_OPEN_FOLDER, function* () {
        try {
            // TODO: Fix TypeScript error
            const filePath = yield call(showOpenDialog as any, { properties: ['openDirectory'] });

            // TODO: Instead of adding the folder to the store, we want to create a file watcher
            //       and automatically update store when there is a file system change
            yield put(AssetExplorerActions.openFolder(filePath));
        } catch (err) {
            if (err.message !== 'user cancelled') {
                throw err;
            }
        }
    });
}

function showOpenDialog(options: OpenDialogOptions) {
    return new Promise((resolve, reject) => {
        dialog.showOpenDialog(options, filePaths => {
            const filePath = filePaths && filePaths[0];

            filePath ? resolve(filePath) : reject(new Error('user cancelled'));
        });
    });
}
