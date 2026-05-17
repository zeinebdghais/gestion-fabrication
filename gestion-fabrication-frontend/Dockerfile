# ===== ÉTAPE 1 : Build Angular =====
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json et installer les dépendances (cache Docker)
COPY package*.json ./
RUN npm install

# Copier le code source et builder en production
COPY . .
RUN npm run build -- --configuration=production

# ===== ÉTAPE 2 : Servir avec Nginx =====
FROM nginx:alpine

# Copier le build Angular vers Nginx
# outputPath dans angular.json = dist/gestion-fabrication-frontend/browser
COPY --from=build /app/dist/gestion-fabrication-frontend/browser /usr/share/nginx/html

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80