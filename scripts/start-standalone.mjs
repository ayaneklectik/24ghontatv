import { existsSync, mkdirSync, cpSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, join } from 'node:path';

const root = process.cwd();
const standalone = resolve(root, '.next', 'standalone');
const standaloneServer = join(standalone, 'server.js');

if (!existsSync(standaloneServer)) {
  console.error('Production standalone server is missing. Run `npm run build` first.');
  process.exit(1);
}

const staticSource = resolve(root, '.next', 'static');
const staticTarget = join(standalone, '.next', 'static');
if (existsSync(staticSource) && !existsSync(staticTarget)) {
  mkdirSync(resolve(standalone, '.next'), { recursive: true });
  cpSync(staticSource, staticTarget, { recursive: true });
}

const publicSource = resolve(root, 'public');
const publicTarget = join(standalone, 'public');
if (existsSync(publicSource) && !existsSync(publicTarget)) {
  cpSync(publicSource, publicTarget, { recursive: true });
}

const env = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || 'production',
  HOSTNAME: process.env.HOSTNAME || '127.0.0.1',
  PORT: process.env.PORT || '3000',
};

const child = spawn(process.execPath, [standaloneServer], {
  stdio: 'inherit',
  env,
});

const forward = (signal) => child.kill(signal);
process.on('SIGINT', () => forward('SIGINT'));
process.on('SIGTERM', () => forward('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
