 
---

### **1. Mise en Place de l’Environnement de Lab**

#### **Étape 1 : Installation des Prérequis**

Assure-toi d'avoir installé les outils suivants sur ton ordinateur :

- **Vagrant** : Un outil pour créer et gérer des machines virtuelles. 
  - **Télécharger Vagrant :** [Télécharger Vagrant](https://www.vagrantup.com/downloads)
  - **Vérifier l'installation :**
    ```bash
    vagrant --version
    ```
  
- **VirtualBox** : Un hyperviseur gratuit pour exécuter les machines virtuelles.
  - **Télécharger VirtualBox :** [Télécharger VirtualBox](https://www.virtualbox.org/wiki/Downloads)
  - **Vérifier l'installation :**
    ```bash
    VBoxManage --version
    ```

- **Ansible** : Un outil d'automatisation pour gérer les configurations et déployer des applications.
  - **Installer Ansible sur Ubuntu/Debian :**
    ```bash
    sudo apt update
    sudo apt install ansible -y
    ```
  - **Installer Ansible sur macOS avec Homebrew :**
    ```bash
    brew install ansible
    ```
  - **Vérifier l'installation d'Ansible :**
    ```bash
    ansible --version
    ```

#### **Étape 2 : Créer le Répertoire de Travail**

1. **Créer un répertoire pour tous les laboratoires :**
   - Ouvre un terminal et exécute les commandes suivantes :
     ```bash
     mkdir ansible-labs
     cd ansible-labs
     ```

2. **Créer un fichier `Vagrantfile` :**
   - Crée un fichier `Vagrantfile` dans le répertoire `ansible-labs` :
     ```bash
     touch Vagrantfile
     ```

#### **Étape 3 : Configurer le Fichier Vagrantfile**

Ajoute le contenu suivant dans ton `Vagrantfile` pour définir les différentes VMs nécessaires pour les labs :

```ruby
# Vagrantfile
Vagrant.configure("2") do |config|
  # Configuration pour le serveur Nginx
  config.vm.define "nginx_server" do |nginx|
    nginx.vm.box = "ubuntu/bionic64"
    nginx.vm.network "private_network", type: "dhcp" # Utilise DHCP pour obtenir une adresse IP
    nginx.vm.hostname = "nginx-server"
  end

  # Configuration pour le serveur PostgreSQL
  config.vm.define "postgres_server" do |postgres|
    postgres.vm.box = "ubuntu/bionic64"
    postgres.vm.network "private_network", type: "dhcp"
    postgres.vm.hostname = "postgres-server"
  end

  # Configuration pour le serveur MongoDB
  config.vm.define "mongodb_server" do |mongodb|
    mongodb.vm.box = "ubuntu/bionic64"
    mongodb.vm.network "private_network", type: "dhcp"
    mongodb.vm.hostname = "mongodb-server"
  end

  # Configuration pour le cluster Ceph
  config.vm.define "ceph_cluster" do |ceph|
    ceph.vm.box = "ubuntu/bionic64"
    ceph.vm.network "private_network", type: "dhcp"
    ceph.vm.hostname = "ceph-cluster"
  end

  # Configuration pour le serveur OpenVPN
  config.vm.define "vpn_server" do |vpn|
    vpn.vm.box = "ubuntu/bionic64"
    vpn.vm.network "private_network", type: "dhcp"
    vpn.vm.hostname = "vpn-server"
  end

  # Configuration pour l'application Node.js
  config.vm.define "nodejs_app" do |nodejs|
    nodejs.vm.box = "ubuntu/bionic64"
    nodejs.vm.network "private_network", type: "dhcp"
    nodejs.vm.hostname = "nodejs-app"
  end
end
```

#### **Étape 4 : Démarrer les VMs avec Vagrant**

1. **Lancer toutes les VMs définies dans le `Vagrantfile` :**
   - Exécute la commande suivante pour démarrer les VMs :
     ```bash
     vagrant up
     ```
   - Cette commande télécharge les images nécessaires, crée les VMs et les configure automatiquement.

2. **Vérifier que toutes les VMs sont démarrées correctement :**
   - Utilise la commande suivante pour vérifier l'état des VMs :
     ```bash
     vagrant status
     ```
   - Toutes les VMs devraient être dans l'état `running`.

---

### **2. Création des Rôles Ansible pour Chaque Lab**

Pour chaque lab, nous allons créer un rôle Ansible distinct. Les rôles permettent de structurer le code de manière modulaire et réutilisable, facilitant ainsi la gestion des configurations.

#### **Structure Standard d’un Rôle Ansible**

Chaque rôle doit suivre la structure suivante :

```bash
roles/
└── <role_name>/
    ├── tasks/
    │   └── main.yml       # Contient les tâches principales du rôle
    ├── handlers/
    │   └── main.yml       # Contient les handlers pour gérer les notifications (ex. : redémarrage de service)
    ├── templates/         # Contient les templates Jinja2 pour les fichiers de configuration
    ├── files/             # Contient les fichiers statiques nécessaires
    ├── vars/
    │   └── main.yml       # Variables spécifiques au rôle
    ├── defaults/
    │   └── main.yml       # Variables par défaut du rôle
    ├── meta/
    │   └── main.yml       # Métadonnées du rôle (dépendances, etc.)
    └── README.md          # Documentation du rôle
```

### **Instructions Détaillées pour Chaque Lab**

---

#### **Lab 1 : Mise en Place et Configuration d’un Serveur Nginx avec Ansible**

1. **Objectif :**
   - Déployer et configurer un serveur Nginx sur une VM Ubuntu pour servir une page web personnalisée.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle :
       ```bash
       mkdir -p roles/nginx_server/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Dans `roles/nginx_server/tasks/main.yml`, ajoute des tâches pour installer Nginx, démarrer le service, et déployer une page web personnalisée.
   - **Configurer les Handlers :**
     - Dans `roles/nginx_server/handlers/main.yml`, ajoute un handler pour redémarrer Nginx si la configuration change.
   - **Variables et Templates :**
     - Utilise des variables pour gérer les paramètres de Nginx dans `defaults/main.yml`.
     - Crée un template Jinja2 pour le fichier de configuration de Nginx dans `templates/`.

3. **Liens Utiles :**
   - [Documentation Nginx](https://nginx.org/en/docs/)
   - [Guide Ansible sur les Rôles](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html)

---

#### **Lab 2 : Déploiement et Configuration d’une Base de Données PostgreSQL**

1. **Objectif :**
   - Installer et configurer PostgreSQL sur une VM, créer des utilisateurs et des bases de données.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle PostgreSQL :
       ```bash
       mkdir -p roles/postgresql_server/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Ajoute des tâches pour installer PostgreSQL, configurer l'accès, et créer des bases de données et utilisateurs.
   - **Variables :**
     - Définit des variables pour les noms de bases de données, utilisateurs, et mots de passe dans `defaults/main.yml`.

3. **Liens Utiles :**
   - [Documentation PostgreSQL](https://www.postgresql.org/docs/)
   - [Modules Ansible pour PostgreSQL](https://docs.ansible.com/ansible/latest/collections/community/postgresql/index.html)

---

#### **Lab 3 : Déploiement et Configuration d’une Base de Données MongoDB**

1. **Objectif :**
   - Installer MongoDB sur une VM, configurer les paramètres de sécurité, et créer des utilisateurs.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle MongoDB :
       ```bash
       mkdir -p roles/mongodb_server/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Ajoute des tâches pour installer MongoDB, configurer les fichiers de configuration, et sécuriser l'accès.
   - **Configurer les Handlers :**
     - Ajoute un handler pour redémarrer MongoDB si les configurations sont modifiées.

3. **Liens Utiles :**
   - [Documentation MongoDB](https://docs.mongodb.com/)
   - [Modules Ansible pour MongoDB](https://docs.ansible.com/ansible/latest/collections/community/mongodb/index.html)

---

#### **Lab 4 : Mise en Place d'un Cluster Ceph pour le Stockage Distribué**

1. **Objectif :**
   - Déployer un cluster Ceph pour le stockage distribué sur plusieurs VMs.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle Ceph :
       ```bash
       mkdir -p roles/ceph_cluster/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Ajoute des tâches pour installer Ceph sur tous les nœuds, configurer les OSDs, Monitors, et MDS.
   - **Variables :**
     - Utilise des variables pour les adresses IP des nœuds et autres paramètres dans `defaults/main.yml`.

3. **Liens Utiles :**
   - [Documentation Ceph](https://docs.ceph.com/en/latest/)
   - [Modules Ansible pour Ceph](https://docs.ansible.com/ansible/latest/collections/community/ceph/index.html)

---

#### **Lab 5 : Gestion des Configurations Réseaux avec Ansible**

1. **Objectif :**
   - Configurer les interfaces réseau, les VLANs, et appliquer les règles de pare-feu sur les VMs.
   - scenarios:
   **Contexte : ***

Votre entreprise déploie une nouvelle application web sécurisée dans un environnement de production virtualisé. Vous devez configurer une machine virtuelle Ubuntu pour qu'elle ait accès à plusieurs réseaux différents, isoler certaines communications via VLAN, et appliquer des règles de pare-feu strictes pour sécuriser l'application.
Objectif :

Configurer une VM Ubuntu pour qu'elle ait accès à deux réseaux différents (un pour la gestion et un pour l'application), créer un VLAN pour isoler les communications internes, et appliquer des règles de pare-feu pour sécuriser les accès au serveur.
Étapes :

    Configurer les interfaces réseau :
        L'interface principale ens33 doit être configurée avec une adresse IP statique dans le réseau de gestion interne (par exemple, 192.168.100.0/24).
        Une deuxième interface ens34 sera utilisée pour la communication de l'application dans le réseau public, avec une adresse IP statique (par exemple, 10.0.0.0/24).
    Configurer un VLAN :
        Ajouter un VLAN avec l'identifiant 20 sur l'interface ens33 pour isoler les communications internes (utilisé pour la communication entre différents services internes). Ce VLAN aura une plage d'adresses IP 192.168.200.0/24.
    Appliquer les règles de pare-feu avec UFW :
        Autoriser uniquement les connexions SSH depuis l'adresse IP du réseau de gestion (192.168.100.0/24).
        Bloquer tout le trafic entrant sur le réseau public sauf le port 80 (HTTP) et le port 443 (HTTPS) pour l'accès à l'application.
        Interdire tout le trafic entre le VLAN (réseau 192.168.200.0/24) et l'extérieur, sauf pour les connexions internes entre services.
        Autoriser les connexions sortantes à Internet pour les mises à jour et les services nécessaires (par exemple, via sudo ufw allow out 53,80,443/tcp).

Livrables attendus :

    Configuration réseau :
        Fichier Netplan montrant la configuration des deux interfaces réseau et du VLAN.
    Configuration du pare-feu :
        Rapport des règles UFW appliquées.
        Statut final de UFW montrant les règles actives (sudo ufw status).
    Tests et vérifications :
        Pings réussis entre la machine virtuelle et une autre machine sur le réseau de gestion.
        Vérification que l'accès HTTP/HTTPS fonctionne depuis le réseau public et que SSH est accessible uniquement depuis le réseau de gestion.
        Vérification que le trafic est isolé entre le VLAN et le réseau public.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle Network Configuration :
       ```bash
       mkdir -p roles/network_configuration/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Ajoute des tâches pour configurer les interfaces réseau en utilisant des templates Jinja2 pour générer les fichiers de configuration.
   - **Configurer les Handlers :**
     - Ajoute un handler pour redémarrer les services réseau si nécessaire.

3. **Liens Utiles :**
   - [Documentation sur la Configuration Réseau](https://wiki.debian.org/NetworkConfiguration)
   - [Modules Ansible pour les Configurations Réseaux](https://docs.ansible.com/ansible/latest/collections/ansible/netcommon/index.html)

---

#### **Lab 6 : Déploiement et Configuration de OpenVPN avec Ansible**

1. **Objectif :**
   - Installer et configurer un serveur OpenVPN pour sécuriser les communications réseau.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle OpenVPN :
       ```bash
       mkdir -p roles/openvpn_server/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Ajoute des tâches pour installer OpenVPN, générer les certificats et les clés, configurer les clients et le routage.
   - **Configurer les Handlers :**
     - Ajoute un handler pour redémarrer OpenVPN après les modifications.

3. **Liens Utiles :**
   - [Documentation OpenVPN](https://openvpn.net/community-resources/how-to/)
   - [Modules Ansible pour OpenVPN](https://galaxy.ansible.com/angristan/openvpn)

---

#### **Lab 7 : Déploiement d'une Application Node.js avec Ansible**

1. **Objectif :**
   - Déployer une application Node.js sur une VM, configurer le service pour démarrer avec PM2, et gérer les déploiements.

2. **Étapes :**
   - **Créer le Rôle :**
     - Crée un répertoire pour le rôle Node.js Application :
       ```bash
       mkdir -p roles/nodejs_app/{tasks,handlers,templates,files,vars,defaults,meta}
       ```
   - **Configurer les Tâches :**
     - Ajoute des tâches pour installer Node.js, cloner l'application depuis un dépôt Git, installer les dépendances, et utiliser PM2 pour gérer les processus.
   - **Configurer les Handlers :**
     - Ajoute un handler pour redémarrer l'application avec PM2 après les mises à jour.

3. **Liens Utiles :**
   - [Documentation Node.js](https://nodejs.org/en/docs/)
   - [Guide PM2](https://pm2.keymetrics.io/)

---

### **Exécution Globale des Rôles**

1. **Créer un Playbook Principal :**
   - Crée un playbook principal `main_playbook.yml` qui inclut tous les rôles pour chaque lab :
     ```yaml
     ---
     - hosts: nginx_server
       roles:
         - nginx_server

     - hosts: postgres_server
       roles:
         - postgresql_server

     - hosts: mongodb_server
       roles:
         - mongodb_server

     - hosts: ceph_cluster
       roles:
         - ceph_cluster

     - hosts: vpn_server
       roles:
         - openvpn_server

     - hosts: nodejs_app
       roles:
         - nodejs_app
     ```

2. **Exécuter le Playbook Principal :**
   - Utilise la commande suivante pour exécuter le playbook principal et appliquer tous les rôles :
     ```bash
     ansible-playbook -i inventory main_playbook.yml
     ```
   - Vérifie les sorties et assure-toi que toutes les tâches sont exécutées correctement.
