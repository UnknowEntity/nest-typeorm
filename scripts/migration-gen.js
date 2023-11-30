/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { ChildProcess, spawn } = require('child_process');
const { readdirSync } = require('fs');
const { join } = require('path');

const COMMAND = {
  npx: {
    windows: 'npx.cmd',
    others: 'npx',
  },
  npm: {
    windows: 'npm.cmd',
    others: 'npm',
  },
};

/**
 *
 * @param {string} command
 */
function getCorrectCommand(command) {
  if (!COMMAND[command]) {
    throw new Error('Command not found', command);
  }

  const commandOptions = COMMAND[command];

  if (process.platform === 'win32') {
    return commandOptions['windows'];
  }

  return commandOptions['others'];
}

async function main() {
  console.log('1. Transform to JS Model');
  await childProcessToPromise(
    spawn(getCorrectCommand('npx'), [
      'tsc',
      '--project',
      join(process.cwd(), 'db-configuration', 'tsconfig.db.json'),
    ]),
  );

  const models = readdirSync(join(process.cwd(), 'entities-js'))
    .filter((file) => file.endsWith('.entity.js'))
    .map((filename) => filename.split('.')[0].toUpperCase());

  console.log('Models:');
  console.log(models.join('\n'));

  console.log('2. Generate Entities File');
  await childProcessToPromise(
    spawn(getCorrectCommand('npx'), [
      'ts-node',
      join(process.cwd(), 'scripts', 'helpers', 'generate-template.ts'),
    ]),
  );

  console.log('3. Run Prettier');

  await childProcessToPromise(
    spawn(getCorrectCommand('npx'), [
      'prettier',
      '-w',
      join(process.cwd(), 'db-configuration', 'entity.config.js'),
    ]),
  );

  console.log('4. Generate Migration');

  await childProcessToPromise(
    spawn(getCorrectCommand('npm'), [
      'run',
      'typeorm:generate',
      '---',
      '-o',
      '-p',
      join(process.cwd(), 'db-configuration', 'migrations', process.argv[2]),
    ]),
  );
}

/**
 *
 * @param {ChildProcess} childProcess
 */
async function childProcessToPromise(childProcess) {
  return new Promise((resolve, reject) => {
    childProcess.stdout.on('data', (chunk) =>
      console.log(chunk.toString('utf8')),
    );

    childProcess.on('error', console.error);

    childProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code === 1) {
        reject();
        return;
      }
      resolve();
    });
  });
}

main().catch(console.error);
