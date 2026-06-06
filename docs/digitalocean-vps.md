# Déploiement sur VPS DigitalOcean

Guide pour un VPS Ubuntu vierge avec Node.js, MySQL local, Prisma, PM2 et Nginx.

## 1. Connexion

```bash
ssh root@165.227.130.135
```

## 2. Mise à jour du serveur

```bash
apt update && apt upgrade -y
apt install -y git curl ufw nginx mysql-server
```

## 3. Node.js LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

## 4. Pare-feu

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

## 5. Swap pour petit VPS

Sur un VPS 1 Go RAM, `npm ci` ou `next build` peut être tué avec `Killed`. Ajouter un swap évite ce blocage.

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h
```

## 6. Base MySQL

```bash
mysql
```

Dans MySQL:

```sql
CREATE DATABASE amkan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'amkan_user'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON amkan.* TO 'amkan_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 7. Cloner et installer l'application web

Le monorepo contient aussi une app mobile Expo. Sur le VPS web, installer uniquement la racine + `apps/web` évite de télécharger les dépendances React Native inutiles en production serveur.

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/boulouzanacer/amkan.git
cd amkan
npm ci --workspace @amkan/web --include-workspace-root
```

Si une installation précédente a été tuée, nettoyer puis relancer:

```bash
rm -rf node_modules apps/web/node_modules apps/mobile/node_modules
npm cache clean --force
npm ci --workspace @amkan/web --include-workspace-root
```

## 8. Variables d'environnement

```bash
nano .env
```

Exemple minimal:

```env
DATABASE_URL="mysql://amkan_user:CHANGE_THIS_PASSWORD@localhost:3306/amkan"
NEXTAUTH_SECRET="CHANGE_THIS_LONG_RANDOM_SECRET"
NEXTAUTH_URL="http://165.227.130.135"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
FIREBASE_API_KEY=""
FIREBASE_AUTH_DOMAIN=""
FIREBASE_PROJECT_ID=""
FIREBASE_STORAGE_BUCKET=""
FIREBASE_MESSAGING_SENDER_ID=""
FIREBASE_APP_ID=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

Rendre les mêmes variables disponibles pour Next.js en production:

```bash
cp .env apps/web/.env.production
```

Générer `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## 9. Prisma et build

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run build
```

## 10. Lancer avec PM2

```bash
npm install -g pm2
pm2 start npm --name amkan-web -- run start -- --hostname 127.0.0.1 --port 3000
pm2 save
pm2 startup systemd
```

Après `pm2 startup systemd`, exécuter la commande affichée par PM2.

## 11. Nginx reverse proxy

```bash
nano /etc/nginx/sites-available/amkan
```

Contenu:

```nginx
server {
    listen 80;
    server_name 165.227.130.135;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer:

```bash
ln -s /etc/nginx/sites-available/amkan /etc/nginx/sites-enabled/amkan
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

L'application sera disponible sur:

```text
http://165.227.130.135
```

## 12. Mise à jour après un nouveau push

```bash
cd /var/www/amkan
git pull
npm ci --workspace @amkan/web --include-workspace-root
cp .env apps/web/.env.production
npm run db:generate
npm run db:push
npm run build
pm2 restart amkan-web
```
