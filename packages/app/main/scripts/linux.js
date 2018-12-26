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

writeLatestYmlFile().catch(e => console.error(e));

/** Generates latest-linux.yml & latest-linux-ia32.yml */
async function writeLatestYmlFile() {
  const common = require('./common');
  const packageJson = require('../package.json');
  const path = require('path');
  const { hashFileAsync } = common;

  const version = process.env.EMU_VERSION || packageJson.version;
  const releaseFileNameBase = `BotFramework-Emulator-${version}-linux`;

  const thirtyTwoBitReleaseFileName = `${releaseFileNameBase}-i386.AppImage`;
  const thirtyTwoBitSha512 = await hashFileAsync(path.normalize(`./dist/${thirtyTwoBitReleaseFileName}`));

  const sixtyFourBitReleaseFileName = `${releaseFileNameBase}-x86_64.AppImage`;
  const sixtyFourBitSha512 = await hashFileAsync(path.normalize(`./dist/${sixtyFourBitReleaseFileName}`));

  const releaseDate = new Date().toISOString();

  performWrite(
    thirtyTwoBitReleaseFileName,
    'latest-linux-ia32.yml',
    thirtyTwoBitSha512,
    releaseDate,
    version
  );

  performWrite(
    sixtyFourBitReleaseFileName,
    'latest-linux.yml',
    sixtyFourBitSha512,
    releaseDate,
    version
  );
};

function performWrite(releaseFilename, yamlFilename, fileHash, releaseDate, version) {
  const fsp = require('fs-extra');
  const yaml = require('js-yaml');
  const path = require('path');

  const ymlInfo = {
    version,
    releaseDate,
    githubArtifactName: releaseFilename,
    path: releaseFilename,
    sha512: fileHash
  };
  const ymlStr = yaml.safeDump(ymlInfo);
  fsp.writeFileSync(path.normalize(`./dist/${yamlFilename}`), ymlStr);
}
