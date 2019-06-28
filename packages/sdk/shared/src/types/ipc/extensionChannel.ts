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
// from the extension to Emulator
export enum EmulatorChannel {
  EnableAccessory = 'enable-accessory',
  Log = 'logger.log',
  LogError = 'logger.error',
  LogLuisDeepLink = 'logger.luis-editor-deep-link',
  SetAccessoryState = 'set-accessory-state',
  SetHightlightedObjects = 'set-highlighted-objects',
  SetInspectorObjects = 'set-inspector-objects',
  SetInspectorTitle = 'set-inspector-title',
  TrackEvent = 'track-event',
}

// From the Emulator to the extension
export enum ExtensionChannel {
  AccessoryClick = 'accessory-click',
  BotUpdated = 'bot-updated',
  ChatLogUpdated = 'chat-log-updated',
  HighlightedObjectsUpdated = 'highlighted-objects-updated',
  Inspect = 'inspect',
  Theme = 'theme',
  ToggleDevTools = 'toggle-dev-tools',
}
