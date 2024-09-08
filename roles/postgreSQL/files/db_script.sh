#!/bin/bash

# Variables
DB_USER="rober_user1"
DB_PASSWORD="roberto1"
DB_NAME="roberto_db1"

# Mise à jour du système et installation de PostgreSQL
echo "Mise à jour du système et installation de PostgreSQL..."
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Création de l'utilisateur PostgreSQL avec un mot de passe
echo "Création de l'utilisateur PostgreSQL..."
sudo -i -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Création de la base de données et assignation de l'utilisateur comme propriétaire
echo "Création de la base de données et assignation de l'utilisateur..."
sudo -i -u postgres createdb -O $DB_USER $DB_NAME

# Attribution de tous les privilèges à l'utilisateur sur la base de données
echo "Attribution des privilèges à l'utilisateur..."
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Test de la connexion à la base de données
echo "Test de la connexion à la base de données..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -h localhost -c "\q"

if [ $? -eq 0 ]; then
    echo "Connexion réussie à la base de données '$DB_NAME' avec l'utilisateur '$DB_USER'."
else
    echo "Échec de la connexion à la base de données '$DB_NAME' avec l'utilisateur '$DB_USER'."
fi


