module.exports = {
  apps: [
    {
      name: "devtacora-dev",
      script: "./dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
