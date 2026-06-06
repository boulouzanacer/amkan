module.exports = {
  apps: [
    {
      name: "amkan-web",
      cwd: "/var/www/amkan/apps/web",
      script: "../../node_modules/next/dist/bin/next",
      args: "start --hostname 127.0.0.1 --port 3000",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
