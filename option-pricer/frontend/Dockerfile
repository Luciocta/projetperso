# Utilisation de Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application React
RUN npm run build

# Exposer le port de l'application
EXPOSE 3000

# Lancer le serveur de développement
CMD ["npm", "start"]
