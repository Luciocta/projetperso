# Utilisation d'une image Python
FROM python:3.9

# Définition du dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY server.py .
COPY requirements.txt .

# Installation des dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port FastAPI
EXPOSE 8000

# Lancer FastAPI
CMD ["python", "server.py"]
