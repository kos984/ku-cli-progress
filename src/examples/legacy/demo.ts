import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';
import * as chalk from 'chalk';

async function demo(path) {
  const cancelChildProcess = new AbortController();
  const p = child_process.fork(path, { signal: cancelChildProcess.signal });
  setTimeout(() => cancelChildProcess.abort('timeout'), 10000);
  return new Promise((resolve, reject) => {
    p.on('exit', code => {
      return code === 0
        ? resolve('ok')
        : reject(new Error(path + 'exit with code:' + code));
    }).on('error', err => {
      if ((err as Error & { code?: string })?.code === 'ABORT_ERR') {
        if (cancelChildProcess.signal.aborted) {
          return resolve(cancelChildProcess);
        }
      }
      return reject(err);
    });
  });
}

async function run() {
  const files = (await fs.promises.readdir(__dirname)).filter(name =>
    name.endsWith('example.ts'),
  );

  for (const file of files) {
    // eslint-disable-next-line no-console
    console.log(chalk.cyan('DEMO: ' + file));
    // eslint-disable-next-line no-console
    console.log(chalk.cyan('#'.repeat(process.stdout.columns)));
    await demo(path.join(__dirname, file));
  }
}

// eslint-disable-next-line no-console
run().catch(e => console.error(e));
