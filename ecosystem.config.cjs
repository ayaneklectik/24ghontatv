module.exports = {
  apps: [
    {
      name: '24ghonta-frontend',
      cwd: '/var/www/24ghonta/frontend',
      script: '.next/standalone/server.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '768M',
      time: true,
      kill_timeout: 5000,
    },
  ],
};
