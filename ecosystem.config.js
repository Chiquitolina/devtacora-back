module.exports = {
  apps: [
    {
      name: "devtacora-backend", // Este es el nombre del proceso en PM2, lo que ves con "pm2 list"
      script: "./dist/index.js", // Este es el archivo que se ejecuta
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
