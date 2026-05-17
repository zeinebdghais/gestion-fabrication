# 🏭 Gestion de Fabrication

Application web de gestion de fabrication industrielle permettant de gérer les produits, machines, employés et ordres de fabrication.

---

## 📋 Description du projet

**Gestion de Fabrication** est une application full-stack développée dans le cadre d'un projet académique à **ITBS**. Elle permet à une entreprise de fabrication de gérer efficacement ses ressources et ses ordres de production.

### Fonctionnalités principales

- 📦 **Gestion des produits** — Ajout, modification, suppression et consultation des produits avec leur stock et fournisseur
- ⚙️ **Gestion des machines** — Suivi des machines, leur état et leurs dernières maintenances
- 👷 **Gestion des employés** — Gestion du personnel et leur affectation aux machines
- 📋 **Ordres de fabrication** — Création et suivi des ordres de fabrication avec leur état d'avancement
- 📊 **Dashboard** — Vue d'ensemble des statistiques de production

---

## 🛠️ Technologies utilisées

### Backend

| Technologie       | Version | Rôle                          |
| ----------------- | ------- | ----------------------------- |
| Java              | 17      | Langage principal             |
| Spring Boot       | 4.0.5   | Framework backend             |
| Spring Data JPA   | -       | Accès base de données         |
| Hibernate         | 7.2.7   | ORM                           |
| MySQL             | 8.0     | Base de données               |
| Lombok            | 1.18.44 | Réduction du code boilerplate |
| ModelMapper       | 3.2.2   | Conversion DTO/Entités        |
| SpringDoc OpenAPI | 2.5.0   | Documentation API (Swagger)   |
| Maven             | 3.9     | Gestionnaire de dépendances   |

### Frontend

| Technologie     | Version | Rôle                   |
| --------------- | ------- | ---------------------- |
| Angular         | 18      | Framework frontend     |
| TypeScript      | -       | Langage principal      |
| Bootstrap       | -       | Framework CSS          |
| Bootstrap Icons | -       | Icônes                 |
| RxJS            | -       | Programmation réactive |

### DevOps

| Technologie    | Rôle                         |
| -------------- | ---------------------------- |
| Docker         | Conteneurisation             |
| Docker Compose | Orchestration des conteneurs |
| Nginx          | Serveur web frontend         |

---

## 🏗️ Architecture du projet

```
gestion-fabrication/
├── gestion-fabrication-backend/        # API Spring Boot
│   ├── src/main/java/tn/itbs/fabrication/
│   │   ├── config/                     # Configuration CORS, ModelMapper
│   │   ├── controllers/                # Contrôleurs REST
│   │   ├── services/                   # Logique métier
│   │   ├── repositories/               # Accès base de données
│   │   ├── entities/                   # Entités JPA
│   │   ├── dto/                        # Data Transfer Objects
│   │   └── converters/                 # Convertisseurs DTO/Entités
│   ├── src/main/resources/
│   │   └── application.properties      # Configuration Spring Boot
│   ├── Dockerfile                      # Image Docker backend
│   └── pom.xml                         # Dépendances Maven
│
├── gestion-fabrication-frontend/       # Application Angular
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── models/                 # Interfaces TypeScript
│   │   │   └── services/               # Services HTTP
│   │   ├── features/
│   │   │   ├── dashboard/              # Tableau de bord
│   │   │   ├── produits/               # Gestion produits
│   │   │   ├── machines/               # Gestion machines
│   │   │   ├── employes/               # Gestion employés
│   │   │   └── ordres-fabrication/     # Gestion ordres
│   │   └── shared/                     # Composants partagés
│   ├── Dockerfile                      # Image Docker frontend
│   ├── nginx.conf                      # Configuration Nginx
│   └── proxy.conf.json                 # Proxy développement
│
└── docker-compose.yml                  # Orchestration Docker
```

---

## 🚀 Installation et exécution

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- [Git](https://git-scm.com/) installé

### ▶️ Lancement avec Docker (recommandé)

**1. Cloner le projet**

```bash
git clone https://github.com/zeinebdghais/gestion-fabrication.git
cd gestion-fabrication
```

**2. Lancer tous les services**

```bash
docker-compose up --build
```

> ⏳ Le premier lancement peut prendre quelques minutes (téléchargement des images Docker).

**3. Accéder à l'application**

| Service               | URL                                         |
| --------------------- | ------------------------------------------- |
| 🌐 Frontend (Angular) | http://localhost:4200                       |
| ⚙️ Backend (API REST) | http://localhost:8080                       |
| 📖 Documentation API  | http://localhost:8080/swagger-ui/index.html |
| 🗄️ MySQL              | localhost:3307                              |

**4. Arrêter l'application**

```bash
docker-compose down
```

**5. Arrêter et supprimer les données**

```bash
docker-compose down -v
```

---

### ⚙️ Lancement sans Docker (développement)

#### Backend

**Prérequis supplémentaires :** Java 17, Maven, MySQL local

```bash
cd gestion-fabrication-backend

# Créer la base de données MySQL
# Assurez-vous que MySQL tourne sur le port 3306

# Lancer le backend
./mvnw spring-boot:run
```

Le backend démarre sur **http://localhost:8080**

#### Frontend

**Prérequis supplémentaires :** Node.js 20+, Angular CLI

```bash
cd gestion-fabrication-frontend

# Installer les dépendances
npm install

# Lancer en mode développement (avec proxy vers le backend)
ng serve
```

Le frontend démarre sur **http://localhost:4200**

---

## 🗄️ Base de données

L'application utilise **MySQL** avec les tables suivantes :

| Table               | Description                                    |
| ------------------- | ---------------------------------------------- |
| `produit`           | Produits avec nom, type, stock et fournisseur  |
| `machine`           | Machines avec nom, état et date de maintenance |
| `employe`           | Employés avec nom, poste et machine assignée   |
| `ordre_fabrication` | Ordres avec projet, quantité, état et date     |

> Les tables sont créées **automatiquement** au premier démarrage grâce à `spring.jpa.hibernate.ddl-auto=update`.

---

## 📡 API REST

| Méthode | Endpoint         | Description               |
| ------- | ---------------- | ------------------------- |
| GET     | `/produits`      | Liste tous les produits   |
| POST    | `/produits`      | Créer un produit          |
| PUT     | `/produits/{id}` | Modifier un produit       |
| DELETE  | `/produits/{id}` | Supprimer un produit      |
| GET     | `/machines`      | Liste toutes les machines |
| POST    | `/machines`      | Créer une machine         |
| PUT     | `/machines/{id}` | Modifier une machine      |
| DELETE  | `/machines/{id}` | Supprimer une machine     |
| GET     | `/employes`      | Liste tous les employés   |
| POST    | `/employes`      | Créer un employé          |
| PUT     | `/employes/{id}` | Modifier un employé       |
| DELETE  | `/employes/{id}` | Supprimer un employé      |
| GET     | `/ordres`        | Liste tous les ordres     |
| POST    | `/ordres`        | Créer un ordre            |
| PUT     | `/ordres/{id}`   | Modifier un ordre         |
| DELETE  | `/ordres/{id}`   | Supprimer un ordre        |

> 📖 Documentation complète disponible sur **http://localhost:8080/swagger-ui/index.html**

---

## 👩‍💻 Auteur

**Zeineb Dghai**
Étudiante en 2ème année — ITBS
Année universitaire 2025/2026
