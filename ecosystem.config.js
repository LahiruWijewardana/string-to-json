module.exports = {
  apps: [{
    name: 'StringToJsonConverter',
    script: 'index.js',
    error_file: '/home/ubuntu/.pm2/logs/StringToJsonConverter-error.log',
    out_file: '/home/ubuntu/.pm2/logs/StringToJsonConverter-out.log',
    merge_logs: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
