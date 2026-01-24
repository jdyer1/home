const { spawn } = require('child_process');
const waitOn = require('wait-on');

let serverProcess;

module.exports = async () => {
  // Start Next.js dev server
  serverProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  // Wait for the server to be ready
  await waitOn({
    resources: ['http://localhost:3000'],
    timeout: 30000,
    interval: 500,
    window: 1000,
    validateStatus: status => status === 200,
  });

  // Store server process for teardown
  global.__NEXT_SERVER_PROCESS__ = serverProcess;
};
