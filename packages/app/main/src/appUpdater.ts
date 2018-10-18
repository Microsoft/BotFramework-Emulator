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

import { autoUpdater as electronUpdater, UpdateInfo } from 'electron-updater';
import * as process from 'process';
import * as semver from 'semver';
import { EventEmitter } from 'events';
import { ProgressInfo } from 'builder-util-runtime';

export enum UpdateStatus {
  Idle,
  CheckingForUpdate,
  UpdateAvailable,
  UpdateDownloading,
  UpdateReadyToInstall,
}
let pjson;
export const AppUpdater = new class extends EventEmitter {
  private _userInitiated: boolean;
  private _autoDownload: boolean;
  private _status: UpdateStatus = UpdateStatus.Idle;
  private _allowPrerelease: boolean;
  private _updateDownloaded: boolean;
  private _downloadProgress: number;

  public get userInitiated() {
    return this._userInitiated;
  }

  public get status(): UpdateStatus {
    return this._status;
  }

  public get downloadProgress(): number {
    return this._downloadProgress;
  }

  public get updateDownloaded(): boolean {
    return this._updateDownloaded;
  }

  startup() {
    this._allowPrerelease = (process.argv.indexOf('--prerelease') >= 0);

    // Allow update to prerelease if this is a prerelease
    try {
      pjson = require('../../package.json');
      const rc = semver.prerelease(pjson.version);
      if (rc && rc.length) {
        this._allowPrerelease = true;
      }
    } catch (err) {
      console.error(err);
    }

    electronUpdater.logger = null;

    electronUpdater.setFeedURL({
      repo: 'BotFramework-Emulator',
      owner: 'Microsoft',
      provider: 'github'
    });

    electronUpdater.on('checking-for-update', () => {
      this._status = UpdateStatus.CheckingForUpdate;
      this.emit('checking-for-update');
    });
    electronUpdater.on('update-available', (updateInfo: UpdateInfo) => {
      if (!this._autoDownload) {
        this._status = UpdateStatus.Idle;
        this.emit('update-available', updateInfo);
      }
    });
    electronUpdater.on('update-not-available', (updateInfo: UpdateInfo) => {
      this._status = UpdateStatus.Idle;
      this.emit('up-to-date', updateInfo);
    });
    electronUpdater.on('error', (err: Error, message: string) => {
      this._status = UpdateStatus.Idle;
      this.emit('error', err, message);
    });
    electronUpdater.on('download-progress', (progress: ProgressInfo) => {
      this._status = UpdateStatus.UpdateDownloading;
      this._downloadProgress = progress.percent;
      this.emit('download-progress', progress);
    });
    electronUpdater.on('update-downloaded', (updateInfo: UpdateInfo) => {
      this._status = UpdateStatus.UpdateReadyToInstall;
      this._updateDownloaded = true;
      this.emit('update-downloaded', updateInfo);
    });
  }

  public checkForUpdates(userInitiated: boolean = false, autoDownload: boolean = false) {
    try {
      if (electronUpdater) {
        this._status = UpdateStatus.CheckingForUpdate;
        this._userInitiated = userInitiated;
        this._autoDownload = autoDownload;
        electronUpdater.allowPrerelease = this._allowPrerelease;
        electronUpdater.autoDownload = autoDownload;
        electronUpdater.allowDowngrade = false;
        electronUpdater.autoInstallOnAppQuit = true;
        if (process.env.NODE_ENV === 'development') {
          (electronUpdater as any).currentVersion = (pjson || {}).version;
        }
        electronUpdater.checkForUpdates()
          .catch(err => {
            console.error(err);
          });
      }
    } catch (e) {
      console.error(e);
    }
  }

  public quitAndInstall() {
    try {
      electronUpdater.quitAndInstall(false, true);
    } catch (e) {
      console.error(e);
    }
  }
};
