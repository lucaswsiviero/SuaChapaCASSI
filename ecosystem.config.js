/**
 * PM2 Ecosystem Config — SuaChapaCASSI
 * Porta 3001 (3000 reservada para outro projeto no servidor)
 *
 * Comandos úteis:
 *   pm2 start ecosystem.config.js
 *   pm2 reload ecosystem.config.js
 *   pm2 stop suachapacassi
 *   pm2 logs suachapacassi
 */

module.exports = {
  apps: [
    {
      name: "suachapacassi",
      cwd: "/var/www/SuaChapaCASSI",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      // Reinicia automaticamente se o processo travar
      autorestart: true,
      // Aguarda 3s antes de considerar o app estável
      min_uptime: "3s",
      max_restarts: 5,
    },
  ],
};
