# Utilisation d'une image Node.js
FROM node:18

# Définition du dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet
COPY . .

# Construire l’application React
RUN npm run build

# Exposer le port du serveur React
EXPOSE 3000

# Lancer le serveur de développement (si besoin)
CMD ["npm", "start"]
